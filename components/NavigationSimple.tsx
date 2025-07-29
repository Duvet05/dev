"use client"

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export const NavigationSimple: React.FC = () => {
  const pathname = usePathname();

  const handleNavigation = (targetId: string) => {
    if (pathname === '/') {
      // En la página principal, hacer scroll a la sección
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // En otra página, navegar a la página principal con el hash
      window.location.href = `/#${targetId}`;
    }
  };

  return (
    <div className="bg-black border-b border-secondary">
      <div className="flex items-center justify-between px-4 py-2">
        {/* Menu de navegación */}
        <div className="flex items-center space-x-6">
          <Link 
            href="/"
            className="text-white hover:text-green-400 font-mono text-sm transition-colors cursor-pointer"
          >
            HOME
          </Link>
          
          <button
            onClick={() => handleNavigation('about')}
            className="text-white hover:text-green-400 font-mono text-sm transition-colors cursor-pointer"
          >
            ABOUT.ME
          </button>
          
          <Link 
            href="/projects"
            className="text-white hover:text-green-400 font-mono text-sm transition-colors cursor-pointer animate-pulse bg-green-400 text-black px-2 py-1 rounded-none"
          >
            PROJECTS
          </Link>
          
          <button
            onClick={() => handleNavigation('brands')}
            className="text-white hover:text-green-400 font-mono text-sm transition-colors cursor-pointer"
          >
            BRANDS
          </button>
        </div>

        {/* Reproductor de música simplificado para mobile */}
        <div className="text-xs font-mono text-gray-400">
          MUSIC.PLAYER.DISABLED
        </div>
      </div>
    </div>
  );
};
