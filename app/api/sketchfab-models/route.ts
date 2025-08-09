import { NextRequest, NextResponse } from 'next/server'
import { SKETCHFAB_CONFIG } from '@/lib/sketchfab-config'

// Cache simple en memoria
const cache = new Map<string, { data: any, timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos

// Constantes de la API de Sketchfab v3
const SKETCHFAB_API_BASE = 'https://api.sketchfab.com/v3'

interface Project {
  title: string;
  source: string;
  description: string;
  date: string;
  fileSize: string;
  renderTime: string;
  complexity: string;
  sketchfabUid: string;
  triangles?: number;
  vertices?: number;
  likes?: number;
  views?: number;
  downloads?: number;
  author?: string;
  license?: string;
  categories?: string[];
  tags?: string[];
  thumbnails?: {
    small: string;
    medium: string;
    large: string;
  };
  viewerUrl?: string;
  embedUrl?: string;
  publishedAt?: string;
  staffpickedAt?: string | null;
}

// Función para obtener modelos usando paginación cursor (next)
async function fetchModelsFromSketchfabAPIInfinite({ username, nextUrl, limit = 100, orderBy = "date-desc" }: { username: string, nextUrl?: string, limit?: number, orderBy?: string }) {
  let apiUrl = nextUrl;
  if (!apiUrl) {
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

// Función para obtener TODOS los modelos públicos usando paginación cursor (next)
async function fetchAllModelsFromSketchfabAPI({ username, orderBy = "date-desc" }: { username: string, orderBy?: string }) {
  let allModels: any[] = [];
  let nextUrl: string | undefined = undefined;
  let page = 1;
  let limit = 100;
  do {
    const { models, next } = await fetchModelsFromSketchfabAPIInfinite({ username, nextUrl, limit, orderBy });
    allModels = allModels.concat(models);
    nextUrl = next;
    page++;
  } while (nextUrl);
  return allModels;
}

// Función para convertir la respuesta de la API a nuestro formato Project
function convertSketchfabModelsToProjects(sketchfabModels: any[]): Project[] {
  return sketchfabModels.map((model) => {
    // Extraer thumbnails en diferentes tamaños
    const thumbnails = extractThumbnails(model.thumbnails?.images || [])
    // Formatear el título para el estilo del portfolio
    const title = formatTitle(model.name || `Model ${model.uid.substring(0, 8)}`)
    // Formatear la fecha
    const date = formatAPIDate(model.publishedAt)
    return {
      title,
      source: "SKETCHFAB",
      description: model.description || `3D model \"${model.name}\" created by ${model.user?.displayName || model.user?.username || 'Unknown'}`,
      date,
      fileSize: estimateFileSize(model.faceCount || 0),
      renderTime: "Live",
      complexity: getComplexityFromFaceCount(model.faceCount || 0),
      sketchfabUid: model.uid,
      triangles: model.faceCount || 0,
      vertices: model.vertexCount || 0,
      likes: model.likeCount || 0,
      views: model.viewCount || 0,
      downloads: model.downloadCount || 0,
      author: model.user?.displayName || model.user?.username || 'Unknown',
      license: model.license?.label || model.license?.fullName || 'Standard License',
      categories: model.categories?.map((cat: any) => cat.name) || [],
      tags: model.tags?.map((tag: any) => tag.name).slice(0, 5) || [],
      thumbnails,
      viewerUrl: model.viewerUrl,
      embedUrl: model.embedUrl,
      publishedAt: model.publishedAt,
      staffpickedAt: model.staffpickedAt || null
    }
  })
}

function extractThumbnails(images: any[]) {
  if (!images || images.length === 0) {
    return {
      small: '/placeholder-model.svg',
      medium: '/placeholder-model.svg',
      large: '/placeholder-model.svg'
    }
  }
  const small = images.find(img => img.width >= 200 && img.width <= 250)?.url || images.find(img => img.width >= 100)?.url || images[0]?.url
  const medium = images.find(img => img.width >= 640 && img.width <= 720)?.url || images.find(img => img.width >= 400)?.url || images[0]?.url
  const large = images.find(img => img.width >= 1024)?.url || images.find(img => img.width >= 800)?.url || images[0]?.url
  return {
    small: small || '/placeholder-model.svg',
    medium: medium || '/placeholder-model.svg',
    large: large || '/placeholder-model.svg'
  }
}

function formatTitle(name: string): string {
  return name
    .toUpperCase()
    .replace(/\s+/g, '_')
    .replace(/[^A-Z0-9_]/g, '')
    .substring(0, 25)
    + '.DEMO'
}

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

function estimateFileSize(triangleCount: number): string {
  if (triangleCount < 1000) return `${(Math.random() * 2 + 1).toFixed(1)}MB`
  if (triangleCount < 10000) return `${(Math.random() * 10 + 5).toFixed(1)}MB`
  if (triangleCount < 50000) return `${(Math.random() * 20 + 10).toFixed(1)}MB`
  if (triangleCount < 100000) return `${(Math.random() * 40 + 20).toFixed(1)}MB`
  return `${(Math.random() * 60 + 40).toFixed(1)}MB`
}

function getComplexityFromFaceCount(faceCount: number): string {
  if (faceCount < 1000) return 'LOW'
  if (faceCount < 10000) return 'MEDIUM'
  if (faceCount < 50000) return 'HIGH'
  if (faceCount < 100000) return 'VERY_HIGH'
  return 'EXTREME'
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get('username') || SKETCHFAB_CONFIG.username;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '6');
  const orderBy = searchParams.get('orderBy') || 'date-desc';
  try {
    const allSketchfabModels = await fetchAllModelsFromSketchfabAPI({ username, orderBy });
    const allProjects = convertSketchfabModelsToProjects(allSketchfabModels);
    const validModels = allProjects.length;
    const totalPages = Math.ceil(validModels / limit);
    const start = (page - 1) * limit;
    const end = start + limit;
    const projects = allProjects.slice(start, end);
    const successResult = {
      success: true,
      username,
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
