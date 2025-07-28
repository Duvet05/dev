import { Terminal } from "lucide-react";
import React from "react";

interface FooterProps {
  currentTime: string;
}

export const Footer: React.FC<FooterProps> = ({ currentTime }) => (
  <div className="border-t border-secondary pt-8">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-8 h-8 border border-white flex items-center justify-center">
            <Terminal className="w-4 h-4 text-white" />
          </div>
          <span className="text-2xl font-bauhaus-pixel mb-[-8]">CUADOT</span>
        </div>
        <p className="text-gray-400">
          Cuadot is a 3D artist and developer focused on visualization, procedural environments, and interactive experiences. Open for collaborations and freelance work.
        </p>
        <p className="text-gray-500 mt-2 text-xs">
          Website developed by <a href="https://cosmodev.me" target="_blank" rel="noopener noreferrer" className="underline">cosmodev.me</a>
        </p>
      </div>
      <div>
        <h4 className="font-bold mb-4 font-bauhaus text-base">SERVICES</h4>
        <div className="space-y-2 text-gray-400">
          <p>3D Modeling & Animation</p>
          <p>WebGL Development</p>
          <p>Interactive Experiences</p>
          <p>Virtual Environments</p>
        </div>
      </div>
      <div>
        <h4 className="font-bold mb-4 font-bauhaus text-base">TECHNOLOGIES</h4>
        <div className="space-y-2 text-gray-400">
          <p>Blender • Maya • ZBrush</p>
          <p>Three.js • WebGL • React</p>
          <p>Unreal Engine • Unity</p>
          <p>Substance Suite</p>
        </div>
      </div>
      <div>
        <h4 className="font-bold mb-4 font-bauhaus text-base">SYSTEM.INFO</h4>
        <div className="space-y-2 text-gray-400">
          <p>VERSION: 2.0.24</p>
          <p>BUILD: {currentTime}</p>
          <p>LICENSE: CREATIVE.COMMONS</p>
          <p>© 2025 Cuadot</p>
        </div>
      </div>
    </div>
  </div>
);
