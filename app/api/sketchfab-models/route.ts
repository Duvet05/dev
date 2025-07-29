import { NextRequest, NextResponse } from 'next/server'
import { SKETCHFAB_CONFIG } from '@/lib/sketchfab-config'

// Cache simple en memoria
const cache = new Map<string, { data: any, timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos

interface SketchfabModel {
  uid: string
  name: string
  description: string
  publishedAt: string
  viewCount: number
  likeCount: number
  downloadCount: number
  triangleCount?: number
  vertexCount?: number
  categories?: string[]
  tags?: string[]
  animatedTagUrl?: string
}

interface Project {
  title: string
  type: string
  status: string
  description: string
  tech: string[]
  date: string
  fileSize: string
  renderTime: string
  complexity: string
  sketchfabUid: string
  // Información adicional de Sketchfab
  triangles?: number
  vertices?: number
  likes?: number
  views?: number
  downloads?: number
  author?: string
  license?: string
  categories?: string[]
  tags?: string[]
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const username = searchParams.get('username') || SKETCHFAB_CONFIG.username
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '6')
  
  // Verificar cache para todos los modelos del usuario
  const cacheKey = `all_models_${username}`
  const cachedData = cache.get(cacheKey)
  
  let allModels: SketchfabModel[] = []
  
  if (cachedData && (Date.now() - cachedData.timestamp) < CACHE_DURATION) {
    console.log(`Using cached models for ${username}`)
    allModels = cachedData.data
  } else {
    // Fetch fresh data y cachear todos los modelos
    try {
      const profileResponse = await fetch(`https://sketchfab.com/${username}`)
      const profileHtml = await profileResponse.text()
      
      const modelsResponse = await fetch(`https://sketchfab.com/${username}/models`)
      const modelsHtml = await modelsResponse.text()
      
      allModels = parseModelsFromHtml(modelsHtml)
      
      // Cachear todos los modelos
      cache.set(cacheKey, { data: allModels, timestamp: Date.now() })
      console.log(`Cached ${allModels.length} models for ${username}`)
    } catch (error) {
      console.error('Error fetching models:', error)
      return NextResponse.json({
        success: true,
        username,
        page,
        totalModels: 0,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
        usingFallback: true,
        projects: SKETCHFAB_CONFIG.fallbackProjects
      })
    }
  }
  
  // Calcular paginación
  const totalModels = allModels.length
  const totalPages = Math.ceil(totalModels / limit)
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedModels = allModels.slice(startIndex, endIndex)
  
  try {
    // Convertir modelos paginados a proyectos
    const projects = await convertToProjects(paginatedModels, username)
    
    // Si no hay proyectos válidos en esta página, usar fallback solo para la primera página
    if (projects.length === 0 && page === 1) {
      console.warn(`No valid models found for ${username} page ${page}, using fallback`)
      const fallbackResult = {
        success: true,
        username,
        page: 1,
        totalModels: 0,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
        usingFallback: true,
        projects: SKETCHFAB_CONFIG.fallbackProjects
      }
      
      return NextResponse.json(fallbackResult)
    }
    
    // Resultado exitoso con paginación
    const successResult = {
      success: true,
      username,
      page,
      totalModels,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      validModels: projects.length,
      usingFallback: false,
      projects
    }
    
    return NextResponse.json(successResult)
    
  } catch (error) {
    console.error('Error processing models:', error)
    
    // En caso de error, usar fallback solo para primera página
    if (page === 1) {
      const fallbackResult = {
        success: true,
        username,
        page: 1,
        totalModels: 0,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
        usingFallback: true,
        projects: SKETCHFAB_CONFIG.fallbackProjects
      }
      
      return NextResponse.json(fallbackResult)
    } else {
      return NextResponse.json({
        success: false,
        error: 'Page not found'
      }, { status: 404 })
    }
  }
}

function parseModelsFromHtml(html: string): SketchfabModel[] {
  const models: SketchfabModel[] = []
  
  // Buscar enlaces a modelos 3D usando regex
  const modelRegex = /\/3d-models\/([^\/]+)-([a-f0-9]{32})/g
  const matches = [...html.matchAll(modelRegex)]
  
  for (const match of matches) {
    const [, slug, uid] = match
    
    // Evitar duplicados
    if (!models.find(m => m.uid === uid)) {
      models.push({
        uid,
        name: slug.replace(/-/g, ' '),
        description: '',
        publishedAt: '',
        viewCount: 0,
        likeCount: 0,
        downloadCount: 0
      })
    }
  }
  
  return models
}

