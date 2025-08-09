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
  softwareUsed: string[]
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
    return cached.data
  }
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Error fetching ${url}`)
  const data = await res.json()
  cache.set(url, { data, timestamp: now })
  return data
}

function mapArtStationProject(json: any): ArtStationProject {
  return {
    id: json.id,
    title: json.title,
    description: json.description,
    descriptionHtml: json.description_html,
    createdAt: json.created_at,
    updatedAt: json.updated_at,
    publishedAt: json.published_at,
    viewsCount: json.views_count,
    likesCount: json.likes_count,
    commentsCount: json.comments_count,
    permalink: json.permalink,
    coverUrl: json.cover_url,
    hashId: json.hash_id,
    slug: json.slug,
    tags: json.tags || [],
    categories: json.categories?.map((c: any) => c.name) || [],
    softwareUsed: json.software_items?.map((s: any) => s.name) || [],
    medium: json.medium?.name || '',
    liked: json.liked,
    user: {
      id: json.user.id,
      username: json.user.username,
      fullName: json.user.full_name,
      headline: json.user.headline,
      permalink: json.user.permalink,
      avatarUrl: json.user.medium_avatar_url,
      coverUrl: json.user.small_cover_url,
    },
    assets: json.assets?.map((a: any) => ({
      id: a.id,
      title: a.title ?? undefined,
      imageUrl: a.image_url,
      width: a.width,
      height: a.height,
      type: a.asset_type,
      playerEmbedded: a.player_embedded ?? null,
    })) || [],
  }
}

export async function GET(req: NextRequest) {
  const username = ARTSTATION_CONFIG.username
  if (!username) {
    return NextResponse.json({ error: 'Username not set in config' }, { status: 400 })
  }

  try {
    const projectsUrl = `${ARTSTATION_API_BASE}users/${username}/projects.json`
    const projectsData = await fetchWithCache(projectsUrl)

    const hashIds: string[] = projectsData.data.map((proj: any) => proj.hash_id)

    const results: ArtStationProject[] = []
    for (const hash of hashIds.slice(0, ARTSTATION_CONFIG.maxProjects)) {
      const detailUrl = `${ARTSTATION_API_BASE}projects/${hash}.json`
      const detailJson = await fetchWithCache(detailUrl)
      results.push(mapArtStationProject(detailJson))
    }

    return NextResponse.json(results)
  } catch (error: any) {
    console.error('❌ ArtStation API Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

