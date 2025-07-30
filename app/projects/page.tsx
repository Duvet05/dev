"use client"

import { useState, useEffect, useRef } from "react"
import { BrowserHeader } from "@/components/BrowserHeader"
import { BrowserFrame } from "@/components/layout/BrowserFrame"
import { Footer } from "@/components/layout/Footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ExternalLink, Shapes, Layers, FileText, Gauge, Calendar, Heart, Eye } from "lucide-react"
import Link from "next/link"
import { SiBlender, SiAutodesk, SiAdobephotoshop, SiUnity, SiUnrealengine, SiWebgl, SiAdobe, SiFigma, SiCss3, SiHoudini, SiMarvelapp, SiSketchfab, SiArtstation } from "react-icons/si"
import { TbBrandThreejs } from "react-icons/tb"
import { FaPaintBrush } from "react-icons/fa"
import { IconType } from "react-icons"
import Model3DViewer from "@/components/3d/Model3DViewer"
import { SketchfabViewer } from "@/components/3d/SketchfabViewer"
import { SKETCHFAB_CONFIG } from "@/lib/sketchfab-config"

// Interfaz para los proyectos
interface Project {
  title: string;
  source: string; // Nuevo campo para el origen
  description: string;
  date: string;
  fileSize: string;
  renderTime: string;
  complexity: string;
  sketchfabUid?: string; // Para modelos de Sketchfab
  modelPath?: string;    // Para modelos locales
  // Información adicional de Sketchfab
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

// Mapeo de tecnologías a iconos
const techIcons: Record<string, IconType> = {
  BLENDER: SiBlender,
  MAYA: SiAutodesk,
  "3DS MAX": SiAutodesk,
  ZBRUSH: FaPaintBrush,
  SUBSTANCE: SiAdobe,
  PHOTOSHOP: SiAdobephotoshop,
  UNITY: SiUnity,
  UNREAL: SiUnrealengine,
  WEBGL: SiWebgl,
  MARVELOUS: SiMarvelapp,
  HOUDINI: SiHoudini,
  FIGMA: SiFigma,
  "AFTER.EFFECTS": SiAdobe,
  CSS: SiCss3,
  "THREE.JS": TbBrandThreejs,
  GLSL: SiWebgl,
  SKETCHFAB: SiSketchfab,
  PBR: SiWebgl,
  LOWPOLY: SiWebgl,
}

// Mapeo de tecnologías a iconos (estandarizado para tags)
const tagTechIcons: Record<string, IconType> = {
  blender: SiBlender,
  substancepainter: SiAdobe,
  substance: SiAdobe,
  zbrush: FaPaintBrush,
}

export default function ProjectsPage() {
  const [currentTime, setCurrentTime] = useState("")
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [playerState, setPlayerState] = useState("STOPPED")
  const [volume, setVolume] = useState(8)
  const [isMuted, setIsMuted] = useState(false)
  const [volumeBeforeMute, setVolumeBeforeMute] = useState(8)

  const audioRef = useRef<HTMLAudioElement>(null)
  const [tracks, setTracks] = useState<{ name: string, src: string }[]>([])
  const [allProjects, setAllProjects] = useState<Project[]>([])
  const [isLoadingProjects, setIsLoadingProjects] = useState(true)
  const [projectsError, setProjectsError] = useState<string>('')
  const [totalModelsFound, setTotalModelsFound] = useState<number>(0)
  const [validModelsFound, setValidModelsFound] = useState<number>(0)
  const [usingFallback, setUsingFallback] = useState<boolean>(false)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [hasNextPage, setHasNextPage] = useState<boolean>(false)
  const [hasPrevPage, setHasPrevPage] = useState<boolean>(false)
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedSource, setSelectedSource] = useState<string>("ALL");
  const [selectedComplexity, setSelectedComplexity] = useState<string>("ALL");
  const [orderBy, setOrderBy] = useState<string>("date-desc");
  const [gridCols, setGridCols] = useState<number>(4); // Por defecto 4x

  // --- INFINITE SCROLL STATES Y LÓGICA ---
  const [sketchfabModels, setSketchfabModels] = useState<Project[]>([]);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Fijar modelos por página en 8
  const MODELS_PER_PAGE = 8;

