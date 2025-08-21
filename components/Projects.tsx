import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Heart, Eye, Shapes, Layers, Gauge, ExternalLink } from "lucide-react";
import Link from "next/link";
import { SiBlender, SiAdobe, SiSketchfab } from "react-icons/si";
import { FaPaintBrush } from "react-icons/fa";
import { IconType } from "react-icons";
import ReactMarkdown from "react-markdown";

// Mapeo de tecnologías a iconos (estandarizado para tags)
const tagTechIcons: Record<string, IconType> = {
  blender: SiBlender,
  substancepainter: SiAdobe,
  substance: SiAdobe,
  zbrush: FaPaintBrush,
};

// IDs específicos de los modelos de Sketchfab a mostrar
const FEATURED_SKETCHFAB_MODELS = [
  'acccd15d4e454399a39dbe40f4f6df71',
  'e114132dd22b43b5be17ae543697c9e8',
  '6cb3bedc6d3647c085984afe02a82074'
];

interface SketchfabProject {
  title: string;
  source: string;
  description: string;
  date: string;
  fileSize: string;
  renderTime: string;
  complexity: string;
  sketchfabUid: string;
  triangles?: number;
  vertices?: number;
  likes?: number;
  views?: number;
  downloads?: number;
  author?: string;
  license?: string;
  categories?: string[];
  tags?: string[];
  thumbnails?: {
    small: string;
    medium: string;
    large: string;
  };
  staffpickedAt?: string | null;
}

