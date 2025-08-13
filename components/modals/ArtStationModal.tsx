"use client"
import React from 'react';
import { Calendar, Heart, Eye, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
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
  likes?: number;
  views?: number;
  author?: string;
  categories?: string[];
  tags?: string[];
  softwareUsed?: {
    name: string;
    iconUrl: string;
  }[];
  assets?: {
    id: number;
    title?: string;
    imageUrl: string;
    width: number;
    height: number;
    type: 'image' | 'cover' | 'model3d' | 'video_clip';
    playerEmbedded?: string | null;
  }[];
  thumbnails?: {
    small: string;
    medium: string;
    large: string;
  };
  viewerUrl?: string;
}

interface ArtStationModalProps {
  project: Project;
  onClose: () => void;
  tagTechIcons: Record<string, IconType>;
  selectedAssetIndex: number;
  setSelectedAssetIndex: (index: number) => void;
  assetsScrollRef: React.RefObject<HTMLDivElement | null>;
  scrollAssetsLeft: () => void;
  scrollAssetsRight: () => void;
  renderArtStationAsset: (asset: any, isLarge: boolean) => React.ReactNode;
}

export const ArtStationModal: React.FC<ArtStationModalProps> = ({
  project,
  onClose,
  tagTechIcons,
  selectedAssetIndex,
  setSelectedAssetIndex,
  assetsScrollRef,
  scrollAssetsLeft,
  scrollAssetsRight,
  renderArtStationAsset
}) => {
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center md:p-24 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-primary max-w-6xl w-full max-h-full overflow-y-auto border border-secondary">
        <WindowHeader
          title={project.title}
          onClose={onClose}
        />
        <div className="p-6 flex flex-col lg:flex-row gap-6 bg-primary">
          {/* Imagen grande o visor */}
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

              {/* Contenido ArtStation */}
              <div className="w-full">
                {/* Asset principal */}
                <div className="mb-1">
                  {project.assets && (() => {
                    // Filtrar solo imágenes (no covers) y videos válidos
                    const validAssets = project.assets.filter(asset => 
                      (asset.type === 'image') || 
                      (asset.type === 'video_clip' && asset.playerEmbedded)
                    );
                    return validAssets.length > 0;
                  })() ? (
                    <div className="w-full aspect-square border border-gray-700 bg-black flex items-center justify-center overflow-hidden">
                      {(() => {
                        const validAssets = project.assets.filter(asset => 
                          (asset.type === 'image') || 
                          (asset.type === 'video_clip' && asset.playerEmbedded)
                        );
                        const selectedAsset = validAssets[Math.min(selectedAssetIndex, validAssets.length - 1)];
                        return renderArtStationAsset(selectedAsset, true);
                      })()}
                    </div>
                  ) : (
                    <img
                      src={project.thumbnails?.large}
                      alt={project.title}
                      className="w-full aspect-square object-cover bg-black border border-gray-700"
                    />
                  )}
                </div>
              
                {/* Galería de assets */}
                {project.assets && (() => {
                  // Filtrar solo imágenes (no covers) y videos válidos
                  const validAssets = project.assets.filter(asset => 
                    (asset.type === 'image') || 
                    (asset.type === 'video_clip' && asset.playerEmbedded)
                  );
                  return validAssets.length > 1;
                })() && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1">
                      <div 
                        ref={assetsScrollRef}
                        className="flex gap-1 overflow-x-auto flex-1"
                        style={{ 
                          scrollbarWidth: 'none',
                          msOverflowStyle: 'none' 
                        }}
                      >
                        {project.assets
                          .filter(asset => 
                            (asset.type === 'image') || 
                            (asset.type === 'video_clip' && asset.playerEmbedded)
                          )
                          .map((asset, index) => (
                          <div
                            key={index}
                            className={`flex-shrink-0 w-16 h-16 border cursor-pointer transition-all overflow-hidden ${
                              index === selectedAssetIndex 
                                ? "border-white shadow-lg ring-1 ring-white/50" 
                                : "border-gray-600 hover:border-gray-400 hover:shadow-md"
                            }`}
                            onClick={() => setSelectedAssetIndex(index)}
                            title={asset.title || `Asset ${index + 1}`}
                          >
                            {renderArtStationAsset(asset, false)}
                          </div>
                        ))}
                      </div>
                      {project.assets.filter(asset => 
                        (asset.type === 'image') || 
                        (asset.type === 'video_clip' && asset.playerEmbedded)
                      ).length > 5 && (
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={scrollAssetsLeft}
                            className="w-7.5 h-7.5 border border-gray-600 bg-black hover:border-white hover:bg-gray-900 transition-colors flex items-center justify-center"
                            title="Scroll left"
                          >
                            <ChevronLeft className="w-3 h-3 text-gray-400" />
                          </button>
                          <button
                            onClick={scrollAssetsRight}
                            className="w-7.5 h-7.5 border border-gray-600 bg-black hover:border-white hover:bg-gray-900 transition-colors flex items-center justify-center"
                            title="Scroll right"
                          >
                            <ChevronRight className="w-3 h-3 text-gray-400" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Info del modelo */}
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <h2 className="text-2xl font-bauhaus-pixel mb-[-8] text-secondary">
                {project.title}
              </h2>
            </div>
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
              <Calendar className="w-4 h-4 mr-1" />
              {project.date && (() => {
                const d = new Date(project.date);
                if (isNaN(d.getTime())) return project.date;
                return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
              })()}

              {/* Mostrar autor para ArtStation */}
              {project.author && (
                <span className="ml-2">by <span className="text-gray-200">{project.author}</span></span>
              )}

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
              <div dangerouslySetInnerHTML={{ __html: project.description || "" }} />
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
              
              {/* Software utilizado (solo para ArtStation) - junto con los tags */}
              {project.softwareUsed && project.softwareUsed.length > 0 && (
                <>
                  {project.softwareUsed.map((software, i) => (
                    <Badge
                      key={`software-${i}`}
                      variant="secondary"
                      className="text-xs rounded-none flex items-center gap-1 font-vt323 bg-gray-800 text-gray-200 border border-gray-600"
                    >
                      <img
                        src={software.iconUrl}
                        alt={software.name}
                        className="w-4 h-4 object-contain"
                      />
                      {software.name.toUpperCase()}
                    </Badge>
                  ))}
                </>
              )}
            </div>
            
            <div className="flex flex-col gap-4">
              {/* Metadata para ArtStation */}
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-400 mt-4">
                <div className="flex items-center gap-1"><span className="flex items-center gap-1"><Heart className="w-4 h-4 mr-1" />LIKES:</span><span className="text-white">{project.likes?.toLocaleString() ?? '-'}</span></div>
                <div className="flex items-center gap-1"><span className="flex items-center gap-1"><Eye className="w-4 h-4 mr-1" />VIEWS:</span><span className="text-white">{project.views?.toLocaleString() ?? '-'}</span></div>
              </div>

              {/* Botón de ArtStation */}
              <div className="flex gap-2 w-full">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 text-sm text-gray-400 hover:text-white hover:bg-primary h-8 rounded-none border border-gray-400 hover:border-white transition-all cursor-pointer"
                  onClick={() => project.viewerUrl && window.open(project.viewerUrl, '_blank')}
                >
                  VIEW.ON.ARTSTATION <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