  // Nueva función para cargar modelos (infinite scroll)
  const loadSketchfabModels = async (url?: string) => {
    try {
      setIsLoadingProjects(true);
      setProjectsError("");
      setIsLoadingMore(!!url);
      const endpoint = url || `/api/sketchfab-models?username=${SKETCHFAB_CONFIG.username}&limit=100&orderBy=${orderBy}`;
      const res = await fetch(endpoint);
      const data = await res.json();
      if (data.success) {
        setSketchfabModels(prev => url ? [...prev, ...data.projects] : data.projects);
        setAllProjects(url ? [...sketchfabModels, ...data.projects] : data.projects);
        setTotalModelsFound(data.totalModels || 0);
        setValidModelsFound(data.validModels || data.projects.length);
        setUsingFallback(data.usingFallback || false);
        setNextUrl(data.next || null);
      } else {
        throw new Error(data.error || 'Failed to fetch projects');
      }
    } catch (error) {
      setProjectsError(`Failed to load projects from @${SKETCHFAB_CONFIG.username}`);
      setUsingFallback(true);
      setSketchfabModels(SKETCHFAB_CONFIG.fallbackProjects);
      setAllProjects(SKETCHFAB_CONFIG.fallbackProjects);
      setNextUrl(null);
    } finally {
      setIsLoadingProjects(false);
      setIsLoadingMore(false);
    }
  };

  // Fetch de la API (limit=100 siempre)
  const fetchSketchfabProjects = async () => {
    try {
      setIsLoadingProjects(true);
      setProjectsError("");
      const response = await fetch(`/api/sketchfab-models?username=${SKETCHFAB_CONFIG.username}&page=1&limit=100&orderBy=${orderBy}`);
      const data = await response.json();
      if (data.success) {
        setAllProjects(data.projects);
        setValidModelsFound(data.validModels || data.projects.length);
        setCurrentPage(1);
        setUsingFallback(false);
      } else {
        throw new Error(data.error || 'Failed to fetch projects');
      }
    } catch (error) {
      setProjectsError(`Failed to load projects from @${SKETCHFAB_CONFIG.username}`);
      setAllProjects(SKETCHFAB_CONFIG.fallbackProjects);
      setValidModelsFound(0);
      setCurrentPage(1);
      setUsingFallback(true);
    } finally {
      setIsLoadingProjects(false);
    }
  };

  // Cargar modelos al montar o cuando cambian los filtros principales
  useEffect(() => {
    setSketchfabModels([]);
    setAllProjects([]);
    setNextUrl(null);
    fetchSketchfabProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderBy]);

  // Fetch tracks para el reproductor
  const fetchTracks = async () => {
    try {
      const res = await fetch("/api/music")
      if (!res.ok) throw new Error("No se pudo cargar la música")
      const data: { name: string, src: string }[] = await res.json()
      setTracks(data)
    } catch (err) {
      setTracks([])
    }
  }

