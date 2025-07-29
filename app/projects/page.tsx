"use client"

import { useState, useEffect, useRef } from "react"
import { BrowserHeader } from "@/components/BrowserHeader"
import { BrowserFrame } from "@/components/layout/BrowserFrame"
import { Footer } from "@/components/layout/Footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ExternalLink } from "lucide-react"
import Link from "next/link"
import { SiBlender, SiAutodesk, SiAdobephotoshop, SiUnity, SiUnrealengine, SiWebgl, SiAdobe, SiFigma, SiCss3, SiHoudini, SiMarvelapp, SiSketchfab } from "react-icons/si"
import { TbBrandThreejs } from "react-icons/tb"
import { FaPaintBrush } from "react-icons/fa"
import { IconType } from "react-icons"
import Model3DViewer from "@/components/3d/Model3DViewer"
import { SketchfabViewer } from "@/components/3d/SketchfabViewer"
import { SKETCHFAB_CONFIG } from "@/lib/sketchfab-config"

// Interfaz para los proyectos
interface Project {
  title: string;
  type: string;
  status: string;
  description: string;
  tech: string[];
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
  const [totalPages, setTotalPages] = useState<number>(1)
  const [hasNextPage, setHasNextPage] = useState<boolean>(false)
  const [hasPrevPage, setHasPrevPage] = useState<boolean>(false)

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

  // Función para cargar proyectos automáticamente desde Sketchfab
  const fetchSketchfabProjects = async (page: number = 1) => {
    try {
      setIsLoadingProjects(true)
      setProjectsError('')
      
      const response = await fetch(`/api/sketchfab-models?username=${SKETCHFAB_CONFIG.username}&page=${page}&limit=6`)
      const data = await response.json()
      
      if (data.success) {
        setAllProjects(data.projects)
        setTotalModelsFound(data.totalModels || 0)
        setValidModelsFound(data.validModels || data.projects.length)
        setUsingFallback(data.usingFallback || false)
        setCurrentPage(data.page || 1)
        setTotalPages(data.totalPages || 1)
        setHasNextPage(data.hasNextPage || false)
        setHasPrevPage(data.hasPrevPage || false)
      } else {
        throw new Error(data.error || 'Failed to fetch projects')
      }
    } catch (error) {
      console.error('Error loading Sketchfab projects:', error)
      setProjectsError(`Failed to load projects from @${SKETCHFAB_CONFIG.username}`)
      
      // Fallback a proyectos de configuración si falla la API
      setAllProjects(SKETCHFAB_CONFIG.fallbackProjects)
      setTotalModelsFound(0)
      setValidModelsFound(0)
      setUsingFallback(true)
      setCurrentPage(1)
      setTotalPages(1)
      setHasNextPage(false)
      setHasPrevPage(false)
    } finally {
      setIsLoadingProjects(false)
    }
  }

  // Funciones de navegación de paginación
  const handleNextPage = () => {
    if (hasNextPage) {
      fetchSketchfabProjects(currentPage + 1)
    }
  }

  const handlePrevPage = () => {
    if (hasPrevPage) {
      fetchSketchfabProjects(currentPage - 1)
    }
  }

