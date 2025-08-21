import React, { useRef, useEffect } from "react";

const images = [
  "victor-cuadot-victor-cuadot-3dpollos.jpg",
  "victor-cuadot-victor-cuadot-allien.jpg",
  "victor-cuadot-victor-cuadot-bunny.jpg",
  "victor-cuadot-victor-cuadot-disposi.jpg",
  "victor-cuadot-victor-cuadot-eggselente.jpg",
  "victor-cuadot-victor-cuadot-granujaboris.jpg",
  "victor-cuadot-victor-cuadot-horse.jpg",
  "victor-cuadot-victor-cuadot-nito.jpg",
  "victor-cuadot-victor-cuadot-robotbaseball.jpg",
  "victor-cuadot-victor-cuadot-robotocube.jpg",
  "victor-cuadot-victor-cuadot-skull.jpg",
  "victor-cuadot-victor-cuadot-squid.jpg",
  "victor-cuadot-victor-cuadot-thumbnail.jpg",
  "victor-cuadot-victor-cuadot-toyotomi.jpg",
  "victor-cuadot-victor-cuadot-vehiclecarrito.jpg",
];

export default function ArtstationInfiniteCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationFrame: number;
    let offset = 0;
    const speed = 0.7; // px por frame
    function animate() {
      const track = trackRef.current;
      if (!track) {
        animationFrame = requestAnimationFrame(animate);
        return;
      }
      offset -= speed;
      const firstImg = track.querySelector("img");
      if (firstImg) {
        const imgWidth = firstImg.clientWidth;
        if (Math.abs(offset) >= imgWidth) {
          offset += imgWidth;
          if (track.children.length > 0) {
            track.appendChild(track.children[0]);
          }
        }
      }
      track.style.transform = `translateX(${offset}px)`;
      animationFrame = requestAnimationFrame(animate);
    }
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div className="overflow-hidden w-full bg-black border-secondary border-x border-b">
      <div
        ref={trackRef}
        className="flex items-center"
        style={{ willChange: "transform" }}
      >
        {images.map((img, i) => (
          <div key={i} className="relative group cursor-pointer aspect-square h-36 w-36 flex items-center justify-center">
            <img
              src={`/images/artstation/${img}`}
              alt={img}
              className="absolute inset-0 w-full h-full object-cover shadow-lg border-l border-secondary opacity-100 group-hover:opacity-100 transition-opacity"
              draggable={false}
            />
            {/* Overlay estilo ArtStation */}
            <a
              href="/projects"
              tabIndex={-1}
              className="absolute inset-0 flex items-center justify-center bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <span className="text-white text-sm text-center px-4 py-2 uppercase tracking-widest rounded-none">
                VIEW MORE PROJECTS
              </span>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
