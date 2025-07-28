import React, { useEffect, useState } from "react";

export const Skills: React.FC = () => {
  const [skillAngles, setSkillAngles] = useState([0, 0, 0, 0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSkillAngles((prev) => prev.map((angle) => (angle + 22.5) % 360));
    }, 62); // ~16 FPS
    return () => clearInterval(interval);
  }, []);

  return (
    <div id="skills" className="mb-12">
      <h2 className="text-4xl font-bauhaus-pixel leading-none mb-4">SKILLS</h2>
      <div className="border-secondary border-r grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {[
          { img: "/images/skills/modeling.png", title: "3D MODELING", desc: "High-poly & low-poly assets" },
          { img: "/images/skills/animation.png", title: "ANIMATION", desc: "Character & motion graphics" },
          { img: "/images/skills/texturing.png", title: "TEXTURING", desc: "PBR, hand-painted, UV mapping" },
          { img: "/images/skills/rigging.png", title: "RIGGING", desc: "Skeletons, facial, advanced setups" },
        ].map((skill, index) => (
          <div
            key={index}
            className="bg-primary border-t border-b border-l border-secondary p-6 text-center hover:border-white transition-colors group"
          >
            <img
              src={skill.img}
              alt={skill.title}
              className="w-[50px] h-[50px] mx-auto mb-4 object-contain invert"
              style={{
                transform: `rotateY(${skillAngles[index]}deg)`,
                transition: 'transform 0.06s linear',
              }}
            />
            <h3 className="font-bold text-secondary font-bauhaus text-lg">{skill.title}</h3>
            <p className="text-base text-gray-400">{skill.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