async function convertToProjects(models: SketchfabModel[], username: string): Promise<Project[]> {
  const projects: Project[] = []
  
  // Procesar todos los modelos que se le pasen (ya vienen paginados)
  for (const model of models) {
    try {
      console.log(`Processing model: ${model.uid}`)
      
      // Crear proyecto básico primero
      const project: Project = {
        title: formatTitle(model.name),
        type: categorizeModel(model.name, []),
        status: getRandomStatus(),
        description: `3D model "${model.name}" created by ${username}`,
        tech: inferTechnology({ triangleCount: 5000 }),
        date: formatDate(''),
        fileSize: estimateFileSize(5000),
        renderTime: "Live",
        complexity: getComplexity(5000),
        sketchfabUid: model.uid
      }
      
      // Intentar obtener detalles adicionales con timeout más corto
      try {
        const modelDetails = await Promise.race([
          fetchModelDetails(model.uid),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Details fetch timeout')), 4000)
          )
        ]) as any
        
        // Actualizar proyecto con detalles si están disponibles
        if (modelDetails) {
          project.title = formatTitle(modelDetails.title || model.name)
          project.description = modelDetails.description || project.description
          project.type = categorizeModel(modelDetails.title || model.name, modelDetails.categories)
          project.tech = inferTechnology(modelDetails)
          project.date = formatDate(modelDetails.publishedAt)
          project.fileSize = estimateFileSize(modelDetails.triangleCount)
          project.complexity = getComplexity(modelDetails.triangleCount)
          
          // Agregar información extra como propiedades adicionales
          project.triangles = modelDetails.triangleCount
          project.vertices = modelDetails.vertexCount
          project.likes = modelDetails.likes
          project.views = modelDetails.views
          project.downloads = modelDetails.downloads
          project.author = modelDetails.author
          project.license = modelDetails.license
          project.categories = modelDetails.categories
          project.tags = modelDetails.tags
        }
      } catch (detailError) {
        console.warn(`Could not fetch details for ${model.uid}, using defaults:`, detailError)
        // Proyecto básico ya creado arriba
      }
      
      projects.push(project)
      
      // Pequeña pausa entre peticiones para evitar rate limiting
      await new Promise(resolve => setTimeout(resolve, 200))
      
    } catch (error) {
      console.warn(`Error processing model ${model.uid}:`, error)
      continue
    }
  }
  
  console.log(`Successfully processed ${projects.length} models out of ${models.length}`)
  
  return projects
}

