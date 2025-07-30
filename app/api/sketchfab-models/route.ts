import { NextRequest, NextResponse } from 'next/server'
import { SKETCHFAB_CONFIG } from '@/lib/sketchfab-config'

// Cache simple en memoria
const cache = new Map<string, { data: any, timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos

// Constantes de la API de Sketchfab v3
const SKETCHFAB_API_BASE = 'https://api.sketchfab.com/v3'

interface Project {
  title: string;
  source: string; // Nuevo campo para el origen
  description: string;
  date: string;
  fileSize: string;
  renderTime: string;
  complexity: string;
  sketchfabUid: string;
  // Información adicional de Sketchfab API
  triangles?: number;
  vertices?: number;
  likes?: number;
  views?: number;
  downloads?: number;
  author?: string;
  license?: string;
  categories?: string[];
  tags?: string[];
  // Previews de imágenes de la API
  thumbnails?: {
    small: string;      // 200x200
    medium: string;     // 640x360 o 720x405
    large: string;      // 1024x576
  };
  viewerUrl?: string;
  embedUrl?: string;
  publishedAt?: string;
}

// Función principal para obtener modelos usando exclusivamente la API oficial de Sketchfab
async function fetchModelsFromSketchfabAPI(username: string, page: number = 1, limit: number = 6, orderBy: string = "date-desc") {
  try {
    const offset = (page - 1) * limit
    // Mapear orderBy a sort_by de Sketchfab
    let sort_by = "-publishedAt";
    switch (orderBy) {
      case "date-asc":
        sort_by = "publishedAt";
        break;
      case "date-desc":
        sort_by = "-publishedAt";
        break;
      case "likes-desc":
        sort_by = "-likeCount";
        break;
      case "likes-asc":
        sort_by = "likeCount";
        break;
      case "views-desc":
        sort_by = "-viewCount";
        break;
      case "views-asc":
        sort_by = "viewCount";
        break;
      default:
        sort_by = "-publishedAt";
    }
    console.log(`🔍 Fetching models from Sketchfab API - User: ${username}, Page: ${page}, Limit: ${limit}, OrderBy: ${orderBy}`)
    const apiUrl = `${SKETCHFAB_API_BASE}/models?user=${username}&count=${limit}&offset=${offset}&sort_by=${sort_by}`
    console.log('📡 API URL:', apiUrl)
    const response = await fetch(apiUrl, {
      headers:
       {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; 3D-Portfolio/1.0)'
      }
    })

    console.log('📡 Response status:', response.status)
    console.log('📡 Response OK:', response.ok)

    if (!response.ok) {
      throw new Error(`Sketchfab API error: ${response.status} ${response.statusText}`)
    }
    const data = await response.json()
    
    console.log(`📊 API Response: Found ${data.results?.length || 0} models`)
    console.log(`📈 Total available: ${data.count || 'unknown'}`)
    console.log('🔍 Raw API data:', JSON.stringify(data, null, 2))
    
    return {
      models: data.results || [],
      totalCount: data.count || 0,
      next: data.next,
      previous: data.previous
    }
  } catch (error) {
    console.error('❌ Error fetching from Sketchfab API:', error)
    throw error
  }
}

