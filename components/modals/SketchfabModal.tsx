"use client"
import React from 'react';
import { Calendar, Heart, Eye, Shapes, Layers, Gauge, FileText, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { WindowHeader } from '@/components/layout/WindowHeader';
import { IconType } from 'react-icons';

// Interface para el proyecto (usando la misma del archivo principal)
interface Project {
  title: string;
  source: string;
  description: string;
  date: string;
  fileSize: string;
  renderTime: string;
  complexity: string;
  sketchfabUid?: string;
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

interface SketchfabModalProps {
  project: Project;
  onClose: () => void;
  tagTechIcons: Record<string, IconType>;
}

export const SketchfabModal: React.FC<SketchfabModalProps> = ({
  project,
  onClose,
  tagTechIcons
}) => {
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center md:p-24 p-4">
      <div className="bg-primary max-w-6xl w-full max-h-full overflow-y-auto border border-secondary">
        <WindowHeader
          title={project.title}
          onClose={onClose}
        />
        <div className="p-6 flex flex-col lg:flex-row gap-6 bg-primary">
          {/* Imagen grande o visor 3D */}
          <div className="flex flex-col items-center relative flex-shrink-0">
            {/* Contenedor que se adapta al asset */}
            <div className="w-full max-w-lg relative">
              {/* Corner brackets */}
              <div className="absolute -top-1.5 -left-1.5 w-5 h-5 pointer-events-none z-10">
                <div className="w-full h-full border-t-1 border-l-1 border-secondary"></div>
              </div>
              <div className="absolute -top-1.5 -right-1.5 w-5 h-5 pointer-events-none z-10">
                <div className="w-full h-full border-t-1 border-r-1 border-secondary"></div>
              </div>
              <div className="absolute -bottom-1.5 -left-1.5 w-5 h-5 pointer-events-none z-10">
                <div className="w-full h-full border-b-1 border-l-1 border-secondary"></div>
              </div>
              <div className="absolute -bottom-1.5 -right-1.5 w-5 h-5 pointer-events-none z-10">
                <div className="w-full h-full border-b-1 border-r-1 border-secondary"></div>
              </div>

              {/* Contenido del visor 3D de Sketchfab */}
              {project.sketchfabUid ? (
                <iframe
                  src={`https://sketchfab.com/models/${project.sketchfabUid}/embed?autospin=1&autostart=1&ui_theme=dark`}
                  title="Sketchfab 3D Viewer"
                  frameBorder="0"
                  allow="autoplay; fullscreen; vr"
                  allowFullScreen
                  className="w-full aspect-square border border-gray-700 bg-black"
                />
              ) : (
                <img
                  src={project.thumbnails?.large}
                  alt={project.title}
                  className="w-full aspect-square object-cover bg-black border border-gray-700"
                />
              )}
            </div>
          </div>
          
          {/* Info del modelo */}
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <h2 className="text-2xl font-bauhaus-pixel mb-[-8] text-secondary">
                {project.title}
              </h2>
              {/* Icono de staffpick si aplica */}
              {project.staffpickedAt && (
                <img
                  src="https://static.sketchfab.com/static/builds/web/dist/static/assets/images/icons/1ec49a9ae15f3f8f2d6ce895f503953c-v2.svg"
                  alt="Staff Picked"
                  title="Staff Picked"
                  className="w-5 h-5 drop-shadow-md mt-0.5"
                />
              )}
            </div>
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
              <Calendar className="w-4 h-4 mr-1" />
              {project.date && (() => {
                const d = new Date(project.date);
                if (isNaN(d.getTime())) return project.date;
                return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
              })()}

              <div className="flex flex-wrap gap-2 ml-2 items-center">
                {/* Categorías */}
                {project.categories && project.categories.length > 0 && (
                  <>
                    {project.categories.map((cat, i) => (
                      <div className="relative inline-block" key={i}>
                        <Badge
                          variant="secondary"
                          className="text-sm rounded-none uppercase bg-primary text-secondary"
                        >
                          {cat}
                        </Badge>
                        <>
                          <div className="absolute top-0 left-0 w-2 h-2 border-t-1 border-l-1 border-gray-400 pointer-events-none"></div>
                          <div className="absolute top-0 right-0 w-2 h-2 border-t-1 border-r-1 border-gray-400 pointer-events-none"></div>
                          <div className="absolute bottom-0 left-0 w-2 h-2 border-b-1 border-l-1 border-gray-400 pointer-events-none"></div>
                          <div className="absolute bottom-0 right-0 w-2 h-2 border-b-1 border-r-1 border-gray-400 pointer-events-none"></div>
                        </>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
            
            <div className="text-base text-gray-400">
              <ReactMarkdown
                components={{
                  p: ({ node, ...props }) => <p {...props} className="mb-2" />,
                  strong: ({ node, ...props }) => <strong {...props} className="font-bold" />,
                  br: () => <br />,
                }}
              >
                {project.description || ""}
              </ReactMarkdown>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {project.tags?.map((tag, i) => {
                const tagKey = tag.toLowerCase();
                const Icon = tagTechIcons[tagKey];
                if (Icon) {
                  return (
                    <Badge
                      key={i}
                      variant="secondary"
                      className="uppercase text-xs rounded-none flex items-center gap-1 font-vt323 bg-secondary text-primary"
                    >
                      <Icon className="inline-block mr-1" style={{ fontSize: 16, verticalAlign: "middle" }} />
                      {tag}
                    </Badge>
                  );
                }
                return (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="uppercase text-xs rounded-none flex items-center gap-1 font-vt323 bg-secondary text-primary"
                  >
                    #{tag}
                  </Badge>
                );
              })}
            </div>
            
            <div className="flex flex-col gap-4">
              {/* Metadata alineada para Sketchfab */}
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-400 mt-4">
                <div className="flex items-center gap-1"><span className="flex items-center gap-1"><Shapes className="w-4 h-4 mr-1" />TRIANGLES:</span><span className="text-white">{project.triangles?.toLocaleString() ?? '-'} {project.triangles ? '▲' : ''}</span></div>
                <div className="flex items-center gap-1"><span className="flex items-center gap-1"><Layers className="w-4 h-4 mr-1" />VERTICES:</span><span className="text-white">{project.vertices?.toLocaleString() ?? '-'} {project.vertices ? '◼' : ''}</span></div>
                <div className="flex items-center gap-1"><span className="flex items-center gap-1"><Heart className="w-4 h-4 mr-1" />LIKES:</span><span className="text-white">{project.likes?.toLocaleString() ?? '-'}</span></div>
                <div className="flex items-center gap-1"><span className="flex items-center gap-1"><Eye className="w-4 h-4 mr-1" />VIEWS:</span><span className="text-white">{project.views?.toLocaleString() ?? '-'}</span></div>
                <div className="flex items-center gap-1">
                  <span className="flex items-center gap-1">
                    <Gauge className="w-4 h-4 mr-1" />COMPLEXITY:
                  </span>
                  <span className={
                    project.complexity === "EXTREME" ? "text-red-500" :
                      project.complexity === "VERY_HIGH" ? "text-orange-500" :
                        project.complexity === "HIGH" ? "text-yellow-500" :
                          project.complexity === "MEDIUM" ? "text-green-500" :
                            project.complexity === "LOW" ? "text-green-300" :
                              "text-gray-400"
                  }>
                    {project.complexity}
                  </span>
                </div>
                <div className="flex items-center gap-1"><span className="flex items-center gap-1"><FileText className="w-4 h-4 mr-1" />LICENSE:</span><span className="text-white">{project.license}</span></div>
              </div>

              {/* Botón de Sketchfab */}
              <div className="flex gap-2 w-full">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 text-sm text-gray-400 hover:text-white hover:bg-primary h-8 rounded-none border border-gray-700 hover:border-white transition-all cursor-pointer"
                  onClick={() => project.sketchfabUid && window.open(`https://sketchfab.com/3d-models/${project.sketchfabUid}`, '_blank')}
                >
                  VIEW.ON.SKETCHFAB <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
