import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Cpu, MonitorSmartphone, MemoryStick, Torus } from "lucide-react";
import { DonutAnimation } from "./DonutAnimation";
import { TetrisGame } from "./TetrisGame";

interface HeroSectionProps {
  glitchText: string;
  currentTime: string;
  cpuUsage: number;
  gpuUsage: number;
  ramUsage: number;
  renderingProgress: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ glitchText, currentTime, cpuUsage, gpuUsage, ramUsage, renderingProgress }) => {
  const [showTetris, setShowTetris] = useState(false);
  const [showEnterHint, setShowEnterHint] = useState(false);
  const [renderTime, setRenderTime] = useState(74);
  const [polyCount, setPolyCount] = useState(557);
  const [memUsage, setMemUsage] = useState(2.3);
  const [samples, setSamples] = useState(128);

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
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  // Detectar tecla Enter
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && !showTetris) {
        setShowTetris(true);
      }
      if (event.key === 'Escape' && showTetris) {
        setShowTetris(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showTetris]);

  // Mostrar hint después de 3 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowEnterHint(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative mb-12">
      <div className="grid grid-cols-12 mb-8">
        <div className="col-span-12 lg:col-span-8">
          <div className="relative h-full bg-primary border border-secondary overflow-hidden">
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
                
                {/* Hint para activar Tetris */}
                {showEnterHint && (
                  <div className="mt-4 animate-pulse">
                    <Badge variant="outline" className="text-xs border-green-500 text-green-500 rounded-none">
                      PRESS ENTER TO PLAY TETRIS
                    </Badge>
                  </div>
                )}
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
                <div className="flex justify-between">
                  <span>DATE:</span>
                  <span className="text-white">2025.07.28</span>
                </div>
                <div className="flex justify-between">
                  <span>RENDER.TIME:</span>
                  <span className="text-white">{renderTime}min</span>
                </div>
                <div className="flex justify-between">
                  <span>POLY.COUNT:</span>
                  <span className="text-white">{polyCount}K</span>
                </div>
                <div className="flex justify-between">
                  <span>VRAM.USAGE:</span>
                  <span className="text-white">{memUsage.toFixed(1)}GB</span>
                </div>
                <div className="flex justify-between">
                  <span>SAMPLES:</span>
                  <span className="text-white">{samples}</span>
                </div>
              </div>
            </div>
            <div className="border-l border-secondary flex flex-col justify-start min-w-fit">
              <div className="text-sm text-gray-400 mb-2 px-4 pt-4">ASCII.DONUT.PREVIEW</div>
              <div className="px-8 pb-4">
                <DonutAnimation width={20} height={20} />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tetris Game Modal */}
      {showTetris && (
        <TetrisGame onClose={() => setShowTetris(false)} />
      )}
    </div>
  );
};
