import React from "react";
import { FaStepBackward, FaStepForward, FaPlay, FaPause, FaVolumeUp } from "react-icons/fa";

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
}) => (
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
            className={`w-6 h-6 flex items-center justify-center bg-secondary text-black hover:bg-white hover:text-black transition-colors rounded-none border border-gray-600`}
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
);