"use client"

import { useEffect, useRef, useState } from 'react'

interface SketchfabViewerProps {
  modelUid: string
  className?: string
  autoStart?: boolean
}

// Declara el tipo global para Sketchfab
declare global {
  interface Window {
    Sketchfab: new (iframe: HTMLIFrameElement) => SketchfabClient
    sketchfabAPIinstances: SketchfabAPI[]
  }

  // Tipos para la API de Sketchfab
  interface SketchfabClient {
    init: (
      modelUid: string,
      options: SketchfabInitOptions
    ) => void;
  }

  interface SketchfabInitOptions {
    success: (api: SketchfabAPI) => void;
    error: (error: Error | string) => void;
    [key: string]: any;
  }

  interface SketchfabAPI {
    addEventListener: (event: string, callback: (error?: Error) => void) => void;
    removeEventListener: (event: string, callback: (error?: Error) => void) => void;
    start: () => void;
    stop: () => void;
    [key: string]: any;
  }
}

export const SketchfabViewer: React.FC<SketchfabViewerProps> = ({ 
  modelUid, 
  className = "w-full h-64",
  autoStart = true 
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [api, setApi] = useState<SketchfabAPI | null>(null)
  const initializationAttempted = useRef(false)
  const retryCount = useRef(0)
  const maxRetries = 2

  // Cargar el script de Sketchfab una sola vez
  useEffect(() => {
    if (window.Sketchfab) {
      return // Ya está cargado
    }

    const existingScript = document.querySelector('script[src*="sketchfab-viewer"]')
    if (existingScript) {
      return // Ya existe el script
    }

    console.log('Loading Sketchfab script...')
    const script = document.createElement('script')
    script.src = 'https://static.sketchfab.com/api/sketchfab-viewer-1.12.1.js'
    script.onload = () => {
      console.log('Sketchfab script loaded successfully')
    }
    script.onerror = () => {
      console.error('Failed to load Sketchfab script')
      setHasError(true)
      setErrorMessage('Failed to load Sketchfab script')
    }
    document.head.appendChild(script)
  }, [])

  // Inicializar el viewer cuando todo esté listo
  useEffect(() => {
    if (!modelUid || !iframeRef.current || initializationAttempted.current) {
      return
    }

    const checkAndInitialize = () => {
      if (!window.Sketchfab) {
        // Esperar a que el script se cargue
        setTimeout(checkAndInitialize, 100)
        return
      }

      console.log(`Initializing Sketchfab viewer for model: ${modelUid} (attempt ${retryCount.current + 1})`)
      initializationAttempted.current = true

      try {
        setIsLoading(true)
        setHasError(false)
        setErrorMessage('')

        if (!iframeRef.current) return;
        const client = new window.Sketchfab(iframeRef.current)

        client.init(modelUid, {
          success: function(api: SketchfabAPI) {
            console.log('Sketchfab API initialized successfully for model:', modelUid)
            setApi(api)
            retryCount.current = 0 // Reset retry count on success
            
            // Listener para cuando el viewer esté listo
            api.addEventListener('viewerready', function() {
              console.log('Sketchfab viewer is ready for model:', modelUid)
              setIsLoading(false)
              
              // Auto-start si está habilitado
              if (autoStart) {
                console.log('Auto-starting viewer')
                api.start()
              }
            })

            // Listener para errores del viewer
            api.addEventListener('error', function(error?: Error) {
              console.error('Sketchfab viewer error:', error)
              setHasError(true)
              setErrorMessage('Error al cargar el modelo 3D')
              setIsLoading(false)
            })
          },
          error: function(error: Error | string) {
            console.error('Failed to initialize Sketchfab for model:', modelUid, error)
            
            // Intentar retry si no hemos excedido el límite
            if (retryCount.current < maxRetries) {
              retryCount.current++
              console.log(`Retrying initialization for model ${modelUid} (${retryCount.current}/${maxRetries})`)
              initializationAttempted.current = false
              setTimeout(() => {
                checkAndInitialize()
              }, 1000 * retryCount.current) // Delay incremental
              return
            }
            
            setHasError(true)
            setErrorMessage('El modelo no se pudo cargar. Puede estar privado o tener restricciones.')
            setIsLoading(false)
          },
          // Configuraciones básicas
          ui_controls: 1,
          ui_infos: 0,
          ui_inspector: 0,
          ui_stop: 0,
          ui_watermark: 1,
          ui_help: 0,
          ui_settings: 0,
          ui_vr: 0,
          ui_fullscreen: 1,
          ui_annotations: 0,
          ui_loading: 0,
          autostart: autoStart ? 1 : 0
        })
      } catch (error: any) {
        console.error('Error initializing Sketchfab viewer:', error)
        setHasError(true)
        setErrorMessage('Error de inicialización del visor 3D')
        setIsLoading(false)
      }
    }

    // Timeout más largo para dar más tiempo a los modelos lentos
    const initTimeout = setTimeout(() => {
      if (isLoading && !hasError) {
        console.error(`Sketchfab initialization timeout for model: ${modelUid}`)
        
        // Intentar retry si no hemos excedido el límite
        if (retryCount.current < maxRetries) {
          retryCount.current++
          console.log(`Retrying due to timeout for model ${modelUid} (${retryCount.current}/${maxRetries})`)
          initializationAttempted.current = false
          setIsLoading(true)
          setTimeout(() => {
            checkAndInitialize()
          }, 1000)
          return
        }
        
        setHasError(true)
        setErrorMessage('Timeout - el modelo puede estar privado o tener restricciones')
        setIsLoading(false)
      }
    }, 15000) // 15 segundos de timeout

    // Delay más largo para dar tiempo al iframe
    setTimeout(() => {
      checkAndInitialize()
    }, 1000)

    return () => {
      clearTimeout(initTimeout)
    }
  }, [modelUid, autoStart, isLoading, hasError])

  // Cleanup effect
  useEffect(() => {
    return () => {
      // Limpiar la API si existe
      if (api) {
        try {
          api.stop()
        } catch (e) {
          console.warn('Error stopping Sketchfab API:', e)
        }
      }
    }
  }, [api])

  // Reset state when modelUid changes
  useEffect(() => {
    initializationAttempted.current = false
    retryCount.current = 0
    setIsLoading(true)
    setHasError(false)
    setErrorMessage('')
    setApi(null)
  }, [modelUid])

  if (hasError) {
    return (
      <div className={`${className} bg-gray-900 border border-red-500 flex items-center justify-center`}>
        <div className="text-red-400 text-sm text-center p-2">
          <div className="font-bold">SKETCHFAB.ERROR</div>
          <div className="text-xs mt-1">UID: {modelUid}</div>
          {errorMessage && (
            <div className="text-xs mt-1 text-red-300 max-w-full break-words">
              {errorMessage}
            </div>
          )}
          <div className="text-xs mt-2 text-gray-500">
            Check console for details
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`${className} relative border border-gray-600 bg-black overflow-hidden`}>
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center z-10">
          <div className="text-gray-400 text-sm animate-pulse">LOADING.3D.MODEL...</div>
        </div>
      )}

      {/* Sketchfab iframe */}
      <iframe
        ref={iframeRef}
        className="w-full h-full border-0"
        allow="autoplay; fullscreen; xr-spatial-tracking; accelerometer; gyroscope; magnetometer"
        allowFullScreen
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-downloads"
        style={{ border: 'none', outline: 'none' }}
        loading="lazy"
      />
    </div>
  )
}
