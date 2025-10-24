
import { useState, useEffect } from 'react'
import Image from 'next/image'

interface SketchfabPreviewProps {
  thumbnails?: {
    small: string
    medium: string
    large: string
  }
  sketchfabUid: string
  modelName: string
  className?: string
}

export const SketchfabPreview: React.FC<SketchfabPreviewProps> = ({
  thumbnails,
  sketchfabUid,
  modelName,
  className = "w-full h-64"
}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Usar siempre el thumbnail small
  const imageUrl = thumbnails?.small || '/placeholder-model.svg'

  // Forzar desaparición del overlay después de 2 segundos
  useEffect(() => {
    if (isLoading) {
      const timeout = setTimeout(() => {
        setIsLoading(false)
      }, 2000)
      return () => clearTimeout(timeout)
    }
  }, [isLoading])

  const handleImageLoad = () => {
    setIsLoading(false)
    setHasError(false)
  }

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoading(false)
    setHasError(true)
    console.error('❌ Error cargando imagen SketchfabPreview:', imageUrl, e)
  }

  const handleClick = () => {
    window.open(`https://sketchfab.com/3d-models/${sketchfabUid}`, '_blank')
  }

  if (hasError || !thumbnails) {
    return (
      <div className={`${className} bg-gray-900 border border-red-500 flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors`}
           onClick={handleClick}
      >
        <div className="text-center p-4">
          <div className="text-red-400 text-sm font-bold mb-2">SKETCHFAB.PREVIEW</div>
          <div className="text-red-300 text-xs mb-2">
            {!thumbnails ? 'No thumbnails data' : 'Image failed to load'}
          </div>
          <div className="text-gray-500 text-xs mb-2">UID: {sketchfabUid.substring(0, 8)}...</div>
          <div className="text-yellow-300 text-xs">
            URL: {imageUrl.substring(0, 50)}...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className={`${className} relative border border-gray-600 bg-black overflow-hidden cursor-pointer hover:border-gray-400 transition-colors group`}
      onClick={handleClick}
    >
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center z-10">
          <div className="text-gray-400 text-sm animate-pulse">LOADING.PREVIEW...</div>
        </div>
      )}
      <div className="relative w-full h-full">
          <Image
            src={imageUrl}
            alt={`${modelName} - Sketchfab Preview`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onLoad={handleImageLoad}
            onError={handleImageError}
            fill
            sizes="100vw"
            priority={false}
          />
        {/* Overlay con información en hover */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
          <div className="text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="text-white text-sm font-bold mb-1">VIEW IN 3D</div>
            <div className="text-gray-300 text-xs">Click to open in Sketchfab</div>
          </div>
        </div>
        {/* Indicador de Sketchfab en la esquina inferior izquierda */}
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
          <span className="text-orange-400">⚡</span>
          <span>SKETCHFAB</span>
        </div>
      </div>
    </div>
  )
}