export const Projects: React.FC = () => {
  const [sketchfabProjects, setSketchfabProjects] = useState<SketchfabProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Función para obtener los datos de los modelos específicos
  const fetchSketchfabProjects = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/sketchfab-models?username=cuadot&limit=100`);
      const data = await response.json();
      
      if (data.success && data.projects) {
        // Filtrar solo los modelos específicos que queremos mostrar
        const featuredProjects = data.projects.filter((project: SketchfabProject) => 
          FEATURED_SKETCHFAB_MODELS.includes(project.sketchfabUid)
        );
        
        // Ordenar según el orden de FEATURED_SKETCHFAB_MODELS
        const orderedProjects = FEATURED_SKETCHFAB_MODELS
          .map(uid => featuredProjects.find((p: SketchfabProject) => p.sketchfabUid === uid))
          .filter(Boolean);
        
        setSketchfabProjects(orderedProjects);
      }
    } catch (error) {
      console.error('Error fetching Sketchfab projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSketchfabProjects();
  }, []);

  return (
  <div id="projects" className="mb-12">
    <div className="flex items-center justify-between mb-3">
      <Link href="/projects" passHref legacyBehavior>
        <a className="text-4xl font-bauhaus-pixel leading-none text-white cursor-pointer animate-projects-glow transition-all relative group" style={{ textShadow: '0 0 12px #fff, 0 0 24px #fff' }}>
          PROJECTS
          <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-white scale-x-0 group-hover:scale-x-100 origin-left"></span>
        </a>
      </Link>
      <Link href="/projects">
        <Button
          variant="outline"
          className="mb-3 border-white text-white hover:bg-white hover:text-black bg-transparent rounded-none cursor-pointer"
        >
          VIEW.ALL <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </Link>
    </div>

    <div className="border-r border-b border-secondary grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {isLoading ? (
        // Loading state
        Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="bg-primary border-t border-l border-secondary"
          >
            <div className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-600 rounded mb-4"></div>
                <div className="h-6 bg-gray-600 rounded mb-4"></div>
                <div className="h-40 bg-gray-600 rounded mb-4"></div>
                <div className="h-4 bg-gray-600 rounded"></div>
              </div>
            </div>
          </div>
        ))
      ) : (
        // Render Sketchfab projects
        sketchfabProjects.map((project) => (
          <div
            key={project.sketchfabUid}
            className="bg-primary border-t border-l border-secondary hover:border-white transition-colors group"
          >
            <div className="p-6 flex flex-col h-full">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-2">
                      <a
                        href={`https://sketchfab.com/3d-models/${project.sketchfabUid}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="focus:outline-none"
                      >
                        <Badge
                          variant="outline"
                          className="text-sm rounded-none flex items-center gap-1 cursor-pointer hover:underline border-[#13aff0] text-[#13aff0]"
                        >
                          <SiSketchfab className="inline-block mr-1" style={{ fontSize: 16, verticalAlign: "middle" }} />
                          SKETCHFAB
                        </Badge>
                      </a>
                    </div>
                    <div className="flex flex-wrap gap-2 ml-auto">
                      {project.categories && project.categories.length > 0 ? (
                        <>
                          <div className="relative inline-block">
                            <Badge
                              variant="secondary"
                              className="text-sm bg-primary text-secondary rounded-none uppercase"
                            >
                              {project.categories[0]}
                            </Badge>
                            <div className="absolute top-0 left-0 w-2 h-2 border-t-1 border-l-1 border-gray-400 pointer-events-none"></div>
                            <div className="absolute top-0 right-0 w-2 h-2 border-t-1 border-r-1 border-gray-400 pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 w-2 h-2 border-b-1 border-l-1 border-gray-400 pointer-events-none"></div>
                            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-1 border-r-1 border-gray-400 pointer-events-none"></div>
                          </div>
                          {project.categories.length > 1 && (
                            <div className="relative inline-block">
                              <Badge
                                variant="secondary"
                                className="text-sm bg-primary text-secondary rounded-none uppercase"
                                title={`Additional categories: ${project.categories.slice(1).join(', ')}`}
                              >
                                +{project.categories.length - 1}
                              </Badge>
                              <div className="absolute top-0 left-0 w-2 h-2 border-t-1 border-l-1 border-gray-400 pointer-events-none"></div>
                              <div className="absolute top-0 right-0 w-2 h-2 border-t-1 border-r-1 border-gray-400 pointer-events-none"></div>
                              <div className="absolute bottom-0 left-0 w-2 h-2 border-b-1 border-l-1 border-gray-400 pointer-events-none"></div>
                              <div className="absolute bottom-0 right-0 w-2 h-2 border-b-1 border-r-1 border-gray-400 pointer-events-none"></div>
                            </div>
                          )}
                        </>
                      ) : (
                        <span className="text-xs text-gray-400">NO.CATEGORY</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <a
                      href={`https://sketchfab.com/3d-models/${project.sketchfabUid}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 focus:outline-none min-w-0"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <h3 className="text-xl font-bold group-hover:text-gray-300 transition-colors font-bauhaus text-left hover:underline cursor-pointer text-secondary truncate overflow-hidden whitespace-nowrap min-w-0">
                          {project.title}
                        </h3>
                        {project.staffpickedAt && (
                          <img
                            src="https://static.sketchfab.com/static/builds/web/dist/static/assets/images/icons/1ec49a9ae15f3f8f2d6ce895f503953c-v2.svg"
                            alt="Staff Picked"
                            title="Staff Picked"
                            className="w-5 h-5 drop-shadow-md"
                          />
                        )}
                        {project.date && (
                          <span className="text-xs text-gray-400 font-normal align-middle">
                            {(() => {
                              const d = new Date(project.date)
                              if (isNaN(d.getTime())) return project.date
                              return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`
                            })()}
                        </span>
                        )}
                      </div>
                    </a>
                  </div>
                  {(project.likes || project.views) && (
                    <div className="flex items-center gap-4 ml-4 text-gray-400 flex-shrink-0">
                      {project.likes ? (
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          <span>{project.likes.toLocaleString()}</span>
                        </div>
                      ) : null}
                      {project.views ? (
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{project.views.toLocaleString()}</span>
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
                
                {/* 3D Model Viewer - Sketchfab */}
                <div className="mb-4 relative">
                  {project.sketchfabUid ? (
                    <iframe
                      src={`https://sketchfab.com/models/${project.sketchfabUid}/embed?autospin=0&autostart=1&ui_theme=dark`}
                      title="Sketchfab 3D Viewer"
                      frameBorder="0"
                      allow="autoplay; fullscreen; vr"
                      allowFullScreen
                      className="w-full aspect-video border border-gray-600 bg-gray-900"
                    />
                  ) : (
                    <div className="w-full aspect-video bg-gray-900 border border-gray-600 flex items-center justify-center">
                      <div className="text-gray-400 text-sm">NO.MODEL.AVAILABLE</div>
                    </div>
                  )}
                </div>

                {/* Descripción con Markdown */}
                <div className="text-base text-gray-400 mb-2 line-clamp-3">
                  <ReactMarkdown
                    components={{
                      p: ({ ...props }) => <p {...props} className="inline" />,
                      strong: ({ ...props }) => <strong {...props} className="font-bold" />,
                      br: () => <br />,
                    }}
                  >
                    {project.description}
                  </ReactMarkdown>
                </div>

                {/* Tags */}
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.slice(0, 3).map((tag, tagIndex) => {
                      const tagKey = tag.toLowerCase();
                      const Icon = tagTechIcons[tagKey];
                      if (Icon) {
                        return (
                          <Badge
                            key={tagIndex}
                            variant="secondary"
                            className="uppercase text-xs bg-secondary text-primary rounded-none flex items-center gap-1"
                          >
                            <Icon className="inline-block mr-1" style={{ fontSize: 16, verticalAlign: "middle" }} />
                            {tag}
                          </Badge>
                        );
                      }
                      return (
                        <Badge
                          key={tagIndex}
                          variant="secondary"
                          className="uppercase text-xs bg-secondary text-primary rounded-none flex items-center gap-1"
                        >
                          #{tag}
                        </Badge>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="mt-auto">
                {/* Project metadata */}
                <div className="space-y-2 mb-4 text-xs text-gray-400">
                  {project.triangles && (
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1"><Shapes className="w-4 h-4 mr-1" />TRIANGLES:</span>
                      <span className="text-white">{project.triangles.toLocaleString()} ▲</span>
                    </div>
                  )}
                  {project.vertices && (
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1"><Layers className="w-4 h-4 mr-1" />VERTICES:</span>
                      <span className="text-white">{project.vertices.toLocaleString()} ◼</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1"><Gauge className="w-4 h-4 mr-1" />COMPLEXITY:</span>
                    <span className={
                      project.complexity === "EXTREME" ? "text-red-500" :
                        project.complexity === "VERY_HIGH" ? "text-orange-500" :
                          project.complexity === "HIGH" ? "text-yellow-500" :
                            project.complexity === "MEDIUM" ? "text-green-500" :
                              project.complexity === "LOW" ? "text-green-300" :
                                "text-gray-400"
                    }>{project.complexity}</span>
                  </div>
                </div>

                {/* Botones */}
                <div className="flex gap-2 w-full">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 text-sm text-gray-400 hover:text-white hover:bg-primary h-8 rounded-none border border-gray-700 hover:border-white transition-all cursor-pointer"
                    onClick={() => {
                      if (project.sketchfabUid) {
                        if (typeof window !== 'undefined') window.open(`https://sketchfab.com/3d-models/${project.sketchfabUid}`, '_blank')
                      }
                    }}
                  >
                    VIEW.ON.SKETCHFAB <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
    <style jsx global>{`
  @keyframes projects-glow {
    0%, 100% {
      text-shadow: 0 0 6px #fff, 0 0 12px #fff;
    }
    50% {
      text-shadow: 0 0 12px #fff, 0 0 24px #fff;
    }
  }
  .animate-projects-glow {
    animation: projects-glow 1.8s ease-in-out infinite;
  }
`}</style>
  </div>
  );
};
