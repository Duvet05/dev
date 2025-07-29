"use client"

import { useState, useEffect, useRef } from "react"
import { BrowserHeader } from "@/components/BrowserHeader"
import { MainContent } from "@/components/MainContent"
import { BrowserFrame } from "@/components/layout/BrowserFrame"

export default function CyberpunkPortfolio() {
  const [currentTime, setCurrentTime] = useState("")
  const [glitchText, setGlitchText] = useState("CUADOT")
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [playerState, setPlayerState] = useState("STOPPED")
  const [volume, setVolume] = useState(8) // 0-8
  const [isMuted, setIsMuted] = useState(false)
  const [volumeBeforeMute, setVolumeBeforeMute] = useState(8)

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
      
      // Si está en estado PLAYING, reproducir automáticamente la nueva pista
      if (playerState === "PLAYING") {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.log("Error al reproducir automáticamente:", error);
            setIsPlaying(false);
            setPlayerState("STOPPED");
          });
        }
      } else {
        setIsPlaying(false);
        setPlayerState("STOPPED");
      }
    }
  }, [currentTrack, tracks, playerState]);

  // Control de volumen
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 8;
    }
  }, [volume, isMuted]);

  // Función para silenciar/reactivar audio
  const toggleMute = () => {
    if (isMuted) {
      // Reactivar sonido
      setIsMuted(false);
      setVolume(volumeBeforeMute);
    } else {
      // Silenciar
      setVolumeBeforeMute(volume);
      setIsMuted(true);
    }
  };

  // Función para cambiar volumen (desactiva mute si está activo)
  const handleSetVolume = (newVolume: number) => {
    if (isMuted) {
      setIsMuted(false);
    }
    setVolume(newVolume);
  };

  // Cuando termina la canción
  const handleEnded = () => {
    if (tracks.length === 0) return;
    
    // Cambiar a la siguiente pista
    let next = currentTrack + 1;
    if (next >= tracks.length) next = 0;
    
    // Actualizar el estado inmediatamente
    setCurrentTrack(next);
    setIsPlaying(true);
    setPlayerState("PLAYING");
  };

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
          <MainContent
            glitchText={glitchText}
            currentTime={currentTime}
            cpuUsage={cpuUsage}
            gpuUsage={gpuUsage}
            ramUsage={ramUsage}
            renderingProgress={renderingProgress}
            projects={projects}
          />
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
      
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  )
}
