import React, { useEffect, useRef, useState } from 'react';

interface DonutAnimationProps {
  width?: number;
  height?: number;
}

export const DonutAnimation: React.FC<DonutAnimationProps> = ({ 
  width = 40, 
  height = 20 
}) => {
  const [frame, setFrame] = useState<string>('');
  const animationRef = useRef<number | null>(null);
  const ARef = useRef<number>(0);
  const BRef = useRef<number>(0);

  const renderFrame = (A: number, B: number) => {
    const thetaSpacing = 0.07;
    const phiSpacing = 0.02;
    const R1 = 1;
    const R2 = 2;
    const K2 = 5;
    const K1 = width * K2 * 3 / (8 * (R1 + R2));

    // Precompute sines and cosines of A and B
    const cosA = Math.cos(A);
    const sinA = Math.sin(A);
    const cosB = Math.cos(B);
    const sinB = Math.sin(B);

    // Initialize output and zbuffer
    const output: string[][] = Array(height).fill(null).map(() => Array(width).fill(' '));
    const zbuffer: number[][] = Array(height).fill(null).map(() => Array(width).fill(0));

    // theta goes around the cross-sectional circle of a torus
    for (let theta = 0; theta < 2 * Math.PI; theta += thetaSpacing) {
      const costheta = Math.cos(theta);
      const sintheta = Math.sin(theta);

      // phi goes around the center of revolution of a torus
      for (let phi = 0; phi < 2 * Math.PI; phi += phiSpacing) {
        const cosphi = Math.cos(phi);
        const sinphi = Math.sin(phi);

        // the x,y coordinate of the circle, before revolving
        const circlex = R2 + R1 * costheta;
        const circley = R1 * sintheta;

        // final 3D (x,y,z) coordinate after rotations
        const x = circlex * (cosB * cosphi + sinA * sinB * sinphi) - circley * cosA * sinB;
        const y = circlex * (sinB * cosphi - sinA * cosB * sinphi) + circley * cosA * cosB;
        const z = K2 + cosA * circlex * sinphi + circley * sinA;
        const ooz = 1 / z; // "one over z"

        // x and y projection
        const xp = Math.floor(width / 2 + K1 * ooz * x);
        const yp = Math.floor(height / 2 - K1 * ooz * y);

        // calculate luminance
        const L = cosphi * costheta * sinB - cosA * costheta * sinphi - sinA * sintheta + cosB * (cosA * sintheta - costheta * sinA * sinphi);

        // L ranges from -sqrt(2) to +sqrt(2). If it's < 0, surface is pointing away
        if (L > 0) {
          // test against the z-buffer
          if (xp >= 0 && xp < width && yp >= 0 && yp < height && ooz > zbuffer[yp][xp]) {
            zbuffer[yp][xp] = ooz;
            const luminanceIndex = Math.floor(L * 8);
            // luminance_index is now in the range 0..11
            const chars = '.,-~:;=!*#$@';
            output[yp][xp] = chars[Math.min(luminanceIndex, chars.length - 1)];
          }
        }
      }
    }

    // Convert 2D array to string
    return output.map(row => row.join('')).join('\n');
  };

  useEffect(() => {
    const animate = () => {
      const frameContent = renderFrame(ARef.current, BRef.current);
      setFrame(frameContent);
      
      ARef.current += 0.04;
      BRef.current += 0.02;
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [width, height]);

  return (
    <pre 
      className="text-xs leading-none text-secondary font-mono overflow-hidden"
      style={{ 
        lineHeight: '0.8',
        letterSpacing: '0.05em',
        fontFamily: 'monospace'
      }}
    >
      {frame}
    </pre>
  );
};
