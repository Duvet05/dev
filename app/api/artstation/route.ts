import { NextRequest, NextResponse } from 'next/server'
import { ARTSTATION_CONFIG } from '@/lib/artstation-config'

const ARTSTATION_API_BASE = 'https://www.artstation.com/'
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos
const cache = new Map<string, { data: any; timestamp: number }>()

export interface ArtStationProject {
  id: number
  title: string
  description: string
  descriptionHtml: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  viewsCount: number
  likesCount: number
  commentsCount: number
  permalink: string
  coverUrl: string
  hashId: string
  slug: string
  tags: string[]
  categories: string[]
  softwareUsed: {
    name: string;
    iconUrl: string;
  }[]
  medium: string
  liked: boolean
  user: {
    id: number
    username: string
    fullName: string
    headline: string
    permalink: string
    avatarUrl: string
    coverUrl: string
  }
  assets: {
    id: number
    title?: string
    imageUrl: string
    width: number
    height: number
    type: 'image' | 'cover' | 'model3d' | 'video_clip'
    playerEmbedded?: string | null
  }[]
}

async function fetchWithCache(url: string): Promise<any> {
  const cached = cache.get(url)
  const now = Date.now()
  if (cached && now - cached.timestamp < CACHE_DURATION) {
    console.log(`💾 Using cached data for: ${url}`)
    return cached.data
  }
  
  console.log(`🌐 Fetching from: ${url}`)
  const res = await fetch(url)
  if (!res.ok) {
    const errorText = await res.text()
    console.error(`❌ HTTP Error ${res.status} for ${url}:`, errorText)
    throw new Error(`Error fetching ${url}: ${res.status} ${res.statusText}`)
  }
  
  const data = await res.json()
  console.log(`✅ Successfully fetched data from: ${url}`)
  cache.set(url, { data, timestamp: now })
  return data
}

function mapArtStationProject(json: any): ArtStationProject {
  try {
    console.log('🗺️  Mapping project:', json.title || json.id)
    return {
      id: json.id,
      title: json.title || 'Untitled',
      description: json.description || '',
      descriptionHtml: json.description_html || json.description || '',
      createdAt: json.created_at || '',
      updatedAt: json.updated_at || '',
      publishedAt: json.published_at || json.created_at || '',
      viewsCount: json.views_count || 0,
      likesCount: json.likes_count || 0,
      commentsCount: json.comments_count || 0,
      permalink: json.permalink || '',
      coverUrl: json.cover_url || json.cover?.thumb_url || '',
      hashId: json.hash_id || '',
      slug: json.slug || '',
      tags: json.tags || [],
      categories: json.categories?.map((c: any) => c.name) || [],
      softwareUsed: json.software_items?.map((s: any) => ({
        name: s.name,
        iconUrl: s.icon_url
      })) || [],
      medium: json.medium?.name || '',
      liked: json.liked || false,
      user: {
        id: json.user?.id || 0,
        username: json.user?.username || '',
        fullName: json.user?.full_name || '',
        headline: json.user?.headline || '',
        permalink: json.user?.permalink || '',
        avatarUrl: json.user?.medium_avatar_url || '',
        coverUrl: json.user?.small_cover_url || '',
      },
      assets: json.assets?.map((a: any) => ({
        id: a.id,
        title: a.title ?? undefined,
        imageUrl: a.image_url,
        width: a.width || 0,
        height: a.height || 0,
        type: a.asset_type,
        playerEmbedded: a.player_embedded ?? null,
      })) || [],
    }
  } catch (error: any) {
    console.error('❌ Error mapping project:', error.message, 'JSON:', JSON.stringify(json, null, 2))
    throw error
  }
}

