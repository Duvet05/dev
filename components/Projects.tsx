import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { SiBlender, SiAutodesk, SiAdobephotoshop, SiUnity, SiUnrealengine, SiWebgl, SiAdobe, SiFigma, SiCss3, SiHoudini, SiMarvelapp } from "react-icons/si";
import { TbBrandThreejs } from "react-icons/tb";
import { FaPaintBrush } from "react-icons/fa";
import { IconType } from "react-icons";

// Mapeo de tecnologías a iconos
const techIcons: Record<string, IconType> = {
  BLENDER: SiBlender,
  MAYA: SiAutodesk,
  ZBRUSH: FaPaintBrush,
  SUBSTANCE: SiAdobe,
  PHOTOSHOP: SiAdobephotoshop,
  UNITY: SiUnity,
  UNREAL: SiUnrealengine,
  WEBGL: SiWebgl,
  MARVELOUS: SiMarvelapp,
  HOUDINI: SiHoudini,
  FIGMA: SiFigma,
  "AFTER.EFFECTS": SiAdobe,
  CSS: SiCss3,
  "THREE.JS": TbBrandThreejs,
  GLSL: SiWebgl,
};

interface Project {
  title: string;
  type: string;
  status: string;
  description: string;
  tech: string[];
  date: string;
}

interface ProjectsProps {
  projects: Project[];
  onViewAll: () => void;
}

export const Projects: React.FC<ProjectsProps> = ({ projects, onViewAll }) => (
  <div id="projects" className="mb-12">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-4xl font-bauhaus-pixel leading-none">PROJECTS</h2>
      <Button
        variant="outline"
        className="border-white text-white hover:bg-white hover:text-black bg-transparent rounded-none"
        onClick={onViewAll}
      >
        VIEW.ALL <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>

    <div className="border-r border-b border-secondary grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, index) => (
        <div
          key={index}
          className="bg-primary border-t border-l border-secondary hover:border-white transition-colors group"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Badge
                variant="outline"
                className={`text-sm rounded-none ${project.status === "ACTIVE"
                  ? "border-green-500 text-green-500"
                  : project.status === "COMPLETE"
                    ? "border-blue-500 text-blue-500"
                    : "border-yellow-500 text-yellow-500"
                  }`}
              >
                {project.status}
              </Badge>
              <span className="text-sm text-gray-400">{project.type}</span>
            </div>
            <h3 className="text-secondary text-xl font-bold mb-2 group-hover:text-gray-300 transition-colors font-bauhaus">
              {project.title}
            </h3>
            <p className="text-base text-gray-400 mb-4">{project.description}</p>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((tech, techIndex) => {
                const Icon = techIcons[tech.toUpperCase()];
                return (
                  <Badge
                    key={techIndex}
                    variant="secondary"
                    className="text-sm bg-secondary text-primary rounded-none flex items-center gap-1"
                  >
                    {Icon && <Icon className="inline-block text-primary mr-1" style={{ fontSize: 14, verticalAlign: "middle" }} />}
                    {tech}
                  </Badge>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);
