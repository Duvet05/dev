import React, { useEffect, useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Cpu, MonitorSmartphone, MemoryStick, Torus, Calendar, Clock, Layers, HardDrive, Zap } from "lucide-react";
import { DonutAnimation } from "./DonutAnimation";

interface HeroSectionProps {
  glitchText: string;
  currentTime: string;
  cpuUsage: number;
  gpuUsage: number;
  ramUsage: number;
  renderingProgress: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ glitchText, currentTime, cpuUsage, gpuUsage, ramUsage, renderingProgress }) => {
  const STAR_SPEED_MULTIPLIER = 4;

  useEffect(() => {
    const dynamicStyles = `
      @keyframes pixel-float {
        0% {
          transform: translateY(0px) translateX(0px) rotate(0deg);
          opacity: 0.3;
        }
        25% {
          transform: translateY(-15px) translateX(8px) rotate(90deg);
          opacity: 1;
        }
        50% {
          transform: translateY(-8px) translateX(-5px) rotate(180deg);
          opacity: 0.7;
        }
        75% {
          transform: translateY(-20px) translateX(3px) rotate(270deg);
          opacity: 0.9;
        }
        100% {
          transform: translateY(0px) translateX(0px) rotate(360deg);
          opacity: 0.3;
        }
      }
      
      @keyframes twinkle {
        0%, 100% {
          opacity: 0.2;
          transform: scale(1);
          box-shadow: 0 0 0px rgba(255, 255, 255, 0.3);
        }
        50% {
          opacity: 1;
          transform: scale(1.5);
          box-shadow: 0 0 4px rgba(255, 255, 255, 0.8);
        }
      }
      
      @keyframes drift {
        0% {
          transform: translateX(0px) translateY(0px);
        }
        33% {
          transform: translateX(-10px) translateY(-5px);
        }
        66% {
          transform: translateX(5px) translateY(-10px);
        }
        100% {
          transform: translateX(0px) translateY(0px);
        }
      }
      
      .pixel-star {
        animation: pixel-float ${STAR_SPEED_MULTIPLIER * 5}s linear infinite, 
                  twinkle ${STAR_SPEED_MULTIPLIER * 2}s ease-in-out infinite, 
                  drift ${STAR_SPEED_MULTIPLIER * 25}s ease-in-out infinite;
        image-rendering: pixelated;
        border-radius: 0;
        box-shadow: 0 0 2px rgba(255, 255, 255, 0.5);
        filter: brightness(1.2);
      }
      
      .pixel-star:nth-child(3n) {
        animation-direction: reverse;
      }
      
      .pixel-star:nth-child(4n) {
        animation-delay: ${-2 * STAR_SPEED_MULTIPLIER}s;
      }
      
      .pixel-star:nth-child(5n) {
        filter: brightness(0.8) contrast(1.2);
      }
    `;

    // Remover estilos anteriores si existen
    const existingStyle = document.getElementById('pixel-stars-styles');
    if (existingStyle) {
      existingStyle.remove();
    }

    // Agregar nuevos estilos
    const styleSheet = document.createElement('style');
    styleSheet.id = 'pixel-stars-styles';
    styleSheet.textContent = dynamicStyles;
    document.head.appendChild(styleSheet);
  }, [STAR_SPEED_MULTIPLIER]);

  const [showTRexGame, setShowTRexGame] = useState(false);
  const [showEnterHint, setShowEnterHint] = useState(false);
  const [renderTime, setRenderTime] = useState(74);
  const [polyCount, setPolyCount] = useState(557);
  const [memUsage, setMemUsage] = useState(2.3);
  const [samples, setSamples] = useState(128);

  // Estados para viewports dinámicos
  const [cameraPos, setCameraPos] = useState({ x: 0.00, y: 2.15, z: 8.50 });
  const [lightIntensity, setLightIntensity] = useState(1.2);
  const [meshCount, setMeshCount] = useState(47);
  const [subdivLevel, setSubdivLevel] = useState(2);
  const [renderEngine, setRenderEngine] = useState('CYCLES');
  const [materialNodes, setMaterialNodes] = useState(23);
  // Simular cambios en los datos del proyecto
  useEffect(() => {
    const interval = setInterval(() => {
      setRenderTime(prev => prev + Math.floor(Math.random() * 3)); // Aumenta 0-2 min
      setPolyCount(prev => prev + Math.floor(Math.random() * 5 - 2)); // Varía ±2K
      setMemUsage(prev => Math.max(1.8, Math.min(3.2, prev + (Math.random() * 0.2 - 0.1)))); // Varía ±0.1GB
      setSamples(prev => {
        const changes = [128, 256, 512, 1024];
        return changes[Math.floor(Math.random() * changes.length)];
      });

      // Actualizar datos de viewports
      setCameraPos(prev => ({
        x: Math.max(-5, Math.min(5, prev.x + (Math.random() * 0.4 - 0.2))),
        y: Math.max(0, Math.min(5, prev.y + (Math.random() * 0.2 - 0.1))),
        z: Math.max(5, Math.min(15, prev.z + (Math.random() * 0.6 - 0.3)))
      }));

      setLightIntensity(prev => Math.max(0.5, Math.min(2.0, prev + (Math.random() * 0.2 - 0.1))));
      setMeshCount(prev => prev + Math.floor(Math.random() * 3 - 1)); // Varía ±1
      setSubdivLevel(prev => {
        const levels = [1, 2, 3, 4];
        return levels[Math.floor(Math.random() * levels.length)];
      });
      setRenderEngine(prev => {
        const engines = ['CYCLES', 'EEVEE', 'WORKBENCH'];
        return engines[Math.floor(Math.random() * engines.length)];
      });
      setMaterialNodes(prev => prev + Math.floor(Math.random() * 5 - 2)); // Varía ±2
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Detectar tecla SPACE para T-Rex game
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'Space' && !showTRexGame) {
        event.preventDefault();
        setShowTRexGame(true);
      }
      if (event.key === 'Escape' && showTRexGame) {
        setShowTRexGame(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showTRexGame]);

  // Evitar scroll con SPACE cuando el juego está activo
  useEffect(() => {
    const preventSpaceScroll = (e: KeyboardEvent) => {
      if (showTRexGame && e.code === 'Space') {
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', preventSpaceScroll, { passive: false });
    return () => window.removeEventListener('keydown', preventSpaceScroll);
  }, [showTRexGame]);

  // Mostrar hint después de 3 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowEnterHint(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    // Mantener la sección hero con una altura mínima consistente para evitar compresión en móviles
    <div className="relative mb-4 min-h-[520px] md:min-h-[520px] lg:min-h-[480px]">
      <div className="grid grid-cols-12">
        <div className="col-span-12 lg:col-span-8">

          <div className="relative bg-primary border border-secondary overflow-hidden h-full border-b-0 lg:border-b">

            {/* Contenido central */}
            {/* Añadir padding vertical para evitar que el texto se comprima en alturas pequeñas */}
            <div className="absolute inset-0 flex items-center justify-center w-full">

              {/* Renderizar el juego T-Rex cuando esté activo */}
              {showTRexGame ? (
                <div className="w-full h-full" style={{ zIndex: 50, position: 'relative' }}>
                  <div className="absolute top-3 right-5">Copyright (c) 2014 The Chromium Authors. All rights reserved.</div>
                  <iframe
                    ref={el => {
                      if (el) {
                        // Darle foco al iframe para que reciba teclas
                        el.focus();
                        // Espera a que el iframe cargue y luego simula SPACE
                        el.onload = () => {
                          setTimeout(() => {
                            el.focus();
                            if (el.contentWindow) {
                              // @ts-ignore
                              const evt = new el.contentWindow.KeyboardEvent('keydown', { keyCode: 32, code: 'Space', key: ' ', bubbles: true });
                              el.contentWindow.document.dispatchEvent(evt);
                            }
                          }, 200);
                        };
                      }
                    }}
                    src="/dino/index.html"
                    style={{ width: '100%', height: 400, border: 'none', outline: 'none' }}
                    tabIndex={0}
                    allowFullScreen
                    title="Chrome Dino Game"
                  />
                </div>
              ) : (
                <div className="text-center max-w-full w-full">
                  {/*<h1 className="text-6xl font-bold glitch-text font-bauhaus-pixel">{glitchText}</h1>*/}
                  {/* Evitar márgenes negativos en pantallas pequeñas; aplicarlos solo desde md en adelante */}
                  <h1 className="text-6xl lg:text-7xl xl:text-8xl font-bauhaus-pixel mb-0 md:mb-[-12px] lg:mb-[-12px] xl:mb-[-12px] leading-none overflow-hidden">{glitchText}</h1>
                  <p className="text-sm sm:text-lg md:text-xl lg:text-2xl text-gray-400 mb-3 sm:mb-6">3D.ARTIST.DEVELOPER</p>
                  <div className="flex justify-center space-x-1 sm:space-x-4 flex-wrap gap-y-1">
                    <Badge variant="outline" className="text-xs border-white text-white rounded-none whitespace-nowrap">
                      ONLINE
                    </Badge>
                    <Badge variant="outline" className="text-xs border-gray-600 text-gray-400 rounded-none whitespace-nowrap">
                      GMT-6 {currentTime}
                    </Badge>
                  </div>

                  {/* Botón de hint para activar T-Rex Game: visible desde el inicio, cambia de estado tras 3s */}
                  <div
                    className="mt-4 flex justify-center hidden md:flex"
                    style={{ cursor: 'pointer', zIndex: 20, position: 'relative' }}
                    onClick={() => setShowTRexGame(true)}
                  >
                    <Badge
                      variant="outline"
                      className={`text-xs rounded-none cursor-pointer transition-colors border-1 ${showEnterHint ? 'border-green-500 text-green-500 hover:bg-green-500/10' : 'border-yellow-400 text-yellow-400 bg-yellow-400/10 animate-pulse'}`}
                      tabIndex={0}
                      onClick={() => setShowTRexGame(true)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setShowTRexGame(true);
                        }
                      }}
                      role="button"
                      aria-label="Iniciar juego T-Rex"
                    >
                      {showEnterHint ? (
                        <>
                          <span className="hidden sm:inline">PRESS SPACE TO PLAY T-REX</span>
                          <span className="sm:hidden">TAP TO PLAY T-REX</span>
                        </>
                      ) : (
                        <span>LOADING...</span>
                      )}
                    </Badge>
                  </div>
                </div>
              )}
            </div>

            {/* Grid pattern de fondo completo */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255, 255, 255, 0.2) 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px',
                pointerEvents: 'none',
                zIndex: 0
              }}
            />

            {/* Estrellas animadas de fondo */}
            <div className="absolute inset-0 overflow-hidden" style={{ pointerEvents: 'none', zIndex: 0 }}>
              {/* Estrellas pequeñas rápidas */}
              {[...Array(30)].map((_, i) => (
                <div
                  key={`small-${i}`}
                  className="absolute bg-white pixel-star"
                  style={{
                    width: '1px',
                    height: '1px',
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 5 * STAR_SPEED_MULTIPLIER}s`,
                    animationDuration: `${(2 + Math.random() * 3) * STAR_SPEED_MULTIPLIER}s`,
                    opacity: 0.4 + Math.random() * 0.6
                  }}
                ></div>
              ))}

              {/* Estrellas medianas */}
              {[...Array(20)].map((_, i) => (
                <div
                  key={`medium-${i}`}
                  className="absolute bg-white pixel-star"
                  style={{
                    width: '2px',
                    height: '2px',
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 8 * STAR_SPEED_MULTIPLIER}s`,
                    animationDuration: `${(4 + Math.random() * 4) * STAR_SPEED_MULTIPLIER}s`,
                    opacity: 0.3 + Math.random() * 0.7
                  }}
                ></div>
              ))}

              {/* Estrellas grandes lentas */}
              {[...Array(10)].map((_, i) => (
                <div
                  key={`large-${i}`}
                  className="absolute bg-white pixel-star"
                  style={{
                    width: '3px',
                    height: '3px',
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 10 * STAR_SPEED_MULTIPLIER}s`,
                    animationDuration: `${(6 + Math.random() * 6) * STAR_SPEED_MULTIPLIER}s`,
                    opacity: 0.2 + Math.random() * 0.5
                  }}
                ></div>
              ))}

              {/* Estrellas de colores cyberpunk */}
              {[...Array(8)].map((_, i) => {
                const color = '#fffff';
                return (
                  <div
                    key={`colored-${i}`}
                    className="absolute pixel-star"
                    style={{
                      width: '2px',
                      height: '2px',
                      backgroundColor: color,
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 15 * STAR_SPEED_MULTIPLIER}s`,
                      animationDuration: `${(8 + Math.random() * 8) * STAR_SPEED_MULTIPLIER}s`,
                      opacity: 0.1 + Math.random() * 0.3
                    }}
                  ></div>
                );
              })}

              {/* Partículas de polvo espacial */}
              {[...Array(15)].map((_, i) => (
                <div
                  key={`dust-${i}`}
                  className="absolute bg-gray-300 pixel-star"
                  style={{
                    width: '1px',
                    height: '1px',
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 12 * STAR_SPEED_MULTIPLIER}s`,
                    animationDuration: `${(8 + Math.random() * 8) * STAR_SPEED_MULTIPLIER}s`,
                    opacity: 0.1 + Math.random() * 0.3
                  }}
                ></div>
              ))}
            </div>

            {/* Estrellas pixel art moviéndose */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white opacity-70"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animation: `pixelStar ${(3 + Math.random() * 4) * STAR_SPEED_MULTIPLIER}s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 3 * STAR_SPEED_MULTIPLIER}s`
                  }}
                />
              ))}
              {[...Array(8)].map((_, i) => (
                <div
                  key={`star-${i}`}
                  className="absolute w-0.5 h-0.5 bg-secondary opacity-80"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animation: `pixelStar ${(2 + Math.random() * 3) * STAR_SPEED_MULTIPLIER}s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 2 * STAR_SPEED_MULTIPLIER}s`
                  }}
                />
              ))}
              {[...Array(6)].map((_, i) => (
                <div
                  key={`twinkle-${i}`}
                  className="absolute w-1.5 h-1.5 bg-secondary opacity-60"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animation: `pixelStar ${(4 + Math.random() * 2) * STAR_SPEED_MULTIPLIER}s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 4 * STAR_SPEED_MULTIPLIER}s`
                  }}
                />
              ))}
            </div>

            {/* Panel de Fondo */}
            {/* usar flex-1 y min-height interno para que el contenido central pueda centrar correctamente */}
            <div className="p-2 flex-1 flex flex-col min-h-[360px] md:min-h-[420px] lg:min-h-full">
              <div className="flex-1 border border-gray-600 relative overflow-hidden">
                {/* Scanning line */}
                <div className="absolute left-0 right-0 h-0.5 bg-secondary/30"
                  style={{ animation: 'scanLine 3s linear infinite' }}></div>

                {/* Viewports en las esquinas - se ocultan cuando el juego está activo */}
                {!showTRexGame && (
                  <>
                    {/* Arriba Izquierda - CAMERA.POS */}
                    <div className="absolute top-3 left-4 text-xs text-gray-400 font-vt323">
                      <div className="text-xs text-secondary mb-1 font-vt323">CAMERA.POS</div>
                      <div>X: {cameraPos.x.toFixed(2)}</div>
                      <div>Y: {cameraPos.y.toFixed(2)}</div>
                      <div>Z: {cameraPos.z.toFixed(2)}</div>
                    </div>

                    {/* Arriba Derecha - LIGHTING */}
                    <div className="absolute top-3 right-4 text-xs text-gray-400 font-vt323 text-right">
                      <div className="text-xs text-secondary mb-1 font-vt323">LIGHTING</div>
                      <div>INT: {lightIntensity.toFixed(1)}</div>
                      <div>ENG: {renderEngine}</div>
                      <div>NOD: {materialNodes}</div>
                    </div>

                    {/* Abajo Izquierda - GEOMETRY */}
                    <div className="absolute bottom-16 left-4 text-xs text-gray-400 font-vt323">
                      <div className="text-xs text-secondary mb-1 font-vt323">GEOMETRY</div>
                      <div>MSH: {meshCount}</div>
                      <div>SUB: {subdivLevel}</div>
                      <div>TRI: {(polyCount * 2).toFixed(0)}K</div>
                    </div>

                    {/* Abajo Derecha - RENDER.OUT */}
                    <div className="absolute bottom-16 right-4 text-xs text-gray-400 font-vt323 text-right">
                      <div className="text-xs text-secondary mb-1 font-vt323">RENDER.OUT</div>
                      <div>RES: 1920x1080</div>
                      <div>FMT: PNG</div>
                      <div>BIT: 32</div>
                    </div>
                    {/* Corner brackets */}
                    <div className="absolute top-1 left-1 w-3 h-3 border-t border-l border-secondary"></div>
                    <div className="absolute top-1 right-1 w-3 h-3 border-t border-r border-secondary"></div>
                    <div className="absolute bottom-1 left-1 w-3 h-3 border-b border-l border-secondary"></div>
                    <div className="absolute bottom-1 right-1 w-3 h-3 border-b border-r border-secondary"></div>
                  </>
                )}
              </div>
            </div>

            <div className="p-2 absolute bottom-3.5 left-4 right-4">
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
        <div className="col-span-12 lg:col-span-4 border-l lg:border-l-0 border-t border-b border-r border-secondary">          <div className="text-secondary bg-primary border-b border-secondary p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">SYSTEM.STATUS</span>
            <div className="w-2 h-2 bg-green-500 animate-pulse"></div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2"><Cpu className="w-4 h-4 text-secondary" />CPU</span>
              <span className="text-white">{cpuUsage}%</span>
            </div>
            <div className="w-full bg-secondary h-1 mb-2">
              <div className="bg-green-500 h-1" style={{ width: `${cpuUsage}%` }}></div>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2"><MonitorSmartphone className="w-4 h-4 text-secondary" />GPU</span>
              <span className="text-white">{gpuUsage}%</span>
            </div>
            <div className="w-full bg-secondary h-1 mb-2">
              <div className="bg-blue-500 h-1" style={{ width: `${gpuUsage}%` }}></div>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2"><MemoryStick className="w-4 h-4 text-secondary" />RAM</span>
              <span className="text-white">{ramUsage}GB</span>
            </div>
            <div className="w-full bg-secondary h-1">
              <div className="bg-yellow-500 h-1" style={{ width: `${(ramUsage / 64) * 100}%` }}></div>
            </div>
          </div>
        </div>
          <div className="bg-primary flex">
            <div className="flex-1 p-4">
              <div className="text-sm text-gray-400 mb-2">CURRENT.PROJECT</div>
              <div className="flex items-center gap-2 text-base text-white mb-3">
                <Torus className="w-5 h-5 text-secondary" />
                GURU_TORUS.BLEND
              </div>

              <div className="text-sm text-gray-400 mb-2">RENDERING... {renderingProgress}%</div>
              <div className="w-full bg-secondary h-1 mb-4">
                <div className="bg-purple-500 h-1" style={{ width: `${renderingProgress}%` }}></div>
              </div>

              <div className="space-y-2 text-xs text-gray-400">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-secondary" />
                    DATE:
                  </span>
                  <span className="text-white">2025.07.28</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-secondary" />
                    RENDER.TIME:
                  </span>
                  <span className="text-white">{renderTime}min</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1">
                    <Layers className="w-3 h-3 text-secondary" />
                    POLY.COUNT:
                  </span>
                  <span className="text-white">{polyCount}K</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1">
                    <HardDrive className="w-3 h-3 text-secondary" />
                    VRAM.USAGE:
                  </span>
                  <span className="text-white">{memUsage.toFixed(1)}GB</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-secondary" />
                    SAMPLES:
                  </span>
                  <span className="text-white">{samples}</span>
                </div>
              </div>
            </div>
            <div className="donut-hide-1115 hidden lg:flex border-l border-secondary flex-col justify-start min-w-fit">
              <div className="text-sm text-gray-400 mb-2 px-4 pt-4">ASCII.DONUT.PREVIEW</div>
              <div className="px-8 pb-4">
                <DonutAnimation width={20} height={20} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* T-Rex Game se renderiza directamente en el área central */}

      {/* Styles for animations */}
      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes scanLine {
          0% { 
            top: 0%; 
            opacity: 0.6;
          }
          50% { 
            opacity: 1;
          }
          100% { 
            top: 100%; 
            opacity: 0.6;
          }
        }
        
        @keyframes pixelStar {
          0% { 
            opacity: 0.2;
            transform: scale(0.5);
          }
          25% { 
            opacity: 0.8;
            transform: scale(1);
          }
          50% { 
            opacity: 1;
            transform: scale(1.2);
          }
          75% { 
            opacity: 0.6;
            transform: scale(0.8);
          }
          100% { 
            opacity: 0.2;
            transform: scale(0.5);
          }
        }

        @media (max-width: 1115px) {
          .donut-hide-1115 { display: none !important; }
        }
      `}</style>
    </div>
  );
};
