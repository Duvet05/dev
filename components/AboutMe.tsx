import React from "react";
import { Button } from "@/components/ui/button";
import { WindowHeader } from "./layout/WindowHeader";
import { ArrowRight } from "lucide-react";

interface AboutMeProps {
  currentTime: string;
}

export const AboutMe: React.FC<AboutMeProps> = ({ currentTime }) => (
  <div id="about" className="flex-[3] h-full self-stretch flex flex-col">
    <h2 className="text-4xl font-bauhaus-pixel leading-none mb-4">ABOUT.ME</h2>
    
    <WindowHeader title="ABOUT.ME.EXE" />

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
);
