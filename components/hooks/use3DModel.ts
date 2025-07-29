import { useState, useEffect } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useThree } from '@react-three/fiber';

const use3DModel = (modelPath) => {
  const [model, setModel] = useState(null);
  const { scene } = useThree();

  useEffect(() => {
    const loader = new GLTFLoader();
    loader.load(
      modelPath,
      (gltf) => {
        setModel(gltf.scene);
        scene.add(gltf.scene);
      },
      undefined,
      (error) => {
        console.error('Error loading model:', error);
      }
    );

    return () => {
      if (model) {
        scene.remove(model);
      }
    };
  }, [modelPath, scene, model]);

  return model;
};

export default use3DModel;