// Nueva función para obtener modelos usando la paginación oficial de Sketchfab (next)
async function fetchModelsFromSketchfabAPIInfinite({ username, nextUrl, limit = 100, orderBy = "date-desc" }: { username: string, nextUrl?: string, limit?: number, orderBy?: string }) {
  let apiUrl = nextUrl;
  if (!apiUrl) {
    // Primera llamada
    let sort_by = "-publishedAt";
    switch (orderBy) {
      case "date-asc": sort_by = "publishedAt"; break;
      case "date-desc": sort_by = "-publishedAt"; break;
      case "likes-desc": sort_by = "-likeCount"; break;
      case "likes-asc": sort_by = "likeCount"; break;
      case "views-desc": sort_by = "-viewCount"; break;
      case "views-asc": sort_by = "viewCount"; break;
      default: sort_by = "-publishedAt";
    }
    apiUrl = `${SKETCHFAB_API_BASE}/models?user=${username}&count=${limit}&sort_by=${sort_by}`;
  }
  const response = await fetch(apiUrl, {
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'Mozilla/5.0 (compatible; 3D-Portfolio/1.0)'
    }
  });
  if (!response.ok) {
    throw new Error(`Sketchfab API error: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  return {
    models: data.results || [],
    next: data.next || null,
    previous: data.previous || null
  };
}

// Nueva función para obtener el total real de modelos públicos
async function fetchTotalModelsFromSketchfabAPI(username: string) {
  // Usar offset=0 para forzar el header X-Total-Count
  const apiUrl = `${SKETCHFAB_API_BASE}/models?user=${username}&count=1&offset=0`;
  const response = await fetch(apiUrl, {
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'Mozilla/5.0 (compatible; 3D-Portfolio/1.0)'
    }
  });
  if (!response.ok) {
    throw new Error(`Sketchfab API error (count): ${response.status} ${response.statusText}`);
  }
  // Sketchfab expone el total en el header X-Total-Count
  const totalCountHeader = response.headers.get('X-Total-Count');
  if (totalCountHeader && !isNaN(Number(totalCountHeader)) && Number(totalCountHeader) > 1) {
    return Number(totalCountHeader);
  }
  // Fallback: consultar el endpoint de usuario para obtener modelCount
  const userUrl = `${SKETCHFAB_API_BASE}/users/${username}`;
  const userRes = await fetch(userUrl, {
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'Mozilla/5.0 (compatible; 3D-Portfolio/1.0)'
    }
  });
  if (userRes.ok) {
    const userData = await userRes.json();
    if (typeof userData.modelCount === 'number' && userData.modelCount > 0) {
      return userData.modelCount;
    }
  }
  // Último fallback: usar la longitud de results si no hay header ni modelCount
  const data = await response.json();
  return Array.isArray(data.results) ? data.results.length : 0;
}

// Función para convertir la respuesta de la API a nuestro formato Project
function convertSketchfabModelsToProjects(sketchfabModels: any[]): Project[] {
  return sketchfabModels.map((model) => {
    console.log(`🔄 Processing model from API:`, {
      uid: model.uid,
      name: model.name,
      faceCount: model.faceCount,
      vertexCount: model.vertexCount,
      viewCount: model.viewCount,
      likeCount: model.likeCount,
      downloadCount: model.downloadCount,
      user: model.user?.displayName || model.user?.username,
      categories: model.categories?.map((cat: any) => cat.name),
      tags: model.tags?.map((tag: any) => tag.name),
      thumbnails: model.thumbnails?.images?.length || 0,
      thumbnailsData: model.thumbnails
    })

    // Extraer thumbnails en diferentes tamaños
    const thumbnails = extractThumbnails(model.thumbnails?.images || [])
    console.log(`📸 Extracted thumbnails for ${model.uid}:`, thumbnails)
    
    // Formatear el título para el estilo del portfolio
    const title = formatTitle(model.name || `Model ${model.uid.substring(0, 8)}`)
    
    // Determinar el tipo basado en categorías y tags
    const type = categorizeFromAPIData(model.categories, model.tags, model.name)
    
    // Inferir tecnologías usadas
    const tech = inferTechFromAPIData(model.tags, model.description, model.faceCount)
    
    // Formatear la fecha
    const date = formatAPIDate(model.publishedAt)
    
    return {
      title,
      // source siempre SKETCHFAB para estos modelos
      source: "SKETCHFAB",
      description: model.description || `3D model "${model.name}" created by ${model.user?.displayName || model.user?.username || 'Unknown'}`,
      date,
      fileSize: estimateFileSize(model.faceCount || 0),
      renderTime: "Live",
      complexity: getComplexityFromFaceCount(model.faceCount || 0),
      sketchfabUid: model.uid,
      
      // Información rica directamente de la API
      triangles: model.faceCount || 0,
      vertices: model.vertexCount || 0,
      likes: model.likeCount || 0,
      views: model.viewCount || 0,
      downloads: model.downloadCount || 0,
      author: model.user?.displayName || model.user?.username || 'Unknown',
      license: model.license?.label || model.license?.fullName || 'Standard License',
      categories: model.categories?.map((cat: any) => cat.name) || [],
      tags: model.tags?.map((tag: any) => tag.name).slice(0, 5) || [],
      
      // URLs y previews
      thumbnails,
      viewerUrl: model.viewerUrl,
      embedUrl: model.embedUrl,
      publishedAt: model.publishedAt
    }
  })
}

// Función para extraer thumbnails en diferentes tamaños de la respuesta de la API
function extractThumbnails(images: any[]) {
  console.log('🖼️ Extracting thumbnails from images:', images)
  
  if (!images || images.length === 0) {
    console.warn('⚠️ No images found, using placeholder')
    return {
      small: '/placeholder-model.svg',
      medium: '/placeholder-model.svg', 
      large: '/placeholder-model.svg'
    }
  }

  // Buscar tamaños específicos
  const small = images.find(img => img.width >= 200 && img.width <= 250)?.url ||
                images.find(img => img.width >= 100)?.url ||
                images[0]?.url

  const medium = images.find(img => img.width >= 640 && img.width <= 720)?.url ||
                 images.find(img => img.width >= 400)?.url ||
                 images[0]?.url

  const large = images.find(img => img.width >= 1024)?.url ||
                images.find(img => img.width >= 800)?.url ||
                images[0]?.url

  const result = {
    small: small || '/placeholder-model.svg',
    medium: medium || '/placeholder-model.svg',
    large: large || '/placeholder-model.svg'
  }
  
  console.log('✅ Extracted thumbnails:', result)
  
  return result
}

// Función para formatear el título en el estilo del portfolio
function formatTitle(name: string): string {
  return name
    .toUpperCase()
    .replace(/\s+/g, '_')
    .replace(/[^A-Z0-9_]/g, '')
    .substring(0, 25) // Limitar longitud
    + '.DEMO'
}

// Función para categorizar basado en datos de la API
function categorizeFromAPIData(apiCategories: any[], apiTags: any[], modelName: string): string {
  // Primero intentar usar las categorías reales de Sketchfab
  if (apiCategories && apiCategories.length > 0) {
    const category = apiCategories[0].name?.toLowerCase() || ''
    
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
    return apiCategories[0].name?.toUpperCase().replace(/\s+/g, '_') || 'OBJECT'
  }
  
  // Luego intentar con tags
  if (apiTags && apiTags.length > 0) {
    const tagString = apiTags.map((tag: any) => tag.name?.toLowerCase()).join(' ')
    
    if (tagString.includes('car') || tagString.includes('vehicle') || tagString.includes('auto')) return 'VEHICLE'
    if (tagString.includes('character') || tagString.includes('person') || tagString.includes('human')) return 'CHARACTER'
    if (tagString.includes('building') || tagString.includes('house') || tagString.includes('architecture')) return 'ENVIRONMENT'
    if (tagString.includes('food') || tagString.includes('drink')) return 'FOOD'
    if (tagString.includes('animal') || tagString.includes('creature')) return 'CREATURE'
  }
  
  // Fallback al análisis del nombre del modelo
  const nameLC = modelName.toLowerCase()
  
  if (nameLC.includes('car') || nameLC.includes('vehicle') || nameLC.includes('auto')) return 'VEHICLE'
  if (nameLC.includes('character') || nameLC.includes('person') || nameLC.includes('human')) return 'CHARACTER'
  if (nameLC.includes('building') || nameLC.includes('house') || nameLC.includes('architecture')) return 'ENVIRONMENT'
  if (nameLC.includes('food') || nameLC.includes('drink')) return 'FOOD'
  if (nameLC.includes('animal') || nameLC.includes('creature')) return 'CREATURE'
  
  return 'OBJECT'
}

// Función para inferir tecnologías basadas en datos de la API
function inferTechFromAPIData(apiTags: any[], description: string, faceCount: number): string[] {
  const tech = ['SKETCHFAB']
  
  // Inferir tecnologías basadas en tags
  if (apiTags && apiTags.length > 0) {
    const tagNames = apiTags.map((tag: any) => tag.name?.toLowerCase() || '')
    
    if (tagNames.some(tag => tag.includes('blender'))) tech.push('BLENDER')
    if (tagNames.some(tag => tag.includes('maya'))) tech.push('MAYA')
    if (tagNames.some(tag => tag.includes('3dsmax') || tag.includes('3ds max'))) tech.push('3DS MAX')
    if (tagNames.some(tag => tag.includes('zbrush'))) tech.push('ZBRUSH')
    if (tagNames.some(tag => tag.includes('substance'))) tech.push('SUBSTANCE')
    if (tagNames.some(tag => tag.includes('photoshop'))) tech.push('PHOTOSHOP')
    if (tagNames.some(tag => tag.includes('unity'))) tech.push('UNITY')
    if (tagNames.some(tag => tag.includes('unreal'))) tech.push('UNREAL')
  }
  
  // Inferir tecnologías basadas en complejidad
  if (faceCount > 50000) {
    tech.push('PBR', 'SUBSTANCE')
  } else if (faceCount > 10000) {
    tech.push('PBR')
  }
  
  if (faceCount < 1000) {
    tech.push('LOWPOLY')
  }
  
  // Si no se detectaron herramientas específicas, agregar una común
  if (tech.length === 1) {
    const commonTools = ['BLENDER', '3DS MAX', 'MAYA']
    tech.push(commonTools[Math.floor(Math.random() * commonTools.length)])
  }
  
  return [...new Set(tech)] // Remover duplicados
}

// Función para formatear fecha de la API
function formatAPIDate(apiDate: string): string {
  if (!apiDate) {
    return new Date().toISOString().split('T')[0].replace(/-/g, '.')
  }
  
  try {
    const date = new Date(apiDate)
    return date.toISOString().split('T')[0].replace(/-/g, '.')
  } catch (error) {
    return new Date().toISOString().split('T')[0].replace(/-/g, '.')
  }
}

// Función para obtener status aleatorio
function getRandomStatus(): string {
  const statuses = ['COMPLETE', 'COMPLETE', 'COMPLETE', 'ACTIVE'] // Más peso a COMPLETE
  return statuses[Math.floor(Math.random() * statuses.length)]
}

// Función para estimar tamaño de archivo basado en número de triángulos
function estimateFileSize(triangleCount: number): string {
  if (triangleCount < 1000) return `${(Math.random() * 2 + 1).toFixed(1)}MB`
  if (triangleCount < 10000) return `${(Math.random() * 10 + 5).toFixed(1)}MB`
  if (triangleCount < 50000) return `${(Math.random() * 20 + 10).toFixed(1)}MB`
  if (triangleCount < 100000) return `${(Math.random() * 40 + 20).toFixed(1)}MB`
  
  return `${(Math.random() * 60 + 40).toFixed(1)}MB`
}

// Función para determinar complejidad basada en número de triángulos
function getComplexityFromFaceCount(faceCount: number): string {
  if (faceCount < 1000) return 'LOW'
  if (faceCount < 10000) return 'MEDIUM'
  if (faceCount < 50000) return 'HIGH'
  if (faceCount < 100000) return 'VERY_HIGH'
  
  return 'EXTREME'
}

// Nueva función para obtener TODOS los modelos públicos usando paginación cursor (next)
async function fetchAllModelsFromSketchfabAPI({ username, orderBy = "date-desc" }: { username: string, orderBy?: string }) {
  let allModels: any[] = [];
  let nextUrl: string | undefined = undefined;
  let page = 1;
  let limit = 100; // máximo permitido por Sketchfab
  do {
    const { models, next } = await fetchModelsFromSketchfabAPIInfinite({ username, nextUrl, limit, orderBy });
    allModels = allModels.concat(models);
    nextUrl = next;
    page++;
  } while (nextUrl);
  return allModels;
}

// Nuevo endpoint adaptado para paginación tradicional
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get('username') || SKETCHFAB_CONFIG.username;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '6');
  const orderBy = searchParams.get('orderBy') || 'date-desc';
  try {
    // 1. Obtener TODOS los modelos públicos del usuario (sin descartar ninguno)
    const allSketchfabModels = await fetchAllModelsFromSketchfabAPI({ username, orderBy });
    const allProjects = convertSketchfabModelsToProjects(allSketchfabModels);
    const validModels = allProjects.length;
    // 2. Calcular paginación
    const totalPages = Math.ceil(validModels / limit);
    const start = (page - 1) * limit;
    const end = start + limit;
    const projects = allProjects.slice(start, end);
    // 3. Obtener el total real de modelos públicos (opcional)
    let totalModels = undefined;
    if (page === 1) {
      totalModels = await fetchTotalModelsFromSketchfabAPI(username);
    }
    const successResult = {
      success: true,
      username,
      totalModels,
      validModels,
      page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      projects,
      apiSource: 'sketchfab_official_v3_cursor_all'
    };
    return NextResponse.json(successResult);
  } catch (error) {
    return NextResponse.json({
      success: false,
      username,
      totalModels: 0,
      validModels: 0,
      page: 1,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
      projects: [],
      error: error instanceof Error ? error.message : 'Failed to fetch models',
      apiSource: 'error'
    }, { status: 500 });
  }
}
