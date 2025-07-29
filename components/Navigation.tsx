import React, { useEffect } from "react";
import { FaStepBackward, FaStepForward, FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface NavigationProps {
  tracks: { name: string; src: string }[];
  currentTrack: number;
  isPlaying: boolean;
  playerState: string;
  volume: number;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  handlePrev: () => void;
  handlePlayPause: () => void;
  handleNext: () => void;
  setVolume: (v: number) => void;
  handleEnded: () => void;
  toggleMute: () => void;
  isMuted: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  tracks,
  currentTrack,
  isPlaying,
  playerState,
  volume,
  audioRef,
  handlePrev,
  handlePlayPause,
  handleNext,
  setVolume,
  handleEnded,
  toggleMute,
  isMuted,
}) => {
  const pathname = usePathname();
  const isProjectsPage = pathname === '/projects';

  // Función para manejar la navegación
  const handleNavigation = (section: string) => {
    if (isProjectsPage) {
      // Si estamos en /projects, navegar a la página principal con el anchor
      window.location.href = `/#${section}`;
    } else {
      // Si estamos en la página principal, hacer scroll suave a la sección con offset
      const element = document.getElementById(section);
      if (element) {
        const headerHeight = 150; // Altura aproximada del header sticky
        const elementPosition = element.offsetTop - headerHeight;
        window.scrollTo({
          top: elementPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  const handleProjectsNavigation = () => {
    if (isProjectsPage) {
      // Si ya estamos en projects, ir a la sección projects de la página principal
      window.location.href = '/#projects';
    } else {
      // Si estamos en la página principal, ir a /projects
      window.location.href = '/projects';
    }
  };

  // useEffect para manejar anchors al cargar la página
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      // Esperar un poco para que el DOM esté listo
      setTimeout(() => {
        const section = hash.replace("#", "");
        const element = document.getElementById(section);
        if (element) {
          const headerHeight = 150; // Altura aproximada del header sticky
          const elementPosition = element.offsetTop - headerHeight;
          window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
          });
        }
      }, 200); // Aumentar el delay para dar más tiempo al DOM
    }
  }, [pathname]); // Cambiar la dependencia para que se ejecute cuando cambie la ruta

  return (
    <div className="bg-primary border-b border-secondary py-2 px-4">
      <div className="flex justify-between items-center">
        {/* Navegación completa en desktop */}
        <div className="hidden md:flex space-x-8 text-base">
          <button onClick={() => handleNavigation('home')} className="text-gray-400 hover:text-white hover:underline cursor-pointer bg-transparent border-none transition-colors">HOME</button>
          <button onClick={() => handleNavigation('about')} className="text-gray-400 hover:text-white hover:underline cursor-pointer bg-transparent border-none transition-colors">ABOUT.ME</button>
          <button onClick={() => handleNavigation('stack')} className="text-gray-400 hover:text-white hover:underline cursor-pointer bg-transparent border-none transition-colors">STACK</button>
          <button onClick={handleProjectsNavigation} className="text-gray-400 hover:text-white hover:underline cursor-pointer bg-transparent border-none animate-pulse-green transition-colors">PROJECTS</button>
          <button onClick={() => handleNavigation('skills')} className="text-gray-400 hover:text-white hover:underline cursor-pointer bg-transparent border-none transition-colors">SKILLS</button>
          <button onClick={() => handleNavigation('brands')} className="text-gray-400 hover:text-white hover:underline cursor-pointer bg-transparent border-none transition-colors">BRANDS</button>
          <button onClick={() => handleNavigation('contact')} className="text-gray-400 hover:text-white hover:underline cursor-pointer bg-transparent border-none transition-colors">CONTACT</button>
        </div>
        
        {/* Navegación simplificada en mobile */}
        <div className="flex md:hidden space-x-4 text-base">
          <button onClick={() => handleNavigation('home')} className="text-gray-400 hover:text-white hover:underline cursor-pointer bg-transparent border-none transition-colors">HOME</button>
          <button onClick={handleProjectsNavigation} className="text-gray-400 hover:text-white hover:underline cursor-pointer bg-transparent border-none animate-pulse-green transition-colors">PROJECTS</button>
        </div>
        
        {/* Mini reproductor de música funcional estilo terminal/pixel art */}
        <div className="flex items-center space-x-3 md:space-x-3 space-x-1 rounded-none font-vt323 text-white min-w-[260px] md:min-w-[260px] min-w-[120px] bg-black">
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
        <div className="flex items-center ml-2 md:ml-2 ml-1 min-w-0">
          <span
            className="text-xs text-gray-400 truncate max-w-[120px] md:max-w-[120px] max-w-[40px]"
            title={tracks.length > 0 ? tracks[currentTrack]?.name : "No music"}
          >
            {tracks.length > 0 ? tracks[currentTrack]?.name : "No music"}
          </span>
          <span
            className={`text-xs hidden md:inline ${playerState === "PLAYING" ? "text-green-500" : "text-gray-400"}`}
          >
            [{playerState}]
          </span>
        </div>
        {/* Controles con iconos sólidos de react-icons/fa */}
        <div className="flex items-center space-x-1 md:space-x-1 space-x-0">
          <button
            className="w-6 h-6 flex items-center justify-center bg-secondary text-black hover:bg-white hover:text-black transition-colors rounded-none border border-gray-600 cursor-pointer"
            onClick={handlePrev}
            aria-label="Anterior"
            disabled={tracks.length === 0}
          >
            <FaStepBackward className="w-3 h-3" />
          </button>
          <button
            className={`w-6 h-6 flex items-center justify-center bg-secondary text-black hover:bg-white hover:text-black transition-colors rounded-none border border-gray-600 cursor-pointer`}
            onClick={handlePlayPause}
            aria-label={isPlaying ? "Pausar" : "Reproducir"}
            disabled={tracks.length === 0}
          >
            {isPlaying ? <FaPause className="w-3 h-3" /> : <FaPlay className="w-3 h-3" />}
          </button>
          <button
            className="w-6 h-6 flex items-center justify-center bg-secondary text-black hover:bg-white hover:text-black transition-colors rounded-none border border-gray-600 cursor-pointer"
            onClick={handleNext}
            aria-label="Siguiente"
            disabled={tracks.length === 0}
          >
            <FaStepForward className="w-3 h-3" />
          </button>
        </div>
        {/* Volumen tipo cuadritos + icono - Solo en desktop */}
        <div className="hidden md:flex items-center ml-2">
          <button
            onClick={toggleMute}
            className="mr-1 hover:opacity-80 transition-opacity cursor-pointer"
            aria-label={isMuted ? "Activar sonido" : "Silenciar"}
          >
            {isMuted ? (
              <FaVolumeMute className="w-4 h-4 text-red-400" />
            ) : (
              <FaVolumeUp className="w-4 h-4 text-gray-400" />
            )}
          </button>
          {[...Array(8)].map((_, i) => (
            <button
              key={i}
              className={`w-4 h-4 border border-gray-600 mx-[1px] cursor-pointer ${
                isMuted 
                  ? "bg-red-900 opacity-50" 
                  : i < volume 
                    ? "bg-white" 
                    : "bg-black"
              }`}
              style={{ 
                boxShadow: !isMuted && i < volume ? "0 0 1px #fff" : "none" 
              }}
              onClick={() => !isMuted && setVolume(i + 1)}
              aria-label={`Volumen ${((i + 1) * 12.5).toFixed(0)}%`}
              disabled={isMuted}
            ></button>
          ))}
        </div>
      </div>
      </div>
      
      <style jsx>{`
        @keyframes pulse-green {
          0%, 100% {
            color: rgb(34, 197, 94); /* text-gray-400 */
          }
          50% {
            color: rgb(34, 197, 94); /* text-green-500 */
            text-shadow: 0 0 5px rgb(34, 197, 94);
          }
        }
        
        .animate-pulse-green {
          animation: pulse-green 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};