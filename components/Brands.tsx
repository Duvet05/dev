import React, { useEffect, useState } from "react";
import Image from "next/image";

export const Brands: React.FC = () => {
  const brands = [
    { name: "ACTIVISION", logo: "images/brands/activision.png" },
    { name: "SANTA MONICA STUDIOS", logo: "images/brands/santa-monica-studios.png" },
    { name: "2K GAMES", logo: "images/brands/2k-games.png" },
    { name: "INSOMNIAC GAMES", logo: "images/brands/insomniac-games.png" },
    { name: "EPIC GAMES", logo: "images/brands/epic-games.png" },
  ];

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const brandsToShow = isMobile
    ? [...brands, ...brands, ...brands, ...brands]
    : [...brands, ...brands, ...brands];

  return (
    <div id="brands" className="mb-12">
      <h2 className="text-4xl font-bauhaus-pixel leading-none mb-4">BRANDS</h2>
      
      {/* Contenedor con overflow hidden para el scroll infinito */}
      <div className="relative overflow-hidden p-8">
        <div className="flex animate-scroll-brands">
          {/* Cuadruplicamos los brands en mobile para un loop más largo y suave */}
          {brandsToShow.map((brand, index) => (
            <div
              key={index}
              className="flex-shrink-0 mx-8 flex items-center justify-center"
            >
              <Image
                src={brand.logo.startsWith('/') ? brand.logo : '/' + brand.logo}
                alt={brand.name}
                className="h-12 w-auto object-contain invert"
                height={48}
                width={120}
                style={{height: '48px', width: 'auto'}}
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
        @media (max-width: 640px) {
          .animate-scroll-brands {
            animation-duration: 2s !important;
            animation-name: scroll-brands-mobile !important;
          }
          @keyframes scroll-brands-mobile {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-25%);
            }
          }
        }
      `}</style>
    </div>
  );
};
