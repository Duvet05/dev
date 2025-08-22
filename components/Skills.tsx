import React from "react";
import { Box, Film, Paintbrush, Bone } from "lucide-react";

const skillBackgrounds = [
  "url('https://cdnb.artstation.com/p/assets/images/images/051/620/939/large/victor-cuadot-skullspykes-ff.jpg?1657744764')",
  "url('https://cdnb.artstation.com/p/assets/images/images/035/901/341/large/victor-cuadot-alienigeno3-basecolor.jpg?1616188299')",
  "url('https://cdna.artstation.com/p/assets/images/images/051/620/990/large/victor-cuadot-virginfull6-ff.jpg?1657744892')",
  "url('https://cdna.artstation.com/p/assets/images/images/051/621/018/large/victor-cuadot-5-ff.jpg?1657745002')",
];

// Posiciones personalizadas para cada fondo (puedes ajustar estos valores a tu gusto)
const skillBackgroundPositions = [
  'center 18%',    // 3D MODELING
  'center 75%',    // ANIMATION
  'center 16%',    // TEXTURING
  'center 17%',    // RIGGING
];

export const Skills: React.FC = () => {
  const skills = [
    { icon: <Box size={50} className="mx-auto mb-4 text-secondary" />, title: "3D MODELING", desc: "High-poly & low-poly assets" },
    { icon: <Film size={50} className="mx-auto mb-4 text-secondary" />, title: "ANIMATION", desc: "Character & motion graphics" },
    { icon: <Paintbrush size={50} className="mx-auto mb-4 text-secondary" />, title: "TEXTURING", desc: "PBR, hand-painted, UV mapping" },
    { icon: <Bone size={50} className="mx-auto mb-4 text-secondary" />, title: "RIGGING", desc: "Skeletons, facial, advanced setups" },
  ];

  return (
    <div id="skills" className="mb-12">
      <h2 className="text-4xl font-bauhaus-pixel leading-none mb-4">SKILLS</h2>
      <div className="border-secondary border-r grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {skills.map((skill, index) => (
          <div
            key={index}
            className="bg-primary border-t border-b border-l border-secondary p-6 text-center hover:border-white transition-colors group relative overflow-hidden"
            style={{
              // El fondo base ya no se pone aquí
            }}
          >
            {/* Fondo con imagen y opacidad, siempre visible y con zoom en hover */}
            <div
              className="absolute inset-0 transition-transform duration-500 group-hover:scale-110"
              style={{
                backgroundImage: skillBackgrounds[index],
                backgroundSize: 'cover',
                backgroundPosition: skillBackgroundPositions[index],
                opacity: 1,
                zIndex: 1,
              }}
            >
              <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.5)' }} />
            </div>
            <div className="relative z-10">
              {skill.icon}
              <h3 className="font-bold text-secondary font-bauhaus text-lg">{skill.title}</h3>
              <p className="text-base text-gray-300">{skill.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
