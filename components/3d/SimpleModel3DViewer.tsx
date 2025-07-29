"use client"

import React from 'react'

interface SimpleModel3DViewerProps {
  modelPath: string;
  className?: string;
}

const SimpleModel3DViewer: React.FC<SimpleModel3DViewerProps> = ({ modelPath, className = "" }) => {
  return (
    <div className={`w-full h-48 bg-black border border-secondary relative overflow-hidden ${className}`}>
      {/* Fondo de matrix/cyber */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 to-blue-900/20"></div>
      
      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 0, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 0, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      ></div>

      {/* 3D Model placeholder animation */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          {/* Wireframe cube animation */}
          <div className="w-16 h-16 border-2 border-green-400 animate-spin" style={{ animationDuration: '4s' }}>
            <div className="absolute inset-2 border border-green-400/60 animate-pulse"></div>
            <div className="absolute inset-4 border border-green-400/40"></div>
          </div>
          
          {/* Loading text */}
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-green-400 text-xs font-mono animate-pulse">
            LOADING.3D...
          </div>
        </div>
      </div>

      {/* Scanlines effect */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 0, 0.1) 2px, rgba(0, 255, 0, 0.1) 4px)'
        }}
      ></div>

      {/* Model path indicator */}
      <div className="absolute bottom-2 left-2 text-xs font-mono text-gray-500">
        {modelPath.split('/').pop()?.split('.')[0]?.toUpperCase()}.MODEL
      </div>
    </div>
  )
}

export default SimpleModel3DViewer