export async function GET(req: NextRequest) {
  const username = ARTSTATION_CONFIG.username
  if (!username) {
    return NextResponse.json({ error: 'Username not set in config' }, { status: 400 })
  }

  try {
    console.log(`🎨 Fetching ArtStation projects for user: ${username}`)
    
    // Crear datos de fallback en caso de error
    const fallbackProjects = [
      {
        id: 18908695,
        title: "3D Prop Modeling Pipeline",
        description: "Here's a prop model of a stove oil which design's inspire me to model it on 3d. For the task i first gather all the refs i needed, then starter modeling, texturing, exporting and importing, lightning and rendering.",
        descriptionHtml: "Here's a prop model of a stove oil which design's inspire me to model it on 3d.<br>For the task i first gather all the refs i needed, then starter modeling, texturing, exporting and importing, lightning and rendering.",
        createdAt: "2024-08-18T15:01:45.259-05:00",
        updatedAt: "2025-07-03T02:25:41.018-05:00",
        publishedAt: "2024-08-18T15:01:53.580-05:00",
        viewsCount: 250,
        likesCount: 4,
        commentsCount: 2,
        permalink: "https://www.artstation.com/artwork/nJQarE",
        coverUrl: "https://cdnb.artstation.com/p/assets/covers/images/079/109/123/small_square/victor-cuadot-victor-cuadot-toyotomi.jpg?1724011301",
        hashId: "nJQarE",
        slug: "3dprop_modelingpipline-toyotomi-gear-mission-ks-ge67",
        tags: ["3d", "modeling", "blender", "prop"],
        categories: ["Props"],
        softwareUsed: [
          { name: "Blender", iconUrl: "https://example.com/blender-icon.png" },
          { name: "Substance Painter", iconUrl: "https://example.com/substance-icon.png" }
        ],
        medium: "3D",
        liked: false,
        user: {
          id: 175617,
          username: "cuadot",
          fullName: "Victor Cuadot",
          headline: "3D Artist",
          permalink: "https://www.artstation.com/cuadot",
          avatarUrl: "",
          coverUrl: "",
        },
        assets: [
          {
            id: 1,
            title: "Main Render",
            imageUrl: "https://cdnb.artstation.com/p/assets/covers/images/079/109/123/small_square/victor-cuadot-victor-cuadot-toyotomi.jpg?1724011301",
            width: 1920,
            height: 1080,
            type: "image" as const,
            playerEmbedded: null,
          }
        ],
      }
    ];

    const projectsUrl = `${ARTSTATION_API_BASE}users/${username}/projects.json`
    const projectsData = await fetchWithCache(projectsUrl)

    if (!projectsData || !projectsData.data) {
      console.log('⚠️ Using fallback data due to missing project data')
      return NextResponse.json(fallbackProjects)
    }

    console.log(`📊 Found ${projectsData.data.length} projects, processing...`)
    const hashIds: string[] = projectsData.data.map((proj: any) => proj.hash_id)

    const results: ArtStationProject[] = []
    for (const hash of hashIds.slice(0, Math.min(3, ARTSTATION_CONFIG.maxProjects))) { // Limitar a 3 para pruebas
      try {
        console.log(`🔍 Fetching details for project: ${hash}`)
        const detailUrl = `${ARTSTATION_API_BASE}projects/${hash}.json`
        const detailJson = await fetchWithCache(detailUrl)
        results.push(mapArtStationProject(detailJson))
        console.log(`✅ Successfully processed project: ${hash}`)
      } catch (projectError: any) {
        console.error(`❌ Error processing project ${hash}:`, projectError.message)
        // Continuar con el siguiente proyecto en lugar de fallar completamente
        continue
      }
    }

    if (results.length === 0) {
      console.log('⚠️ No projects processed successfully, using fallback data')
      return NextResponse.json(fallbackProjects)
    }

    console.log(`🎉 Successfully processed ${results.length} projects`)
    return NextResponse.json(results)
  } catch (error: any) {
    console.error('❌ ArtStation API Error:', error)
    
    // Retornar datos de fallback en lugar de error
    const fallbackProjects = [
      {
        id: 1,
        title: "FALLBACK PROJECT",
        description: "This is a fallback project used when ArtStation API is not available",
        descriptionHtml: "This is a fallback project used when ArtStation API is not available",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
        publishedAt: "2024-01-01T00:00:00.000Z",
        viewsCount: 0,
        likesCount: 0,
        commentsCount: 0,
        permalink: "https://www.artstation.com/cuadot",
        coverUrl: "https://via.placeholder.com/400x400/333/fff?text=FALLBACK",
        hashId: "fallback",
        slug: "fallback-project",
        tags: ["fallback"],
        categories: ["Test"],
        softwareUsed: [],
        medium: "Digital",
        liked: false,
        user: {
          id: 175617,
          username: "cuadot",
          fullName: "Victor Cuadot",
          headline: "3D Artist",
          permalink: "https://www.artstation.com/cuadot",
          avatarUrl: "",
          coverUrl: "",
        },
        assets: [{
          id: 1,
          title: "Fallback Image",
          imageUrl: "https://via.placeholder.com/400x400/333/fff?text=FALLBACK",
          width: 400,
          height: 400,
          type: "image" as const,
          playerEmbedded: null,
        }],
      }
    ];
    
    return NextResponse.json(fallbackProjects)
  }
}

