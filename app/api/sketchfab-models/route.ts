import { NextRequest, NextResponse } from 'next/server'
import { SKETCHFAB_CONFIG } from '@/lib/sketchfab-config'

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
  let allModels: unknown[] = [];
  let nextUrl: string | undefined = undefined;
  const limit = 100;
  do {
    const { models, next } = await fetchModelsFromSketchfabAPIInfinite({ username, nextUrl, limit, orderBy });
    allModels = allModels.concat(models);
    nextUrl = next;
    // page++; // Eliminado porque no se usa
  } while (nextUrl);
  return allModels;
}

// Función para convertir la respuesta de la API a nuestro formato Project
function convertSketchfabModelsToProjects(sketchfabModels: unknown[]): Project[] {
  return sketchfabModels.map((modelRaw) => {
    const model = modelRaw as Record<string, unknown>;
    // Extraer thumbnails en diferentes tamaños
    const thumbnails = extractThumbnails((model.thumbnails as { images: unknown[] } | undefined)?.images || []);
    // Formatear el título para el estilo del portfolio
    const title = formatTitle((model.name as string) || `Model ${(model.uid as string).substring(0, 8)}`);
    // Formatear la fecha
    const date = formatAPIDate(model.publishedAt as string);
    return {
      title,
      source: "SKETCHFAB",
      description: (model.description as string) || `3D model \"${model.name as string}\" created by ${(model.user as { displayName?: string, username?: string })?.displayName || (model.user as { username?: string })?.username || 'Unknown'}`,
      date,
      fileSize: estimateFileSize((model.faceCount as number) || 0),
      renderTime: "Live",
      complexity: getComplexityFromFaceCount((model.faceCount as number) || 0),
      sketchfabUid: model.uid as string,
      triangles: model.faceCount as number || 0,
      vertices: model.vertexCount as number || 0,
      likes: model.likeCount as number || 0,
      views: model.viewCount as number || 0,
      downloads: model.downloadCount as number || 0,
      author: (model.user as { displayName?: string, username?: string })?.displayName || (model.user as { username?: string })?.username || 'Unknown',
      license: (model.license as { label?: string, fullName?: string })?.label || (model.license as { fullName?: string })?.fullName || 'Standard License',
      categories: Array.isArray(model.categories) ? (model.categories as { name: string }[]).map((cat) => cat.name) : [],
      tags: Array.isArray(model.tags) ? (model.tags as { name: string }[]).map((tag) => tag.name).slice(0, 5) : [],
      thumbnails,
      viewerUrl: model.viewerUrl as string,
      embedUrl: model.embedUrl as string,
      publishedAt: model.publishedAt as string,
      staffpickedAt: (model as { staffpickedAt?: string | null }).staffpickedAt || null
    }
  });
}

function extractThumbnails(images: unknown[]): { small: string; medium: string; large: string } {
  if (!images || images.length === 0) {
    return {
      small: '/placeholder-model.svg',
      medium: '/placeholder-model.svg',
      large: '/placeholder-model.svg'
    }
  }
  const imgs = images as { width: number; url: string }[];
  const small = imgs.find(img => img.width >= 200 && img.width <= 250)?.url || imgs.find(img => img.width >= 100)?.url || imgs[0]?.url;
  const medium = imgs.find(img => img.width >= 640 && img.width <= 720)?.url || imgs.find(img => img.width >= 400)?.url || imgs[0]?.url;
  const large = imgs.find(img => img.width >= 1024)?.url || imgs.find(img => img.width >= 800)?.url || imgs[0]?.url;
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
  } catch {
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
