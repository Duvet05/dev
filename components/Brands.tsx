import React from "react";

export const Brands: React.FC = () => {
  const brands = [
    { name: "ACTIVISION", logo: "images/brands/activision.png" },
    { name: "SANTA MONICA STUDIOS", logo: "images/brands/santa-monica-studios.png" },
    { name: "2K GAMES", logo: "images/brands/2k-games.png" },
    { name: "INSOMNIAC GAMES", logo: "images/brands/insomniac-games.png" },
    { name: "EPIC GAMES", logo: "images/brands/epic-games.png" },
  ];

  return (
    <div id="brands" className="mb-12">
      <h2 className="text-4xl font-bauhaus-pixel leading-none mb-4">BRANDS</h2>
      
      {/* Contenedor con overflow hidden para el scroll infinito */}
      <div className="relative overflow-hidden p-8">
        <div className="flex animate-scroll-brands">
          {/* Triplicamos los brands para crear un efecto infinito más suave */}
          {[...brands, ...brands, ...brands].map((brand, index) => (
            <div
              key={index}
              className="flex-shrink-0 mx-8 flex items-center justify-center"
            >
              <img
                src={brand.logo}
                alt={brand.name}
                className="h-12 w-auto object-contain invert"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Estilos CSS para la animación */}
      <style jsx>{`
        @keyframes scroll-brands {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        
        .animate-scroll-brands {
          animation: scroll-brands 30s linear infinite;
        }
      `}</style>
    </div>
  );
};
