'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Center } from '@react-three/drei';

interface Model3DViewerProps {
  modelPath: string;
  className?: string;
}

// Componente para cargar el modelo 3D
function Model({ url }: { url: string }) {
  try {
    const gltf = useGLTF(url);
    return (
      <Center>
        <primitive object={gltf.scene} scale={1} />
      </Center>
    );
  } catch (error) {
    console.error('Error loading 3D model:', error);
    return <PlaceholderModel />;
  }
}

// Componente de fallback
function PlaceholderModel() {
  return (
    <Center>
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#00ff00" wireframe />
      </mesh>
    </Center>
  );
}

// Componente de loading
function LoadingModel() {
  return (
    <Center>
      <mesh rotation={[0, 0, 0]}>
        <torusGeometry args={[1, 0.3, 16, 100]} />
        <meshStandardMaterial color="#ffff00" wireframe />
      </mesh>
    </Center>
  );
}

const Model3DViewer: React.FC<Model3DViewerProps> = ({ modelPath, className = "" }) => {
  return (
    <div className={`w-full h-48 bg-black border border-secondary ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ width: '100%', height: '100%' }}
        gl={{ antialias: true, alpha: false }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={2}
          maxDistance={10}
          minDistance={2}
        />
        <Suspense fallback={<LoadingModel />}>
          <Model url={modelPath} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Model3DViewer;