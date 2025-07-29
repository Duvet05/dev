import React, { useEffect, useState } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useThree } from '@react-three/fiber';

interface ModelLoaderProps {
  modelPath: string;
}

const ModelLoader: React.FC<ModelLoaderProps> = ({ modelPath }) => {
  const { scene } = useThree();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loader = new GLTFLoader();
    loader.load(
      modelPath,
      (gltf) => {
        scene.add(gltf.scene);
      },
      undefined,
      (err) => {
        console.error('An error happened while loading the model:', err);
        setError('Failed to load model');
      }
    );

    return () => {
      // Clean up the scene when the component unmounts
      scene.clear();
    };
  }, [modelPath, scene]);

  if (error) {
    return <div>{error}</div>;
  }

  return null; // or a loading spinner if desired
};

export default ModelLoader;