async function fetchModelDetails(uid: string) {
  try {
    const response = await fetch(`https://sketchfab.com/3d-models/${uid}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })
    
    if (!response.ok) {
      console.warn(`HTTP ${response.status} for model ${uid}`)
      return null
    }
    
    const html = await response.text()
    
    // Verificaciones básicas de privacidad
    if (html.includes('This model is private') || 
        html.includes('Access denied') ||
        html.includes('Model not found') ||
        html.includes('404')) {
      console.warn(`Model ${uid} is private or not found`)
      return null
    }
    
    // Extraer título del modelo
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
    const title = titleMatch?.[1]?.replace(' - Download Free 3D model by', '').replace(' - 3D model by', '').trim()
    
    // Extraer descripción del modelo
    let description = ''
    const descriptionMatch = html.match(/<meta\s+property="og:description"\s+content="([^"]+)"/i) ||
                            html.match(/<meta\s+name="description"\s+content="([^"]+)"/i)
    if (descriptionMatch) {
      description = descriptionMatch[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&').trim()
    }
    
    // Extraer estadísticas del modelo
    const trianglesMatch = html.match(/Triangles[:\s]*([0-9,k.]+)/i)
    const verticesMatch = html.match(/Vertices[:\s]*([0-9,k.]+)/i)
    const likesMatch = html.match(/(\d+(?:,\d+)*)\s*likes?/i) || html.match(/"likeCount":(\d+)/i)
    const viewsMatch = html.match(/(\d+(?:,\d+)*k?)\s*views?/i) || html.match(/"viewCount":(\d+)/i)
    const downloadsMatch = html.match(/(\d+(?:,\d+)*k?)\s*downloads?/i) || html.match(/"downloadCount":(\d+)/i)
    
    // Extraer fecha de publicación
    const publishedMatch = html.match(/Published\s+(\d+)\s+(years?|months?|days?)\s+ago/i) ||
                          html.match(/(\w+\s+\d+(?:st|nd|rd|th)?\s+\d{4})/i)
    
    let publishedAt = '2024.01.01'
    if (publishedMatch) {
      const [, time, unit] = publishedMatch
      if (unit && unit.includes('year')) {
        const yearsAgo = parseInt(time)
        publishedAt = `${2025 - yearsAgo}.01.01`
      } else if (unit && unit.includes('month')) {
        publishedAt = '2024.06.01'
      } else if (unit && unit.includes('day')) {
        publishedAt = '2024.12.01'
      } else if (publishedMatch[1].includes('2024') || publishedMatch[1].includes('2023') || publishedMatch[1].includes('2022')) {
        // Si es una fecha completa, intentar parsearla
        const dateStr = publishedMatch[1]
        if (dateStr.includes('2024')) publishedAt = '2024.01.01'
        else if (dateStr.includes('2023')) publishedAt = '2023.01.01'
        else if (dateStr.includes('2022')) publishedAt = '2022.01.01'
      }
    }
    
    // Extraer categorías
    const categories: string[] = []
    const categoryMatches = html.match(/category[^>]*>([^<]+)</gi)
    if (categoryMatches) {
      categoryMatches.forEach(match => {
        const category = match.replace(/<[^>]*>/g, '').trim()
        if (category) categories.push(category)
      })
    }
    
    // Extraer tags
    const tags: string[] = []
    const tagMatches = html.match(/tag[^>]*>([^<]+)</gi) || html.match(/"tags":\s*\[([^\]]+)\]/i)
    if (tagMatches) {
      if (typeof tagMatches[1] === 'string') {
        // Si es del JSON
        const tagStr = tagMatches[1].replace(/"/g, '')
        tags.push(...tagStr.split(',').map(t => t.trim()).filter(t => t))
      } else {
        // Si es del HTML
        tagMatches.forEach(match => {
          const tag = match.replace(/<[^>]*>/g, '').trim()
          if (tag) tags.push(tag)
        })
      }
    }
    
    // Extraer autor
    const authorMatch = html.match(/by\s+([^<\n]+)/i) || html.match(/"username":"([^"]+)"/i)
    const author = authorMatch?.[1]?.trim()
    
    // Extraer licencia
    const licenseMatch = html.match(/License[:\s]*([^<\n]+)/i) || html.match(/CC\s+Attribution/i)
    const license = licenseMatch?.[1]?.trim() || (licenseMatch ? 'CC Attribution' : 'Unknown')
    
    return {
      title: title || `Model ${uid.substring(0, 8)}`,
      description: description || '',
      triangleCount: parseNumber(trianglesMatch?.[1]) || 5000,
      vertexCount: parseNumber(verticesMatch?.[1]) || 3000,
      publishedAt,
      categories,
      tags: tags.slice(0, 5), // Limitar a 5 tags
      author: author || 'Unknown',
      license,
      likes: parseNumber(likesMatch?.[1]) || 0,
      views: parseNumber(viewsMatch?.[1]) || 0,
      downloads: parseNumber(downloadsMatch?.[1]) || 0
    }
  } catch (error) {
    console.warn(`Failed to fetch details for model ${uid}:`, error)
    return null
  }
}

function parseNumber(str?: string): number {
  if (!str) return 0
  
  const cleaned = str.replace(/,/g, '').toLowerCase()
  
  if (cleaned.includes('k')) {
    return Math.round(parseFloat(cleaned.replace('k', '')) * 1000)
  }
  
  if (cleaned.includes('m')) {
    return Math.round(parseFloat(cleaned.replace('m', '')) * 1000000)
  }
  
  return parseInt(cleaned) || 0
}

function formatTitle(name: string): string {
  return name
    .toUpperCase()
    .replace(/\s+/g, '_')
    .replace(/[^A-Z0-9_]/g, '')
    + '.DEMO'
}

function categorizeModel(name: string, categories?: string[]): string {
  // Primero intentar usar las categorías reales de Sketchfab
  if (categories && categories.length > 0) {
    const category = categories[0].toLowerCase()
    
    if (category.includes('car') || category.includes('vehicle') || category.includes('transport')) return 'VEHICLE'
    if (category.includes('character') || category.includes('creature') || category.includes('people')) return 'CHARACTER'
    if (category.includes('building') || category.includes('architecture') || category.includes('environment')) return 'ENVIRONMENT'
    if (category.includes('food') || category.includes('kitchen')) return 'FOOD'
    if (category.includes('animal') || category.includes('creature')) return 'CREATURE'
    if (category.includes('weapon') || category.includes('military')) return 'WEAPON'
    if (category.includes('furniture') || category.includes('household')) return 'FURNITURE'
    if (category.includes('electronics') || category.includes('technology')) return 'TECH'
    if (category.includes('fashion') || category.includes('clothing')) return 'FASHION'
    if (category.includes('art') || category.includes('sculpture')) return 'ART'
    
    // Si hay categoría pero no coincide con las conocidas, usar la primera
    return categories[0].toUpperCase().replace(/\s+/g, '_')
  }
  
  // Fallback al análisis del nombre
  const nameLC = name.toLowerCase()
  
  if (nameLC.includes('car') || nameLC.includes('vehicle') || nameLC.includes('auto')) return 'VEHICLE'
  if (nameLC.includes('horse') || nameLC.includes('animal') || nameLC.includes('toy')) return 'TOY'
  if (nameLC.includes('machine') || nameLC.includes('vending') || nameLC.includes('building')) return 'ENVIRONMENT'
  if (nameLC.includes('food') || nameLC.includes('ramen') || nameLC.includes('breakfast')) return 'FOOD'
  if (nameLC.includes('phone') || nameLC.includes('telephone') || nameLC.includes('retro')) return 'RETRO'
  if (nameLC.includes('character') || nameLC.includes('person') || nameLC.includes('human')) return 'CHARACTER'
  
  return 'OBJECT'
}

function getRandomStatus(): string {
  const statuses = ['COMPLETE', 'COMPLETE', 'COMPLETE', 'ACTIVE'] // Más peso a COMPLETE
  return statuses[Math.floor(Math.random() * statuses.length)]
}

function inferTechnology(details: any): string[] {
  const tech = ['SKETCHFAB']
  
  // Inferir tecnologías basadas en complejidad y características
  if (details.triangleCount > 50000) {
    tech.push('PBR', 'SUBSTANCE')
  } else if (details.triangleCount > 10000) {
    tech.push('PBR')
  }
  
  if (details.triangleCount < 1000) {
    tech.push('LOWPOLY')
  }
  
  // Agregar herramientas comunes
  const tools = ['BLENDER', '3DS MAX', 'MAYA', 'PHOTOSHOP']
  tech.push(tools[Math.floor(Math.random() * tools.length)])
  
  return tech
}

function formatDate(dateStr: string): string {
  if (!dateStr || dateStr === '2024.01.01') {
    // Generar fecha aleatoria en los últimos 5 años
    const years = [2020, 2021, 2022, 2023, 2024]
    const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
    const days = ['01', '15', '28']
    
    return `${years[Math.floor(Math.random() * years.length)]}.${months[Math.floor(Math.random() * months.length)]}.${days[Math.floor(Math.random() * days.length)]}`
  }
  
  return dateStr
}

function estimateFileSize(triangleCount?: number): string {
  if (!triangleCount) return '5.0MB'
  
  if (triangleCount < 1000) return `${(Math.random() * 2 + 1).toFixed(1)}MB`
  if (triangleCount < 10000) return `${(Math.random() * 10 + 5).toFixed(1)}MB`
  if (triangleCount < 50000) return `${(Math.random() * 20 + 10).toFixed(1)}MB`
  
  return `${(Math.random() * 30 + 20).toFixed(1)}MB`
}

function getComplexity(triangleCount?: number): string {
  if (!triangleCount) return 'MEDIUM'
  
  if (triangleCount < 1000) return 'LOW'
  if (triangleCount < 10000) return 'MEDIUM'
  if (triangleCount < 50000) return 'HIGH'
  
  return 'EXTREME'
}
