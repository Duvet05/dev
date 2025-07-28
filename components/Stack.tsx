import React from "react";
import { SiBlender, SiAutodesk, SiAdobephotoshop, SiUnity, SiUnrealengine, SiWebgl, SiAdobe } from "react-icons/si";
import { FaPaintBrush } from "react-icons/fa";
import { IconType } from "react-icons";

interface StackProps { }

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

export const Stack: React.FC<StackProps> = () => (
  <div id="stack" className="flex-1 h-full flex flex-col self-stretch">
    <h2 className="text-4xl font-bauhaus-pixel leading-none mb-4">STACK</h2>
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-2">
      {techList.map(({ tech, level, icon: Icon }, idx) => (
        <div key={tech} className="flex items-center w-full">
          <span className="flex items-center gap-4 font-vt323 text-lg text-white min-w-[140px] md:min-w-[160px] text-left">
            <Icon className="text-2xl text-secondary" />
            {tech}
          </span>
          <div className="flex flex-1 justify-end gap-1">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className={`w-7 h-3 border border-secondary ${i < level ? 'bg-white' : 'bg-black'} transition-colors`}
                style={{ boxShadow: i < level ? '0 0 1px #fff' : 'none', marginLeft: '1px' }}
              ></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);
