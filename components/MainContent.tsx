import React from "react";
import { HeroSection } from "@/components/HeroSection";
import { AboutMe } from "@/components/AboutMe";
import { Stack } from "@/components/Stack";
import { Projects } from "@/components/Projects";
import { Skills } from "@/components/Skills";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/layout/Footer";
import { WindowHeader } from "@/components/layout/WindowHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface MainContentProps {
  glitchText: string;
  currentTime: string;
  cpuUsage: number;
  gpuUsage: number;
  ramUsage: number;
  renderingProgress: number;
  projects: any[];
  showProjectsWindow: boolean;
  setShowProjectsWindow: (show: boolean) => void;
  windowPosition: { x: number; y: number };
  handleMouseDown: (e: React.MouseEvent) => void;
}

export const MainContent: React.FC<MainContentProps> = ({
  glitchText,
  currentTime,
  cpuUsage,
  gpuUsage,
  ramUsage,
  renderingProgress,
  projects,
  showProjectsWindow,
  setShowProjectsWindow,
  windowPosition,
  handleMouseDown,
}) => (
  <div className="p-8">
    <HeroSection
      glitchText={glitchText}
      currentTime={currentTime}
      cpuUsage={cpuUsage}
      gpuUsage={gpuUsage}
      ramUsage={ramUsage}
      renderingProgress={renderingProgress}
    />
    <div className="flex flex-col md:flex-row mb-12 gap-8 items-stretch h-full md:justify-between">
      <AboutMe currentTime={currentTime} />
      <Stack />
    </div>
    <Projects projects={projects} onViewAll={() => setShowProjectsWindow(true)} />
    <Skills />
    <Contact currentTime={currentTime} />
    <Footer currentTime={currentTime} />
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
          <WindowHeader
            title="PROJECTS.ARCHIVE.EXE"
            draggable
            onMouseDown={handleMouseDown}
            onClose={() => setShowProjectsWindow(false)}
          />
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
                      {project.tech.map((tech: string, techIndex: number) => (
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
);
