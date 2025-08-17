import { NextResponse } from 'next/server'
import { ARTSTATION_CONFIG } from '@/lib/artstation-config'

const ARTSTATION_API_BASE = 'https://www.artstation.com/'
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos
const cache = new Map<string, { data: unknown; timestamp: number }>()

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

async function fetchWithCache<T = unknown>(url: string): Promise<T> {
  const cached = cache.get(url)
  const now = Date.now()
  if (cached && now - cached.timestamp < CACHE_DURATION) {
    return cached.data as T
  }
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Error fetching ${url}`)
  const data = await res.json()
  cache.set(url, { data, timestamp: now })
  return data as T
}

function mapArtStationProject(json: Record<string, unknown>): ArtStationProject {
  return {
    id: json.id as number,
    title: json.title as string,
    description: json.description as string,
    descriptionHtml: json.description_html as string,
    createdAt: json.created_at as string,
    updatedAt: json.updated_at as string,
    publishedAt: json.published_at as string,
    viewsCount: json.views_count as number,
    likesCount: json.likes_count as number,
    commentsCount: json.comments_count as number,
    permalink: json.permalink as string,
    coverUrl: json.cover_url as string,
    hashId: json.hash_id as string,
    slug: json.slug as string,
    tags: (json.tags as string[]) || [],
    categories: (json.categories as { name: string }[] | undefined)?.map((c) => c.name) || [],
    softwareUsed: (json.software_items as { name: string; icon_url: string }[] | undefined)?.map((s) => ({
      name: s.name,
      iconUrl: s.icon_url
    })) || [],
    medium: (json.medium as { name: string } | undefined)?.name || '',
    liked: json.liked as boolean,
    user: {
      id: (json.user as Record<string, unknown>).id as number,
      username: (json.user as Record<string, unknown>).username as string,
      fullName: (json.user as Record<string, unknown>).full_name as string,
      headline: (json.user as Record<string, unknown>).headline as string,
      permalink: (json.user as Record<string, unknown>).permalink as string,
      avatarUrl: (json.user as Record<string, unknown>).medium_avatar_url as string,
      coverUrl: (json.user as Record<string, unknown>).small_cover_url as string,
    },
    assets: (json.assets as Array<{
      id: number;
      title?: string;
      image_url: string;
      width: number;
      height: number;
      asset_type: 'image' | 'cover' | 'model3d' | 'video_clip';
      player_embedded?: string;
    }> | undefined)?.map((a) => ({
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

export async function GET() {
  const username = ARTSTATION_CONFIG.username
  if (!username) {
    return NextResponse.json({ error: 'Username not set in config' }, { status: 400 })
  }

  try {
    const projectsUrl = `${ARTSTATION_API_BASE}users/${username}/projects.json`
    const projectsData = await fetchWithCache<{ data: { hash_id: string }[] }>(projectsUrl)

    const hashIds: string[] = projectsData.data.map((proj) => proj.hash_id)

    const results: ArtStationProject[] = []
    for (const hash of hashIds.slice(0, ARTSTATION_CONFIG.maxProjects)) {
      const detailUrl = `${ARTSTATION_API_BASE}projects/${hash}.json`
      const detailJson = await fetchWithCache<Record<string, unknown>>(detailUrl)
      results.push(mapArtStationProject(detailJson))
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error('❌ ArtStation API Error:', error)
    const message =
      typeof error === 'object' && error !== null && 'message' in error && typeof (error as { message?: unknown }).message === 'string'
        ? (error as { message: string }).message
        : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

