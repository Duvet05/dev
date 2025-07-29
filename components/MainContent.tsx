import React from "react";
import { HeroSection } from "@/components/HeroSection";
import { AboutMe } from "@/components/AboutMe";
import { Stack } from "@/components/Stack";
import { Projects } from "@/components/Projects";
import { Skills } from "@/components/Skills";
import { Brands } from "@/components/Brands";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/layout/Footer";

interface MainContentProps {
  glitchText: string;
  currentTime: string;
  cpuUsage: number;
  gpuUsage: number;
  ramUsage: number;
  renderingProgress: number;
  projects: any[];
}

export const MainContent: React.FC<MainContentProps> = ({
  glitchText,
  currentTime,
  cpuUsage,
  gpuUsage,
  ramUsage,
  renderingProgress,
  projects,
}) => (
  <div className="p-8">
    <div id="home">
      <HeroSection
        glitchText={glitchText}
        currentTime={currentTime}
        cpuUsage={cpuUsage}
        gpuUsage={gpuUsage}
        ramUsage={ramUsage}
        renderingProgress={renderingProgress}
      />
    </div>
    <div className="flex flex-col md:flex-row mb-12 gap-8 items-stretch h-full md:justify-between">
      <div id="about">
        <AboutMe currentTime={currentTime} />
      </div>
      <div id="stack">
        <Stack />
      </div>
    </div>
    <div id="projects">
      <Projects projects={projects} />
    </div>
    <div id="skills">
      <Skills />
    </div>
    <div id="brands">
      <Brands />
    </div>
    <div id="contact">
      <Contact currentTime={currentTime} />
    </div>
    <Footer currentTime={currentTime} />
  </div>
);
