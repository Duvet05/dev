"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Terminal, Code, Cpu, Zap, Globe, Mail, Github, Twitter, ArrowRight, Volume2, SkipBack, SkipForward, Play, Pause } from "lucide-react"
import { SiArtstation, SiInstagram, SiLinkedin, SiDiscord, SiGmail, SiSketchfab } from "react-icons/si";
import { FaStepBackward, FaStepForward, FaPlay, FaPause, FaVolumeUp } from "react-icons/fa";
import '@hackernoon/pixel-icon-library/fonts/iconfont.css';

export default function CyberpunkPortfolio() {
  const [currentTime, setCurrentTime] = useState("")
  const [glitchText, setGlitchText] = useState("CUADOT")
  const [isPlaying, setIsPlaying] = useState(false)
  const [showProjectsWindow, setShowProjectsWindow] = useState(false)
  const [windowPosition, setWindowPosition] = useState({ x: 100, y: 100 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [currentTrack, setCurrentTrack] = useState(0)
  const [playerState, setPlayerState] = useState("STOPPED")
  const [volume, setVolume] = useState(8) // 0-8

  // Simulación de porcentajes dinámicos
  const [cpuUsage, setCpuUsage] = useState(87);
  const [gpuUsage, setGpuUsage] = useState(92);
  const [ramUsage, setRamUsage] = useState(64);

  // Estado para la barra de rendering
  const [renderingProgress, setRenderingProgress] = useState(73);

  // Estado para la rotación de skills
  const [skillAngles, setSkillAngles] = useState([0, 0, 0, 0]);

  const audioRef = useRef<HTMLAudioElement>(null);
  const [tracks, setTracks] = useState<{ name: string, src: string }[]>([]);
  const [isLoadingArt, setIsLoadingArt] = useState(false);

  // --- Reproductor de música mejorado estilo pixel/cyberpunk ---
  // Solo muestra el nombre del archivo mp3
  const fetchTracks = async () => {
    try {
      const res = await fetch("/api/music");
      if (!res.ok) throw new Error("No se pudo cargar la música");
      const data: { name: string, src: string }[] = await res.json();
      setTracks(data);
    } catch (err) {
      setTracks([]);
    }
  };

  useEffect(() => {
    fetchTracks();
  }, []);

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

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      const glitchChars = "!@#$%^&*()_+-=[]{}|;:,.<>?"
      const originalText = "CUADOT"
      let glitched = ""

      for (let i = 0; i < originalText.length; i++) {
        if (Math.random() < 0.1) {
          glitched += glitchChars[Math.floor(Math.random() * glitchChars.length)]
        } else {
          glitched += originalText[i]
        }
      }

      setGlitchText(glitched)

      setTimeout(() => setGlitchText("CUADOT"), 100)
    }, 3000)

    return () => clearInterval(glitchInterval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage(Math.floor(70 + Math.random() * 30));
      setGpuUsage(Math.floor(70 + Math.random() * 30));
      setRamUsage(Math.floor(32 + Math.random() * 32));
    }, 1000); // Cambio cada segundo
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setRenderingProgress(prev => {
        if (prev >= 100) return 0;
        return prev + 1;
      });
    }, 1000); // Sube cada segundo
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Bajo FPS: 16 frames por segundo
    const interval = setInterval(() => {
      setSkillAngles(prev => prev.map(angle => (angle + 22.5) % 360));
    }, 62); // ~16 FPS
    return () => clearInterval(interval);
  }, []);

  // Control de reproducción
  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      setPlayerState("STOPPED");
    } else {
      audioRef.current.play();
      setIsPlaying(true);
      setPlayerState("PLAYING");
    }
  };

  const handlePrev = () => {
    if (tracks.length === 0) return;
    let prev = currentTrack - 1;
    if (prev < 0) prev = tracks.length - 1;
    setCurrentTrack(prev);
    setIsPlaying(false);
    setPlayerState("STOPPED");
  };

  const handleNext = () => {
    if (tracks.length === 0) return;
    let next = currentTrack + 1;
    if (next >= tracks.length) next = 0;
    setCurrentTrack(next);
    setIsPlaying(false);
    setPlayerState("STOPPED");
  };

  // Actualiza la pista cuando cambia
  useEffect(() => {
    if (audioRef.current && tracks.length > 0) {
      audioRef.current.pause();
      audioRef.current.load();
      setIsPlaying(false);
      setPlayerState("STOPPED");
    }
  }, [currentTrack, tracks]);

  // Control de volumen
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 8;
    }
  }, [volume]);

  // Cuando termina la canción
  const handleEnded = () => {
    handleNext();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragOffset({
      x: e.clientX - windowPosition.x,
      y: e.clientY - windowPosition.y,
    })
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setWindowPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging, dragOffset])

  const projects = [
    {
      title: "QUANTUM_MESH.EXE",
      type: "3D VISUALIZATION",
      status: "ACTIVE",
      description: "Neural network visualization with real-time data processing",
      tech: ["BLENDER", "THREE.JS", "WEBGL"],
      date: "2024.01.15",
    },
    {
      title: "CYBER_CITY.BIN",
      type: "ENVIRONMENT",
      status: "COMPLETE",
      description: "Dystopian cityscape with procedural generation",
      tech: ["UNREAL", "HOUDINI", "SUBSTANCE"],
      date: "2024.01.08",
    },
    {
      title: "ANDROID_DREAMS",
      type: "CHARACTER",
      status: "BETA",
      description: "Photorealistic android character with advanced rigging",
      tech: ["MAYA", "ZBRUSH", "MARVELOUS"],
      date: "2024.01.22",
    },
    {
      title: "NEON_INTERFACE.SYS",
      type: "UI/UX",
      status: "ACTIVE",
      description: "Holographic user interface design system",
      tech: ["FIGMA", "AFTER.EFFECTS", "CSS"],
      date: "2024.01.30",
    },
    {
      title: "MECH_WARRIOR.OBJ",
      type: "CHARACTER",
      status: "COMPLETE",
      description: "High-detail mechanical warrior with full animation rig",
      tech: ["MAYA", "SUBSTANCE", "UNREAL"],
      date: "2023.12.20",
    },
    {
      title: "DATA_STREAM.VFX",
      type: "EFFECTS",
      status: "BETA",
      description: "Real-time particle system for data visualization",
      tech: ["HOUDINI", "THREE.JS", "GLSL"],
      date: "2024.02.05",
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white font-vt323 overflow-x-hidden">
      {/* Browser Frame */}
      <div className="border border-secondary m-2">
        {/* Browser Header */}
        <div className="bg-primary border-b border-secondary p-2 pl-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500"></div>
            <div className="w-3 h-3 bg-yellow-500"></div>
            <div className="w-3 h-3 bg-green-500"></div>
          </div>
          <div className="flex-1 ml-4 mr-2">
            <div className="bg-black border border-gray-600 px-3 py-1 text-sm">
              HTTPS://CUADOT.COM
            </div>
          </div>
          <div className="flex space-x-1 group">
            <a href="https://www.artstation.com/cuadot" target="_blank" rel="noopener noreferrer">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-primary hover:bg-secondary rounded-none h-8 py-1 flex items-center"
              >
                <SiArtstation className="w-5 h-5" />
              </Button>
            </a>
            <a href="https://sketchfab.com/cuadot" target="_blank" rel="noopener noreferrer">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-primary hover:bg-secondary rounded-none h-8 py-1 flex items-center"
              >
                <SiSketchfab className="w-5 h-5" />
              </Button>
            </a>
            <a href="https://instagram.com/cuadot.art" target="_blank" rel="noopener noreferrer">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-primary hover:bg-secondary rounded-none h-8 py-1 flex items-center"
              >
                <SiInstagram className="w-5 h-5" />
              </Button>
            </a>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-primary border-b border-secondary py-2 px-4">
          <div className="flex justify-between items-center">
            <div className="flex space-x-8 text-base">
              <a href="#home" className="text-white hover:underline">HOME</a>
              <a href="#about" className="text-gray-400 hover:underline">ABOUT.ME</a>
              <a href="#stack" className="text-gray-400 hover:underline">STACK</a>
              <a href="#projects" className="text-gray-400 hover:underline">PROJECTS</a>
              <a href="#skills" className="text-gray-400 hover:underline">SKILLS</a>
              <a href="#contact" className="text-gray-400 hover:underline">CONTACT</a>
            </div>
            {/* Mini reproductor de música funcional estilo terminal/pixel art */}
            <div className="flex items-center space-x-3 rounded-none font-vt323 text-white min-w-[260px] bg-black">
              {tracks.length > 0 ? (
                <audio
                  ref={audioRef}
                  src={tracks[currentTrack]?.src}
                  onEnded={handleEnded}
                  preload="auto"
                  style={{ display: "none" }}
                />
              ) : null}
              {/* Nombre del archivo mp3 */}
              <div className="flex items-center ml-2 min-w-0">
                <span
                  className="text-xs text-gray-400 truncate max-w-[120px]"
                  title={tracks.length > 0 ? tracks[currentTrack]?.name : "No music"}
                >
                  {tracks.length > 0 ? tracks[currentTrack]?.name : "No music"}
                </span>
                <span
                  className={`text-xs ${playerState === "PLAYING" ? "text-green-500" : "text-gray-400"}`}
                >
                  [{playerState}]
                </span>
              </div>
              {/* Controles con iconos sólidos de react-icons/fa */}
              <div className="flex items-center space-x-1">
                <button
                  className="w-6 h-6 flex items-center justify-center bg-secondary text-black hover:bg-white hover:text-black transition-colors rounded-none border border-gray-600"
                  onClick={handlePrev}
                  aria-label="Anterior"
                  disabled={tracks.length === 0}
                >
                  <FaStepBackward className="w-3 h-3" />
                </button>
                <button
                  className={`w-6 h-6 flex items-center justify-center bg-secondary ${isPlaying ? "text-black" : "text-black"} hover:bg-white hover:text-black transition-colors rounded-none border border-gray-600`}
                  onClick={handlePlayPause}
                  aria-label={isPlaying ? "Pausar" : "Reproducir"}
                  disabled={tracks.length === 0}
                >
                  {isPlaying ? <FaPause className="w-3 h-3" /> : <FaPlay className="w-3 h-3" />}
                </button>
                <button
                  className="w-6 h-6 flex items-center justify-center bg-secondary text-black hover:bg-white hover:text-black transition-colors rounded-none border border-gray-600"
                  onClick={handleNext}
                  aria-label="Siguiente"
                  disabled={tracks.length === 0}
                >
                  <FaStepForward className="w-3 h-3" />
                </button>
              </div>
              {/* Volumen tipo cuadritos + icono */}
              <div className="flex items-center ml-2">
                <FaVolumeUp className="w-4 h-4 text-gray-400 mr-1" />
                {[...Array(8)].map((_, i) => (
                  <button
                    key={i}
                    className={`w-4 h-4 border border-gray-600 mx-[1px] ${i < volume ? "bg-white" : "bg-black"}`}
                    style={{ boxShadow: i < volume ? "0 0 1px #fff" : "none" }}
                    onClick={() => setVolume(i + 1)}
                    aria-label={`Volumen ${((i + 1) * 12.5).toFixed(0)}%`}
                  ></button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8">
          {/* Hero Section */}
          <div className="relative mb-16">
            <div className="grid grid-cols-12 mb-8">
              <div className="col-span-12 lg:col-span-8">
                <div className="relative h-96 bg-primary border border-secondary overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      {/*<h1 className="text-6xl font-bold glitch-text font-bauhaus-pixel">{glitchText}</h1>*/}
                      <h1 className="text-8xl font-bauhaus-pixel mb-[-18]">{glitchText}</h1>
                      <p className="text-2xl text-gray-400 mb-6">3D.ARTIST.DEVELOPER</p>
                      <div className="flex justify-center space-x-4">
                        <Badge variant="outline" className="text-sm border-white text-white rounded-none">
                          ONLINE
                        </Badge>
                        <Badge variant="outline" className="text-sm border-gray-600 text-gray-400 rounded-none">
                          GMT-6 {currentTime}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="grid grid-cols-4 gap-2">
                      {[...Array(16)].map((_, i) => (
                        <div
                          key={i}
                          className="h-1 bg-secondary animate-pulse"
                          style={{
                            animationDelay: `${i * 0.1}s`,
                          }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-12 lg:col-span-4 border-t border-b border-r border-secondary">
                <div className="text-secondary bg-primary border-b border-secondary p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">SYSTEM.STATUS</span>
                    <div className="w-2 h-2 bg-green-500 animate-pulse"></div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span>CPU</span>
                      <span className="text-white">{cpuUsage}%</span>
                    </div>
                    <div className="w-full bg-secondary h-1 mb-2">
                      <div className="bg-green-500 h-1" style={{ width: `${cpuUsage}%` }}></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>GPU</span>
                      <span className="text-white">{gpuUsage}%</span>
                    </div>
                    <div className="w-full bg-secondary h-1 mb-2">
                      <div className="bg-blue-500 h-1" style={{ width: `${gpuUsage}%` }}></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>RAM</span>
                      <span className="text-white">{ramUsage}GB</span>
                    </div>
                    <div className="w-full bg-secondary h-1">
                      <div className="bg-yellow-500 h-1" style={{ width: `${(ramUsage / 64) * 100}%` }}></div>
                    </div>
                  </div>
                </div>
                <div className="bg-primary p-4">
                  <div className="text-sm text-gray-400 mb-2">CURRENT.PROJECT</div>
                  <div className="text-base text-white">QUANTUM_MESH.EXE</div>
                  <div className="text-sm text-gray-400 mt-1">RENDERING... {renderingProgress}%</div>
                  <div className="w-full bg-secondary h-1 mt-2">
                    <div className="bg-purple-500 h-1" style={{ width: `${renderingProgress}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row mb-16 gap-8 items-stretch h-full md:justify-between">
            {/* About Me Section */}
            <div id="about" className="flex-[3] h-full self-stretch flex flex-col">
              <h2 className="text-4xl font-bauhaus-pixel leading-none mb-4">ABOUT.ME</h2>
              {/* Window Header */}
              <div
                className="pl-4 bg-secondary p-2 flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500"></div>
                  <div className="w-3 h-3 bg-yellow-500"></div>
                  <div className="w-3 h-3 bg-green-500"></div>
                  <span className="text-sm text-primary ml-4">ABOUT.ME.EXE</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" className="text-primary w-6 h-6 p-0">
                    <span className="text-xs">_</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="text-primary w-6 h-6 p-0">
                    <span className="text-xs">□</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary w-6 h-6 p-0"
                  >
                    <span className="text-xs">×</span>
                  </Button>
                </div>
              </div>

              <div className="flex flex-col md:flex-row h-full flex-1">
                <div className="border-l border-t border-b border-secondary bg-primary p-6 text-white text-lg font-vt323 max-w-3xl flex items-center justify-center md:mr-0 md:ml-0 md:self-stretch">
                  <img
                    src="/images/dithered-image.png"
                    alt="Cuadot Profile"
                    className="w-[196px] h-[196px] object-cover rounded-lg aspect-square"
                  />
                </div>
                <div className="bg-primary border border-secondary p-6 text-white text-lg font-vt323 flex-1 flex items-center md:ml-0 md:self-stretch">
                  <div className="w-full">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold font-bauhaus whitespace-nowrap overflow-hidden flex items-center">
                        <span>VICTOR.CUADOT.ESQUEDA</span>
                        <span className="flex-1 ml-2 text-secondary" style={{ letterSpacing: '2px' }}>{'/'.repeat(40)}</span>
                      </h3>
                      <a href="/cv.pdf" download>
                        <Button
                          variant="outline"
                          className="border-white text-white hover:bg-white hover:text-black bg-transparent rounded-none"
                        >
                          DOWNLOAD.CV <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </a>
                    </div>
                    <p>
                      I'm Cuadot, a 3D artist with a strong background in digital art and technology. I studied and taught at UNIAT, where I discovered my passion for sharing knowledge and pushing creative boundaries. My journey includes freelance work and collaborations with leading companies in the industry, contributing to projects for games, film, and advertising. I specialize in advanced visualization, procedural environments, and interactive experiences, always blending technical mastery with artistic vision. I love exploring new tools and trends, and I'm always open to new challenges, collaborations, and freelance opportunities in the digital and creative world.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stack Section */}
            <div id="stack" className="flex-1 h-full flex flex-col self-stretch">
              <h2 className="text-4xl font-bauhaus-pixel leading-none mb-4">STACK</h2>
              <div className="w-full max-w-2xl mx-auto flex flex-col">
                {[
                  { tech: "Blender", level: 10 },
                  { tech: "Maya", level: 9 },
                  { tech: "ZBrush", level: 8 },
                  { tech: "Substance", level: 9 },
                  { tech: "Photoshop", level: 10 },
                  { tech: "Unity", level: 6 },
                  { tech: "Unreal", level: 6 },
                  { tech: "WebGL", level: 7 },
                  { tech: "Marvelous", level: 7 },
                  { tech: "Houdini", level: 6 },
                ].map(({ tech, level }, idx) => (
                  <div key={tech} className="flex items-center w-full">
                    <span className="font-vt323 text-lg text-white min-w-[100px] md:min-w-[120px] text-left">■ {tech}</span>
                    <div className="flex flex-1 justify-end gap-1">
                      {[...Array(10)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-7 h-3 border border-secondary ${i < level ? 'bg-white' : 'bg-black'} transition-colors`}
                          style={{ boxShadow: i < level ? '0 0 1px #fff' : 'none', marginLeft: '1px' }}
                        ></div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Projects Grid */}
          <div id="projects" className="mb-16">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-4xl font-bauhaus-pixel leading-none">PROJECTS</h2>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-black bg-transparent rounded-none"
                onClick={() => setShowProjectsWindow(true)}
              >
                VIEW.ALL <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <div className="border-r border-b border-secondary grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, index) => (
                <div
                  key={index}
                  className="bg-primary border-t border-l border-secondary hover:border-white transition-colors group"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Badge
                        variant="outline"
                        className={`text-sm rounded-none ${project.status === "ACTIVE"
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
                    <p className="text-base text-gray-400 mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech, techIndex) => (
                        <Badge
                          key={techIndex}
                          variant="secondary"
                          className="text-sm bg-secondary text-primary rounded-none"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Section */}
          <div id="skills" className="mb-16">

            <h2 className="text-4xl font-bauhaus-pixel leading-none mb-4">SKILLS</h2>

            <div className="border-secondary border-r grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              {[
                { img: "/images/skills/modeling.png", title: "3D MODELING", desc: "High-poly & low-poly assets" },
                { img: "/images/skills/animation.png", title: "ANIMATION", desc: "Character & motion graphics" },
                { img: "/images/skills/texturing.png", title: "TEXTURING", desc: "PBR, hand-painted, UV mapping" },
                { img: "/images/skills/rigging.png", title: "RIGGING", desc: "Skeletons, facial, advanced setups" },
              ].map((skill, index) => (
                <div
                  key={index}
                  className="bg-primary border-t border-b border-l border-secondary p-6 text-center hover:border-white transition-colors group"
                >
                  <img
                    src={skill.img}
                    alt={skill.title}
                    className="w-[50px] h-[50px] mx-auto mb-4 object-contain invert"
                    style={{
                      transform: `rotateY(${skillAngles[index]}deg)`,
                      transition: 'transform 0.06s linear',
                    }}
                  />
                  <h3 className="font-bold text-secondary font-bauhaus text-lg">{skill.title}</h3>
                  <p className="text-base text-gray-400">{skill.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div id="contact" className="mb-16">
            <h2 className="text-4xl font-bauhaus-pixel leading-none mb-4">CONTACT</h2>
            {/* Window Header */}
            <div
              className="pl-4 bg-secondary p-2 flex items-center justify-between"
            >
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500"></div>
                <div className="w-3 h-3 bg-yellow-500"></div>
                <div className="w-3 h-3 bg-green-500"></div>
                <span className="text-sm text-primary ml-4">CONTACT.EXE</span>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="text-primary w-6 h-6 p-0">
                  <span className="text-xs">_</span>
                </Button>
                <Button variant="ghost" size="sm" className="text-primary w-6 h-6 p-0">
                  <span className="text-xs">□</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary w-6 h-6 p-0"
                >
                  <span className="text-xs">×</span>
                </Button>
              </div>
            </div>
            <div className="border-secondary border grid grid-cols-1 lg:grid-cols-2">
              <div>
                <div className="bg-primary border-r border-secondary p-6">
                  <h3 className="text-xl font-bold mb-4 font-bauhaus whitespace-nowrap overflow-hidden w-full flex items-center">
                    <span>SEND.MESSAGE</span>
                    <span className="flex-1 ml-2 text-secondary" style={{ letterSpacing: '2px' }}>{'/'.repeat(40)}</span>
                  </h3>
                  <div className="space-y-4">
                    <Input
                      placeholder="NAME.INPUT"
                      className="border-gray-600 text-white placeholder:text-gray-500 rounded-none"
                    />
                    <Input
                      placeholder="EMAIL.ADDRESS"
                      className="border-gray-600 text-white placeholder:text-gray-500 rounded-none"
                    />
                    <Textarea
                      placeholder="MESSAGE.CONTENT"
                      className="bg-black border-gray-600 text-white placeholder:text-gray-500 min-h-[201px] rounded-none"
                    />
                    <Button className="w-full bg-white text-black hover:bg-gray-200 rounded-none">TRANSMIT.DATA</Button>
                  </div>
                </div>
              </div>
              <div>
                <div className="text-secondary bg-primary border-b border-secondary p-6">
                  <h3 className="text-xl font-bold mb-4 font-bauhaus whitespace-nowrap overflow-hidden w-full flex items-center">
                    <span>DIRECT.LINKS</span>
                    <span className="flex-1 ml-2 text-secondary" style={{ letterSpacing: '2px' }}>{'/'.repeat(40)}</span>
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <SiArtstation className="w-5 h-5 text-white" />
                      <a href="https://www.artstation.com/cuadot" target="_blank" rel="noopener noreferrer" className="text-base hover:underline">artstation.com/cuadot</a>
                    </div>
                    <div className="flex items-center space-x-3">
                      <SiSketchfab className="w-5 h-5 text-white" />
                      <a href="https://sketchfab.com/cuadot" target="_blank" rel="noopener noreferrer" className="text-base hover:underline">sketchfab.com/cuadot</a>
                    </div>
                    <div className="flex items-center space-x-3">
                      <SiInstagram className="w-5 h-5 text-white" />
                      <a href="https://www.instagram.com/cuadot.art" target="_blank" rel="noopener noreferrer" className="text-base hover:underline">@cuadot.art</a>
                    </div>
                    <div className="flex items-center space-x-3">
                      <SiLinkedin className="w-5 h-5 text-white" />
                      <a href="https://www.linkedin.com/in/cuadot" target="_blank" rel="noopener noreferrer" className="text-base hover:underline">linkedin.com/in/cuadot</a>
                    </div>
                    <div className="flex items-center space-x-3">
                      <SiGmail className="w-5 h-5 text-white" />
                      <a href="mailto:cuadot.art@gmail.com" className="text-base hover:underline">cuadot.art@gmail.com</a>
                    </div>
                    <div className="flex items-center space-x-3">
                      <SiDiscord className="w-5 h-5 text-white" />
                      <a href="https://discord.gg/cuadot" target="_blank" rel="noopener noreferrer" className="text-base hover:underline">discord.gg/cuadot</a>
                    </div>
                  </div>
                </div>
                <div className="bg-primary p-6">
                  <h3 className="text-xl font-bold mb-4 font-bauhaus whitespace-nowrap overflow-hidden w-full flex items-center">
                    <span>LOCATION.DATA</span>
                    <span className="flex-1 ml-2 text-secondary" style={{ letterSpacing: '2px' }}>{'/'.repeat(39)}</span>
                  </h3>
                  <div className="text-sm text-gray-400">
                    <p>■ SECTOR: MÉXICO</p>
                    <p>■ TIMEZONE: GMT-6 {currentTime}</p>
                    <p>■ STATUS: AVAILABLE.FOR.HIRE</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-secondary pt-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 border border-white flex items-center justify-center">
                    <Terminal className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-2xl font-bauhaus-pixel mb-[-8]">CUADOT</span>
                </div>
                <p className="text-gray-400">
                  Cuadot is a 3D artist and developer focused on visualization, procedural environments, and interactive experiences. Open for collaborations and freelance work.
                </p>
                <p className="text-gray-500 mt-2 text-xs">
                  Website developed by <a href="https://cosmodev.me" target="_blank" rel="noopener noreferrer" className="underline">cosmodev.me</a>
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-4 font-bauhaus text-base">SERVICES</h4>
                <div className="space-y-2 text-gray-400">
                  <p>3D Modeling & Animation</p>
                  <p>WebGL Development</p>
                  <p>Interactive Experiences</p>
                  <p>Virtual Environments</p>
                </div>
              </div>
              <div>
                <h4 className="font-bold mb-4 font-bauhaus text-base">TECHNOLOGIES</h4>
                <div className="space-y-2 text-gray-400">
                  <p>Blender • Maya • ZBrush</p>
                  <p>Three.js • WebGL • React</p>
                  <p>Unreal Engine • Unity</p>
                  <p>Substance Suite</p>
                </div>
              </div>
              <div>
                <h4 className="font-bold mb-4 font-bauhaus text-base">SYSTEM.INFO</h4>
                <div className="space-y-2 text-gray-400">
                  <p>VERSION: 2.0.24</p>
                  <p>BUILD: {currentTime}</p>
                  <p>LICENSE: CREATIVE.COMMONS</p>
                  <p>© 2025 Cuadot</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Window Modal */}
        {showProjectsWindow && (
          <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/60"></div>
            <div
              className="absolute bg-primary border border-gray-700 min-w-[800px] max-w-[1000px] min-h-[600px]"
              style={{
                left: windowPosition.x,
                top: windowPosition.y,
              }}
            >
              {/* Window Header */}
              <div
                className="pl-4 bg-secondary p-2 flex items-center justify-between cursor-move select-none"
                onMouseDown={handleMouseDown}
              >
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500"></div>
                  <div className="w-3 h-3 bg-yellow-500"></div>
                  <div className="w-3 h-3 bg-green-500"></div>
                  <span className="text-sm text-primary ml-4">PROJECTS.ARCHIVE.EXE</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" className="text-primary w-6 h-6 p-0">
                    <span className="text-xs">_</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="text-primary w-6 h-6 p-0">
                    <span className="text-xs">□</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary w-6 h-6 p-0 cursor-pointer"
                    onClick={() => setShowProjectsWindow(false)}
                  >
                    <span className="text-xs">×</span>
                  </Button>
                </div>
              </div>

              {/* Window Content */}
              <div className="p-6 max-h-[500px] overflow-y-auto">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">PROJECT.ARCHIVE</h2>
                  <div className="text-xs text-gray-400">TOTAL.ENTRIES: {projects.length} | STATUS: OPERATIONAL</div>
                </div>

                <div className="border-l border-t border-secondary grid grid-cols-1 md:grid-cols-2">
                  {projects.map((project, index) => (
                    <div key={index} className="bg-black border-secondary border-r border-b hover:border-white transition-colors group">
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <Badge
                            variant="outline"
                            className={`text-xs rounded-none ${project.status === "ACTIVE"
                              ? "border-white text-white"
                              : project.status === "COMPLETE"
                                ? "border-gray-400 text-gray-400"
                                : "border-gray-500 text-gray-500"
                              }`}
                          >
                            {project.status}
                          </Badge>
                          <span className="text-xs text-gray-400">{project.date}</span>
                        </div>

                        <h3 className="text-sm font-bold mb-2 group-hover:text-white transition-colors">
                          {project.title}
                        </h3>

                        <div className="text-xs text-gray-400 mb-2">{project.type}</div>

                        <p className="text-xs text-gray-500 mb-3 line-clamp-2">{project.description}</p>

                        <div className="flex flex-wrap gap-1">
                          {project.tech.map((tech, techIndex) => (
                            <Badge
                              key={techIndex}
                              variant="secondary"
                              className="text-xs bg-gray-800 text-gray-400 px-1 py-0"
                            >
                              {tech}
                            </Badge>
                          ))}
                        </div>

                        <div className="mt-3 pt-3 border-t border-gray-800">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">FILE.SIZE: 2.4GB</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs text-gray-400 hover:text-white h-6 px-2"
                            >
                              OPEN →
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Window Footer */}
                <div className="mt-6 pt-4 border-t border-gray-700">
                  <div className="flex justify-between items-center text-xs text-gray-400">
                    <span>LAST.UPDATED: {currentTime}</span>
                    <span>MEMORY.USAGE: 847MB</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Sección Home */}
      <div id="home"></div>

      <style jsx>{`
        .glitch-text {
          animation: glitch 0.3s ease-in-out infinite alternate;
        }
        
        .font-bauhaus-pixel-test {
          font-family: var(--font-bauhaus-pixel), 'Impact', 'Arial Black', sans-serif;
        }
        
        @keyframes glitch {
          0% {
            text-shadow: 0.05em 0 0 #ffffff, -0.05em -0.025em 0 #000000, 0.025em 0.05em 0 #ffffff;
          }
          15% {
            text-shadow: 0.05em 0 0 #ffffff, -0.05em -0.025em 0 #000000, 0.025em 0.05em 0 #ffffff;
          }
          16% {
            text-shadow: -0.05em -0.025em 0 #ffffff, 0.025em 0.025em 0 #000000, -0.05em -0.05em 0 #ffffff;
          }
          49% {
            text-shadow: -0.05em -0.025em 0 #ffffff, 0.025em 0.025em 0 #000000, -0.05em -0.05em 0 #ffffff;
          }
          50% {
            text-shadow: 0.025em 0.05em 0 #ffffff, 0.05em 0 0 #000000, 0 -0.05em 0 #ffffff;
          }
          99% {
            text-shadow: 0.025em 0.05em 0 #ffffff, 0.05em 0 0 #000000, 0 -0.05em 0 #ffffff;
          }
          100% {
            text-shadow: -0.025em 0 0 #ffffff, -0.025em -0.025em 0 #000000, -0.025em -0.05em 0 #ffffff;
          }
        }
      `}</style>
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  )
}
