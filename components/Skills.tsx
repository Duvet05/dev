import React from "react";
import { Box, Film, Paintbrush, Bone } from "lucide-react";

export const Skills: React.FC = () => {
  const skills = [
    { icon: <Box size={50} className="mx-auto mb-4 text-secondary group-hover:animate-spin" />, title: "3D MODELING", desc: "High-poly & low-poly assets" },
    { icon: <Film size={50} className="mx-auto mb-4 text-secondary group-hover:animate-spin" />, title: "ANIMATION", desc: "Character & motion graphics" },
    { icon: <Paintbrush size={50} className="mx-auto mb-4 text-secondary group-hover:animate-spin" />, title: "TEXTURING", desc: "PBR, hand-painted, UV mapping" },
    { icon: <Bone size={50} className="mx-auto mb-4 text-secondary group-hover:animate-spin" />, title: "RIGGING", desc: "Skeletons, facial, advanced setups" },
  ];

  return (
    <div id="skills" className="mb-12">
      <h2 className="text-4xl font-bauhaus-pixel leading-none mb-4">SKILLS</h2>
      <div className="border-secondary border-r grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {skills.map((skill, index) => (
          <div
            key={index}
            className="bg-primary border-t border-b border-l border-secondary p-6 text-center hover:border-white transition-colors group"
          >
            {skill.icon}
            <h3 className="font-bold text-secondary font-bauhaus text-lg">{skill.title}</h3>
            <p className="text-base text-gray-400">{skill.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
