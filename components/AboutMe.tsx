import React from "react";
import { Button } from "@/components/ui/button";
import { WindowHeader } from "./layout/WindowHeader";
import { ArrowRight } from "lucide-react";

interface AboutMeProps {
  currentTime: string;
}

export const AboutMe: React.FC<AboutMeProps> = () => (
  <div id="about" className="flex-1 min-w-0 flex flex-col">
    <h2 className="text-4xl font-bauhaus-pixel leading-none mb-4">ABOUT.ME</h2>
    
    <WindowHeader title="ABOUT.ME.EXE" />

    <div className="flex flex-col lg:flex-row flex-1 min-h-0">
      {/* Contenedor de imagen - tamaño fijo */}
      <div className="border-l border-t border-r border-secondary bg-primary p-6 text-white text-lg font-vt323 flex items-center justify-center lg:flex-shrink-0 lg:border-b lg:border-r-0">
        <img
          src="/images/dithered-image.png"
          alt="Cuadot Profile"
          className="w-[196px] h-[196px] object-cover rounded-lg aspect-square"
        />
      </div>
      
      {/* Contenedor de texto - flexible */}
      <div className="bg-primary border border-secondary p-4 lg:p-6 text-white font-vt323 flex-1 min-w-0 flex items-center">
        <div className="w-full min-w-0">
          <div className="flex flex-row items-center justify-between mb-4 gap-2">
            <h3 className="text-lg sm:text-xl font-bold font-bauhaus flex items-center min-w-0">
              <span className="truncate">VICTOR.CUADOT.ESQUEDA</span>
              <span className="hidden sm:flex flex-1 ml-2 text-secondary overflow-hidden" style={{ letterSpacing: '2px' }}>
                {'/'.repeat(20)}
              </span>
            </h3>
            <a href="/cv.pdf" download className="flex-shrink-0">
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-black bg-transparent rounded-none cursor-pointer text-sm lg:text-base"
              >
                DOWNLOAD.CV <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </div>
          <p className="text-sm lg:text-lg leading-relaxed">
            I&apos;m Cuadot, a 3D artist with a strong background in digital art and technology. I studied and taught at UNIAT, where I discovered my passion for sharing knowledge and pushing creative boundaries. My journey includes freelance work and collaborations with leading companies in the industry, contributing to projects for games, film, and advertising. I specialize in advanced visualization, procedural environments, and interactive experiences, always blending technical mastery with artistic vision. I love exploring new tools and trends, and I&apos;m always open to new challenges, collaborations, and freelance opportunities in the digital and creative world.
          </p>
        </div>
      </div>
    </div>
  </div>
);