  useEffect(() => {
    fetchTracks()
  }, [])

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          timeZone: "America/Mexico_City",
        }),
      )
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [])

  // Control de reproducción
  const handlePlayPause = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
      setPlayerState("STOPPED")
    } else {
      audioRef.current.play()
      setIsPlaying(true)
      setPlayerState("PLAYING")
    }
  }

  const handlePrev = () => {
    if (tracks.length === 0) return
    let prev = currentTrack - 1
    if (prev < 0) prev = tracks.length - 1
    setCurrentTrack(prev)
    setIsPlaying(false)
    setPlayerState("STOPPED")
  }

  const handleNext = () => {
    if (tracks.length === 0) return
    let next = currentTrack + 1
    if (next >= tracks.length) next = 0
    setCurrentTrack(next)
    setIsPlaying(false)
    setPlayerState("STOPPED")
  }

  // Actualiza la pista cuando cambia
  useEffect(() => {
    if (audioRef.current && tracks.length > 0) {
      audioRef.current.pause()
      audioRef.current.load()

      if (playerState === "PLAYING") {
        const playPromise = audioRef.current.play()
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.log("Error al reproducir automáticamente:", error)
            setIsPlaying(false)
            setPlayerState("STOPPED")
          })
        }
      } else {
        setIsPlaying(false)
        setPlayerState("STOPPED")
      }
    }
  }, [currentTrack, tracks, playerState])

  // Control de volumen
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 8
    }
  }, [volume, isMuted])

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false)
      setVolume(volumeBeforeMute)
    } else {
      setVolumeBeforeMute(volume)
      setIsMuted(true)
    }
  }

  const handleSetVolume = (newVolume: number) => {
    if (isMuted) {
      setIsMuted(false)
    }
    setVolume(newVolume)
  }

  const handleEnded = () => {
    if (tracks.length === 0) return

    let next = currentTrack + 1
    if (next >= tracks.length) next = 0

    setCurrentTrack(next)
    setIsPlaying(true)
    setPlayerState("PLAYING")
  }

  // Obtener todas las categorías y fuentes únicas de los proyectos
  const allCategories = Array.from(new Set(allProjects.flatMap(p => p.categories || [])));
  const allSources = Array.from(new Set(allProjects.map(p => p.source || "UNKNOWN")));
  const complexityOrder = ["LOW", "MEDIUM", "HIGH", "VERY_HIGH", "EXTREME"];
  const allComplexities = complexityOrder.filter(c => allProjects.some(p => p.complexity === c));

  // Filtrar, buscar y ordenar proyectos
  const filteredProjects = allProjects
    .filter(project =>
      (selectedCategory === "ALL" || (project.categories && project.categories.includes(selectedCategory))) &&
      (selectedSource === "ALL" || project.source === selectedSource) &&
      (selectedComplexity === "ALL" || project.complexity === selectedComplexity) &&
      (searchText === "" ||
        project.title.toLowerCase().includes(searchText.toLowerCase()) ||
        (project.description && project.description.toLowerCase().includes(searchText.toLowerCase())) ||
        (project.tags && project.tags.some(tag => tag.toLowerCase().includes(searchText.toLowerCase())))
      )
    )
    .sort((a, b) => {
      switch (orderBy) {
        case "date-desc":
          return (b.date || "").localeCompare(a.date || "");
        case "date-asc":
          return (a.date || "").localeCompare(b.date || "");
        case "likes-desc":
          return (b.likes || 0) - (a.likes || 0);
        case "likes-asc":
          return (a.likes || 0) - (b.likes || 0);
        case "views-desc":
          return (b.views || 0) - (a.views || 0);
        case "views-asc":
          return (a.views || 0) - (b.views || 0);
        default:
          return 0;
      }
    });

  // Mostrar solo los modelos de la página actual (usando los filtrados)
  const paginatedProjects = filteredProjects.slice((currentPage - 1) * MODELS_PER_PAGE, currentPage * MODELS_PER_PAGE);
  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / MODELS_PER_PAGE));

  // Cambiar de página
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      scrollToTop();
    }
  };
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      scrollToTop();
    }
  };
  const handleGoToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      if (page !== currentPage) setCurrentPage(page);
      scrollToTop();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-vt323 overflow-x-hidden">
      {/* Header sticky que ocupa todo el ancho de la pantalla */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-primary">
        <div className="mx-4 mt-4 border-l border-r border-t border-secondary bg-black">
          <BrowserHeader
            tracks={tracks}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            playerState={playerState}
            volume={volume}
            audioRef={audioRef}
            handlePrev={handlePrev}
            handlePlayPause={handlePlayPause}
            handleNext={handleNext}
            setVolume={handleSetVolume}
            handleEnded={handleEnded}
            toggleMute={toggleMute}
            isMuted={isMuted}
          />
        </div>
      </div>

      {/* Contenido principal con padding-top para compensar el header fijo */}
      <div className="pt-[100px] mb-4">
        <div className="border-l border-r border-b border-secondary mx-4">
          <div className="p-8">
            {/* Header de la página */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-6">
                  <Link href="/">
                    <Button
                      variant="outline"
                      className="border-white text-white hover:bg-white hover:text-black bg-transparent rounded-none flex items-center gap-2 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      BACK.TO.MAIN
                    </Button>
                  </Link>
                  <h1 className="text-5xl font-bauhaus-pixel leading-none mb-[-17]">PROJECTS.ARCHIVE</h1>
                </div>
                <div className="text-right">
                  <div className="flex gap-8">
                    <div className="text-sm text-gray-400">
                      PAGE {currentPage} OF {totalPages} • SHOWING {paginatedProjects.length} MODELS • <span className="text-green-400">TOTAL: {totalModelsFound} MODELS</span>
                    </div>
                    <div className="text-sm text-gray-400">LAST.UPDATE: {currentTime}</div>
                  </div>
                  {usingFallback && (
                    <div className="text-xs text-yellow-400 mt-1">
                      USING.FALLBACK.DATA
                    </div>
                  )}
                </div>
              </div>

              {/* Línea separadora estilo terminal */}
              <div className="border-t border-secondary mb-6"></div>

              {/* Stats del portfolio (corregir uso de status) */}
              <div className="border border-secondary grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="border-r border-secondary bg-primary p-4">
                  <div className="text-2xl font-bold text-white">{sketchfabModels.filter(p => p.tags?.includes("COMPLETE")).length}</div>
                  <div className="text-sm text-gray-400">COMPLETED</div>
                </div>
                <div className="border-r border-secondary bg-primary p-4">
                  <div className="text-2xl font-bold text-green-500">{sketchfabModels.filter(p => p.tags?.includes("ACTIVE")).length}</div>
                  <div className="text-sm text-gray-400">ACTIVE</div>
                </div>
                <div className="border-r border-secondary bg-primary p-4">
                  <div className="text-2xl font-bold text-yellow-500">{sketchfabModels.filter(p => p.tags?.includes("BETA")).length}</div>
                  <div className="text-sm text-gray-400">BETA</div>
                </div>
                <div className="bg-primary p-4">
                  <div className="text-2xl font-bold text-white">
                    {sketchfabModels.reduce((total, project) => {
                      const size = parseFloat(project.fileSize?.replace(/[GB|MB]/g, "") || "0");
                      return total + (project.fileSize?.includes("GB") ? size : size / 1000);
                    }, 0).toFixed(1)}GB
                  </div>
                  <div className="text-sm text-gray-400">TOTAL.SIZE</div>
                </div>
              </div>
            </div>

            {/* NUEVO: Barra de búsqueda, filtros, orden y vista */}
            <div className="mb-8 flex flex-col md:flex-row md:items-end gap-4">
              <div className="flex-1 flex flex-col gap-2">
                <label htmlFor="searchbar" className="text-xs text-gray-400">SEARCH PROJECTS</label>
                <input
                  id="searchbar"
                  type="text"
                  value={searchText}
                  onChange={e => setSearchText(e.target.value)}
                  placeholder="Search by title, description, tag..."
                  className="bg-black border border-secondary text-white px-3 py-1.5 rounded-none focus:outline-none focus:border-white text-sm"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="category-filter" className="text-xs text-gray-400">CATEGORY</label>
                <select
                  id="category-filter"
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="bg-black border border-secondary text-white px-3 py-2 rounded-none focus:outline-none focus:border-white text-sm cursor-pointer uppercase"
                >
                  <option value="ALL">ALL</option>
                  {allCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="source-filter" className="text-xs text-gray-400">SOURCE</label>
                <select
                  id="source-filter"
                  value={selectedSource}
                  onChange={e => setSelectedSource(e.target.value)}
                  className="bg-black border border-secondary text-white px-3 py-2 rounded-none focus:outline-none focus:border-white text-sm cursor-pointer"
                >
                  <option value="ALL">ALL</option>
                  {allSources.map(src => (
                    <option key={src} value={src}>{src}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="complexity-filter" className="text-xs text-gray-400">COMPLEXITY</label>
                <select
                  id="complexity-filter"
                  value={selectedComplexity}
                  onChange={e => setSelectedComplexity(e.target.value)}
                  className="bg-black border border-secondary text-white px-3 py-2 rounded-none focus:outline-none focus:border-white text-sm cursor-pointer uppercase"
                >
                  <option value="ALL">ALL</option>
                  {allComplexities.map(complexity => (
                    <option key={complexity} value={complexity}>{complexity}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="order-by" className="text-xs text-gray-400">ORDER BY</label>
                <select
                  id="order-by"
                  value={orderBy}
                  onChange={e => setOrderBy(e.target.value)}
                  className="bg-black border border-secondary text-white px-3 py-2 rounded-none focus:outline-none focus:border-white text-sm cursor-pointer"
                >
                  <option value="date-desc">Date (Newest)</option>
                  <option value="date-asc">Date (Oldest)</option>
                  <option value="likes-desc">Likes (Most)</option>
                  <option value="likes-asc">Likes (Least)</option>
                  <option value="views-desc">Views (Most)</option>
                  <option value="views-asc">Views (Least)</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs text-gray-400">VIEW</label>
                <div className="flex">
                  <button
                    className={`px-2.5 py-1.5 border rounded-none text-sm ${gridCols === 2 ? "border-white bg-white text-black" : "border-secondary bg-black text-white cursor-pointer"}`}
                    onClick={() => setGridCols(2)}
                  >2x</button>
                  <button
                    className={`px-2.5 py-1.5 border rounded-none text-sm ${gridCols === 4 ? "border-white bg-white text-black" : "border-secondary bg-black text-white cursor-pointer"}`}
                    onClick={() => setGridCols(4)}
                  >4x</button>
                </div>
              </div>
            </div>

            {/* Grid de proyectos */}
            {isLoadingProjects ? (
              <div className="border border-secondary p-12 text-center">
                <div className="text-gray-400 text-lg animate-pulse mb-4">LOADING.SKETCHFAB.PROJECTS...</div>
                <div className="text-gray-500 text-sm mb-2">
                  {currentPage > 1 ? `Loading page ${currentPage}...` : `Fetching models from @${SKETCHFAB_CONFIG.username} profile`}
                </div>
                <div className="text-gray-500 text-xs">Please wait...</div>
              </div>
            ) : projectsError ? (
              <div className="border border-red-500 p-12 text-center">
                <div className="text-red-400 text-lg mb-2">ERROR.LOADING.PROJECTS</div>
                <div className="text-red-300 text-sm mb-4">{projectsError}</div>
                <Button
                  onClick={fetchSketchfabProjects}
                  variant="outline"
                  className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                >
                  RETRY.LOAD
                </Button>
              </div>
            ) : (
              <>
                {/* Mensaje de modo infinite scroll y totales */}
                {!usingFallback && totalModelsFound > 0 && (
                  <div className="text-center text-xs text-gray-400 mt-2">
                    <span className="font-bold">MODO INFINITE SCROLL:</span> Se encontraron {totalModelsFound} modelos en total.
                    {totalModelsFound > validModelsFound && (
                      <span className="ml-2 text-yellow-400">({validModelsFound} válidos para mostrar)</span>
                    )}
                  </div>
                )}

                <div className={`border-l border-t border-secondary grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${gridCols} gap-0`}>
                  {paginatedProjects.map((project, index) => (
                    <div
                      key={index}
                      className="bg-primary border-r border-b border-secondary hover:border-white transition-colors group"
                    >
                      <div className="p-6 flex flex-col h-full">
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            {/* Origen y categorías */}
                            <div className="flex w-full items-center justify-between">
                              <a
                                href={project.source === "SKETCHFAB" && project.sketchfabUid ? `https://sketchfab.com/3d-models/${project.sketchfabUid}` : project.source === "ARTSTATION" && project.viewerUrl ? project.viewerUrl : undefined}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="focus:outline-none"
                              >
                                <Badge
                                  variant="outline"
                                  className={`text-sm rounded-none flex items-center gap-1 cursor-pointer hover:underline ${project.source === "SKETCHFAB"
                                    ? "border-[#00aedf] text-[#00aedf]"
                                    : project.source === "ARTSTATION"
                                      ? "border-[#00aedf] text-[#00aedf]"
                                      : "border-gray-500 text-gray-500 bg-gray-900"
                                    }`}
                                >
                                  {project.source === "SKETCHFAB" && <SiSketchfab className="inline-block mr-1" style={{ fontSize: 16, verticalAlign: "middle" }} />}
                                  {project.source === "ARTSTATION" && <SiArtstation className="inline-block mr-1" style={{ fontSize: 16, verticalAlign: "middle" }} />}
                                  {project.source ? project.source : "UNKNOWN"}
                                </Badge>
                              </a>
                              <div className="flex flex-wrap gap-2 ml-auto">
                                {project.categories && project.categories.length > 0 ? (
                                  project.categories.map((cat, i) => (
                                    <div className="relative inline-block" key={i}>
                                      <Badge
                                        variant="secondary"
                                        className="text-sm bg-primary text-secondary rounded-none uppercase"
                                      >
                                        {cat}
                                      </Badge>
                                      {/* Corner brackets */}
                                      <div className="absolute top-0 left-0 w-2 h-2 border-t-1 border-l-1 border-gray-400 pointer-events-none"></div>
                                      <div className="absolute top-0 right-0 w-2 h-2 border-t-1 border-r-1 border-gray-400 pointer-events-none"></div>
                                      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-1 border-l-1 border-gray-400 pointer-events-none"></div>
                                      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-1 border-r-1 border-gray-400 pointer-events-none"></div>
                                    </div>
                                  ))
                                ) : (
                                  <span className="text-xs text-gray-400">NO.CATEGORY</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mb-2">
                            {/* Título a la izquierda, stats y fecha a la derecha */}
                            <a
                              href={project.source === "SKETCHFAB" && project.sketchfabUid ? `https://sketchfab.com/3d-models/${project.sketchfabUid}` : project.source === "ARTSTATION" && project.viewerUrl ? project.viewerUrl : undefined}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 focus:outline-none"
                            >
                              <div className="flex items-center gap-3">
                                <h3 className="text-secondary text-xl font-bold group-hover:text-gray-300 transition-colors font-bauhaus text-left hover:underline cursor-pointer">
                                  {project.title}
                                </h3>
                                {project.date && (
                                  <span className="text-xs text-gray-400 font-normal align-middle">
                                    {(() => {
                                      // Formatear fecha a YYYY.MM.DD
                                      const d = new Date(project.date)
                                      if (isNaN(d.getTime())) return project.date
                                      return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`
                                    })()}
                                  </span>
                                )}
                              </div>
                            </a>
                            {(project.likes || project.views) && (
                              <div className="flex items-center gap-4 ml-4 text-gray-400">
                                {project.likes ? (
                                  <div className="flex items-center gap-1">
                                    <Heart className="w-4 h-4" />
                                    <span>{project.likes.toLocaleString()}</span>
                                  </div>
                                ) : null}
                                {project.views ? (
                                  <div className="flex items-center gap-1">
                                    <Eye className="w-4 h-4" />
                                    <span>{project.views.toLocaleString()}</span>
                                  </div>
                                ) : null}
                              </div>
                            )}
                          </div>
                          {/* 3D Model Viewer - Sketchfab o local */}
                          <div className="mb-4">
                            {project.thumbnails && project.thumbnails.medium ? (
                              <img
                                src={project.thumbnails.large}
                                alt={project.title}
                                className="h-auto w-full object-cover border border-gray-600 bg-gray-900"
                                style={{ aspectRatio: "16/9" }}
                              />
                            ) : (
                              <div className="aspect-[16/9] bg-gray-900 border border-gray-600 flex items-center justify-center">
                                <div className="text-gray-400 text-sm">NO.MODEL.AVAILABLE</div>
                              </div>
                            )}
                          </div>

                          <p className="text-base text-gray-400 mb-2 line-clamp-3">{project.description}</p>

                          {/* Tags */}
                          {project.tags && project.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {project.tags.slice(0, 4).map((tag, tagIndex) => {
                                const tagKey = tag.toLowerCase();
                                const Icon = tagTechIcons[tagKey];
                                if (Icon) {
                                  return (
                                    <Badge
                                      key={tagIndex}
                                      variant="secondary"
                                      className="uppercase text-xs bg-secondary text-primary rounded-none flex items-center gap-1"
                                    >
                                      <Icon className="inline-block mr-1" style={{ fontSize: 16, verticalAlign: "middle" }} />
                                      {tag}
                                    </Badge>
                                  );
                                }
                                return (
                                  <Badge
                                    key={tagIndex}
                                    variant="secondary"
                                    className="uppercase text-xs bg-secondary text-primary rounded-none flex items-center gap-1"
                                  >
                                    #{tag}
                                  </Badge>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        <div className="mt-auto">
                          {/* Project metadata mejorada */}
                          <div className="space-y-2 mb-4 text-xs text-gray-400">
                            {project.triangles && (
                              <div className="flex justify-between items-center">
                                <span className="flex items-center gap-1"><Shapes className="w-4 h-4 mr-1" />TRIANGLES:</span>
                                <span className="text-white">{project.triangles.toLocaleString()}</span>
                              </div>
                            )}
                            {project.vertices && (
                              <div className="flex justify-between items-center">
                                <span className="flex items-center gap-1"><Layers className="w-4 h-4 mr-1" />VERTICES:</span>
                                <span className="text-white">{project.vertices.toLocaleString()}</span>
                              </div>
                            )}
                            <div className="flex justify-between items-center">
                              <span className="flex items-center gap-1"><Gauge className="w-4 h-4 mr-1" />COMPLEXITY:</span>
                              <span className={
                                project.complexity === "EXTREME" ? "text-red-500" :
                                  project.complexity === "HIGH" ? "text-yellow-500" :
                                    project.complexity === "MEDIUM" ? "text-green-500" :
                                      project.complexity === "LOW" ? "text-green-300" :
                                        "text-gray-400"
                              }>{project.complexity}</span>
                            </div>
                          </div>
                          {/* Botón alineado abajo */}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full text-sm text-gray-400 hover:text-white hover:bg-primary h-8 rounded-none border border-gray-700 hover:border-white transition-all cursor-pointer"
                            onClick={() => project.sketchfabUid && window.open(`https://sketchfab.com/3d-models/${project.sketchfabUid}`, '_blank')}
                          >
                            {project.sketchfabUid ? 'VIEW.ON.SKETCHFAB' : 'OPEN.PROJECT'} <ExternalLink className="w-3 h-3 ml-2" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>                
              </>
            )}

            {/* Footer info */}
            <div className="pt-2 mb-12">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-sm text-gray-400 w-full">
                <div>
                  <div>PORTFOLIO.VERSION: 3.2.1</div>
                  <div>BUILD.DATE: 2025.07.25</div>
                </div>
                {/* Paginación centrada en el footer */}
                {!usingFallback && totalPages > 1 && (
                  <div className="w-full md:w-auto flex justify-center order-3 md:order-none">
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={handlePrevPage}
                        disabled={currentPage === 1 || isLoadingProjects}
                        variant="ghost"
                        size="sm"
                        className="border border-gray-700 text-gray-400 hover:text-white hover:bg-primary hover:border-white transition-all cursor-pointer rounded-none disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        ← PREV
                      </Button>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => (
                          <Button
                            key={i + 1}
                            onClick={() => handleGoToPage(i + 1)}
                            disabled={isLoadingProjects}
                            variant={i + 1 === currentPage ? "default" : "ghost"}
                            size="sm"
                            className={`w-8 h-8 p-0 text-xs rounded-none cursor-pointer pointer-events-auto ${i + 1 === currentPage
                              ? "bg-white text-black border-white cursor-pointer pointer-events-auto !hover:bg-white !hover:text-black !focus:bg-white !focus:text-black !active:bg-white !active:text-black !hover:bg-white !focus:bg-white !active:bg-white !hover:text-black !focus:text-black !active:text-black"
                              : "border border-gray-700 text-gray-400 hover:text-white hover:bg-primary hover:border-white transition-all cursor-pointer"
                              } disabled:opacity-50`}
                            style={i + 1 === currentPage ? { backgroundColor: '#fff', color: '#000', borderColor: '#fff' } : {}}
                          >
                            {i + 1}
                          </Button>
                        ))}
                      </div>
                      <Button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages || isLoadingProjects}
                        variant="ghost"
                        size="sm"
                        className="border border-gray-700 text-gray-400 hover:text-white hover:bg-primary hover:border-white transition-all cursor-pointer rounded-none disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        NEXT →
                      </Button>
                    </div>
                  </div>
                )}
                <div className="text-right">
                  <div>MEMORY.USAGE: 1.2GB / 16GB</div>
                  <div>SYSTEM.STATUS: ONLINE</div>
                </div>
              </div>
            </div>
            <Footer currentTime={currentTime} />
          </div>
        </div>

        {/* Audio element para el reproductor */}
        <audio
          ref={audioRef}
          onEnded={handleEnded}
          preload="metadata"
        >
          {tracks.length > 0 && (
            <source src={tracks[currentTrack]?.src} type="audio/mpeg" />
          )}
          Tu navegador no soporta el elemento de audio.
        </audio>
      </div>
    </div>
  )
}