  const handleGoToPage = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      fetchSketchfabProjects(page)
    }
  }

  // Cargar proyectos al montar el componente
  useEffect(() => {
    fetchSketchfabProjects(1)
  }, [])

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
                <div className="text-sm text-gray-400">SHOWING: {allProjects.length} OF {totalModelsFound}</div>
                <div className="text-sm text-gray-400">PAGE: {currentPage}/{totalPages}</div>
                <div className="text-sm text-gray-400">LAST.UPDATE: {currentTime}</div>
                {!isLoadingProjects && !usingFallback && (
                  <div className="text-xs text-green-400 mt-1">
                    TOTAL: {totalModelsFound} MODELS
                  </div>
                )}
                {usingFallback && (
                  <div className="text-xs text-yellow-400 mt-1">
                    USING.FALLBACK.DATA
                  </div>
                )}
              </div>
            </div>
            
            {/* Línea separadora estilo terminal */}
            <div className="border-t border-secondary mb-6"></div>
            
            {/* Stats del portfolio */}
            <div className="border border-secondary grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="border-r border-secondary bg-primary p-4">
                <div className="text-2xl font-bold text-white">{allProjects.filter(p => p.status === "COMPLETE").length}</div>
                <div className="text-sm text-gray-400">COMPLETED</div>
              </div>
              <div className="border-r border-secondary bg-primary p-4">
                <div className="text-2xl font-bold text-green-500">{allProjects.filter(p => p.status === "ACTIVE").length}</div>
                <div className="text-sm text-gray-400">ACTIVE</div>
              </div>
              <div className="border-r border-secondary bg-primary p-4">
                <div className="text-2xl font-bold text-yellow-500">{allProjects.filter(p => p.status === "BETA").length}</div>
                <div className="text-sm text-gray-400">BETA</div>
              </div>
              <div className="bg-primary p-4">
                <div className="text-2xl font-bold text-white">
                  {allProjects.reduce((total, project) => {
                    const size = parseFloat(project.fileSize.replace(/[GB|MB]/g, ""))
                    return total + (project.fileSize.includes("GB") ? size : size / 1000)
                  }, 0).toFixed(1)}GB
                </div>
                <div className="text-sm text-gray-400">TOTAL.SIZE</div>
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
                onClick={() => fetchSketchfabProjects(1)}
                variant="outline"
                className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
              >
                RETRY.LOAD
              </Button>
            </div>
          ) : (
            <>
              {/* Info sobre el sistema de paginación */}
              {!usingFallback && totalModelsFound > 0 && (
                <div className="border border-blue-500 p-4 mb-4 text-center bg-blue-900/20">
                  <div className="text-blue-400 text-sm">
                    <span className="font-bold">MODO PAGINACIÓN:</span> Se encontraron {totalModelsFound} modelos en total. 
                    Navegando por páginas de 6 modelos para mejor rendimiento.
                    {totalModelsFound > validModelsFound && (
                      <span className="block mt-1 text-yellow-300">
                        Algunos modelos privados o con restricciones han sido omitidos.
                      </span>
                    )}
                  </div>
                </div>
              )}
              
              <div className="border-r border-b border-secondary grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
                {allProjects.map((project, index) => (
              <div
                key={index}
                className="bg-primary border-t border-l border-secondary hover:border-white transition-colors group"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Badge
                      variant="outline"
                      className={`text-sm rounded-none ${
                        project.status === "ACTIVE"
                          ? "border-green-500 text-green-500"
                          : project.status === "COMPLETE"
                            ? "border-blue-500 text-blue-500"
                            : "border-yellow-500 text-yellow-500"
                      }`}
                    >
                      {project.status}
                    </Badge>
                    <span className="text-sm text-gray-400">{project.type}</span>
                  </div>
                  
                  <h3 className="text-secondary text-xl font-bold mb-2 group-hover:text-gray-300 transition-colors font-bauhaus">
                    {project.title}
                  </h3>

                  {/* 3D Model Viewer - Sketchfab o local */}
                  <div className="mb-4">
                    {project.sketchfabUid ? (
                      <SketchfabViewer 
                        modelUid={project.sketchfabUid}
                        className="h-72"
                        autoStart={true}
                      />
                    ) : project.modelPath ? (
                      <Model3DViewer modelPath={project.modelPath} className="h-48" />
                    ) : (
                      <div className="h-48 bg-gray-900 border border-gray-600 flex items-center justify-center">
                        <div className="text-gray-400 text-sm">NO.MODEL.AVAILABLE</div>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-base text-gray-400 mb-4 line-clamp-3">{project.description}</p>
                  
                  {/* Información de Sketchfab */}
                  {project.author && (
                    <div className="mb-3 text-xs text-blue-400">
                      <span className="font-bold">BY:</span> {project.author}
                    </div>
                  )}
                  
                  {/* Tags */}
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {project.tags.slice(0, 4).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded border border-gray-600"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.map((tech, techIndex) => {
                      const Icon = techIcons[tech.toUpperCase()]
                      return (
                        <Badge
                          key={techIndex}
                          variant="secondary"
                          className="text-sm bg-secondary text-primary rounded-none flex items-center gap-1"
                        >
                          {Icon && <Icon className="inline-block text-primary mr-1" style={{ fontSize: 14, verticalAlign: "middle" }} />}
                          {tech}
                        </Badge>
                      )
                    })}
                  </div>
                  
                  {/* Project metadata mejorada */}
                  <div className="space-y-2 mb-4 text-xs text-gray-400">
                    {project.triangles && (
                      <div className="flex justify-between">
                        <span>TRIANGLES:</span>
                        <span className="text-white">{project.triangles.toLocaleString()}</span>
                      </div>
                    )}
                    {project.vertices && (
                      <div className="flex justify-between">
                        <span>VERTICES:</span>
                        <span className="text-white">{project.vertices.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>FILE.SIZE:</span>
                      <span>{project.fileSize}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>COMPLEXITY:</span>
                      <span className={
                        project.complexity === "EXTREME" ? "text-red-500" :
                        project.complexity === "HIGH" ? "text-yellow-500" :
                        "text-green-500"
                      }>{project.complexity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>DATE:</span>
                      <span>{project.date}</span>
                    </div>
                  </div>
                  
                  {/* Stats de Sketchfab */}
                  {(project.likes || project.views || project.downloads) && (
                    <div className="flex justify-between text-xs text-gray-400 mb-4 border-t border-gray-700 pt-2">
                      {project.likes ? (
                        <div className="flex items-center gap-1">
                          <span className="text-red-400">♥</span>
                          <span>{project.likes.toLocaleString()}</span>
                        </div>
                      ) : null}
                      {project.views ? (
                        <div className="flex items-center gap-1">
                          <span className="text-blue-400">👁</span>
                          <span>{project.views.toLocaleString()}</span>
                        </div>
                      ) : null}
                      {project.downloads ? (
                        <div className="flex items-center gap-1">
                          <span className="text-green-400">⬇</span>
                          <span>{project.downloads.toLocaleString()}</span>
                        </div>
                      ) : null}
                    </div>
                  )}
                  
                  {/* Licencia */}
                  {project.license && (
                    <div className="text-xs text-gray-400 mb-4">
                      <span className="font-bold">LICENSE:</span> {project.license}
                    </div>
                  )}
                  
                  {/* Action button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-sm text-gray-400 hover:text-white hover:bg-gray-800 h-8 rounded-none border border-gray-700 hover:border-white transition-all cursor-pointer"
                    onClick={() => project.sketchfabUid && window.open(`https://sketchfab.com/3d-models/${project.sketchfabUid}`, '_blank')}
                  >
                    {project.sketchfabUid ? 'VIEW.ON.SKETCHFAB' : 'OPEN.PROJECT'} <ExternalLink className="w-3 h-3 ml-2" />
                  </Button>
                </div>
              </div>
            ))}
              </div>
              
              {/* Controles de paginación */}
              {!usingFallback && totalPages > 1 && (
                <div className="border-t border-secondary mt-8 pt-6">
                  <div className="flex items-center justify-between">
                    {/* Información de página */}
                    <div className="text-sm text-gray-400">
                      PAGE {currentPage} OF {totalPages} • SHOWING {allProjects.length} MODELS
                    </div>
                    
                    {/* Controles de navegación */}
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={handlePrevPage}
                        disabled={!hasPrevPage || isLoadingProjects}
                        variant="outline"
                        size="sm"
                        className="border-gray-600 text-gray-400 hover:border-white hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        ← PREV
                      </Button>
                      
                      {/* Páginas numeradas */}
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum: number;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          
                          return (
                            <Button
                              key={pageNum}
                              onClick={() => handleGoToPage(pageNum)}
                              disabled={isLoadingProjects}
                              variant={pageNum === currentPage ? "default" : "outline"}
                              size="sm"
                              className={`w-8 h-8 p-0 text-xs ${
                                pageNum === currentPage 
                                  ? "bg-white text-black border-white" 
                                  : "border-gray-600 text-gray-400 hover:border-white hover:text-white"
                              } disabled:opacity-50`}
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                      </div>
                      
                      <Button
                        onClick={handleNextPage}
                        disabled={!hasNextPage || isLoadingProjects}
                        variant="outline"
                        size="sm"
                        className="border-gray-600 text-gray-400 hover:border-white hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        NEXT →
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          
          {/* Footer info */}
          <div className="pt-2 mb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-sm text-gray-400">
              <div>
                <div>PORTFOLIO.VERSION: 3.2.1</div>
                <div>BUILD.DATE: 2025.07.25</div>
              </div>
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