import React from "react";
import { SiBlender, SiAutodesk, SiAdobephotoshop, SiUnity, SiUnrealengine, SiWebgl, SiAdobe } from "react-icons/si";
import { FaPaintBrush } from "react-icons/fa";
import { IconType } from "react-icons";

const techList: { tech: string; level: number; icon: IconType }[] = [
  { tech: "Blender", level: 10, icon: SiBlender },
  { tech: "Maya", level: 9, icon: SiAutodesk },
  { tech: "ZBrush", level: 8, icon: FaPaintBrush },
  { tech: "Substance", level: 9, icon: SiAdobe },
  { tech: "Photoshop", level: 10, icon: SiAdobephotoshop },
  { tech: "Unity", level: 6, icon: SiUnity },
  { tech: "Unreal", level: 6, icon: SiUnrealengine },
  { tech: "WebGL", level: 7, icon: SiWebgl },
];

export const Stack: React.FC = () => (
  <div id="stack" className="flex-1 min-w-0 flex flex-col">
    <h2 className="text-4xl font-bauhaus-pixel leading-none mb-4">STACK</h2>
    <div className="w-full grid gap-x-5 gap-y-2 items-center overflow-hidden" style={{ gridTemplateColumns: 'max-content 1fr' }}>
      {techList.map(({ tech, level, icon: Icon }) => (
        <React.Fragment key={tech}>
          {/* Texto con ancho automático según el más largo */}
          <div className="flex items-center gap-2 font-vt323 text-base lg:text-lg text-white">
            <Icon className="text-xl lg:text-2xl text-secondary flex-shrink-0" />
            <span className="truncate">{tech}</span>
          </div>
          {/* Barritas responsivas alineadas */}
          <div className="flex gap-1 flex-1 w-full min-w-0">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className={`flex-1 min-w-0 h-3 border border-secondary flex-shrink-0 transition-colors ${i < level ? 'bg-white' : 'bg-black'}`}
                style={{ 
                  boxShadow: i < level ? '0 0 1px #fff' : 'none'
                }}
              ></div>
            ))}
          </div>
        </React.Fragment>
      ))}
    </div>
  </div>
);
