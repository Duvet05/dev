"use client"

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { ExternalLink } from 'lucide-react'
import Model3DViewer from '../3d/Model3DViewer'
// import SimpleModel3DViewer from '../3d/SimpleModel3DViewer'

interface Project {
  title: string;
  type: string;
  status: string;
  description: string;
  modelPath: string;
  date: string;
  fileSize: string;
  renderTime: string;
  complexity: string;
}

interface ProjectCard3DProps {
  project: Project;
}

const ProjectCard3D: React.FC<ProjectCard3DProps> = ({ project }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-500 text-black'
      case 'complete':
        return 'bg-blue-500 text-white'
      case 'beta':
        return 'bg-yellow-500 text-black'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity.toLowerCase()) {
      case 'extreme':
        return 'text-red-400'
      case 'high':
        return 'text-orange-400'
      case 'medium':
        return 'text-yellow-400'
      case 'low':
        return 'text-green-400'
      default:
        return 'text-gray-400'
    }
  }

  return (
    <div className="border border-secondary bg-primary p-4 hover:border-white transition-colors duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-400 font-mono">{project.type}</span>
        </div>
        <ExternalLink className="w-4 h-4 text-gray-500 hover:text-white cursor-pointer" />
      </div>

      {/* Title */}
      <h3 className="text-lg font-bauhaus-pixel text-white mb-2">{project.title}</h3>

      {/* 3D Model Viewer */}
      <div className="mb-3">
        <Model3DViewer modelPath={project.modelPath} className="rounded" />
      </div>

      {/* Description */}
      <p className="text-sm text-gray-300 mb-3 line-clamp-2">{project.description}</p>

      {/* Status Badge */}
      <div className="mb-3">
        <Badge className={`${getStatusColor(project.status)} font-mono text-xs rounded-none px-2 py-1`}>
          {project.status}
        </Badge>
      </div>

      {/* Technical Info */}
      <div className="space-y-1 text-xs font-mono">
        <div className="flex justify-between">
          <span className="text-gray-500">DATE:</span>
          <span className="text-gray-300">{project.date}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">SIZE:</span>
          <span className="text-gray-300">{project.fileSize}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">RENDER:</span>
          <span className="text-gray-300">{project.renderTime}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">COMPLEXITY:</span>
          <span className={getComplexityColor(project.complexity)}>{project.complexity}</span>
        </div>
      </div>
    </div>
  )
}

export default ProjectCard3D