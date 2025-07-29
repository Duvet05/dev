import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Scene3D = ({ modelPath }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const loader = new THREE.GLTFLoader();
    loader.load(modelPath, (gltf) => {
      scene.add(gltf.scene);
      renderer.render(scene, camera);
    }, undefined, (error) => {
      console.error('An error happened while loading the model:', error);
    });

    camera.position.z = 5;

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      mountRef.current.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [modelPath]);

  return <div ref={mountRef} />;
};

export default Scene3D;