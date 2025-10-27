"use client"

import { useEffect, useRef, useState } from "react"

// Definir tipos para js-dos
interface DosInstance {
  exit: () => void
}

interface DosPlayerFactoryConfig {
  url: string
}

declare global {
  interface Window {
    Dos: (element: HTMLDivElement, config?: DosPlayerFactoryConfig) => {
      run: (bundleUrl: string) => Promise<DosInstance>
    }
    emulators: {
      pathPrefix: string
    }
  }
}

export default function RedAlertGameOptimized() {
  const containerRef = useRef<HTMLDivElement>(null)
  const dosInstanceRef = useRef<DosInstance | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [loadingStatus, setLoadingStatus] = useState("Inicializando...")
  const [error, setError] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const loadGame = async () => {
      if (!containerRef.current) return

      try {
        setLoadingStatus("Cargando emulador js-dos...")

        // Cargar js-dos desde CDN (sin chrono-log)
        const script = document.createElement("script")
        script.src = "https://cdn.jsdelivr.net/npm/js-dos@8.xx/dist/js-dos.js"
        script.async = true

        script.onload = async () => {
          if (!containerRef.current || !window.Dos) {
            setError("Error al cargar js-dos")
            return
          }

          try {
            setLoadingProgress(20)
            setLoadingStatus("Emulador listo, descargando juego...")

            // Crear instancia de DOS
            const dos = window.Dos(containerRef.current, {
              url: "https://cdn.jsdelivr.net/npm/js-dos@8.xx/dist/"
            })

            // Opción 1: Cargar desde CDN externa (más rápido)
            // const bundleUrl = "https://tu-cdn.com/redalert.jsdos"

            // Opción 2: Cargar desde archivo local con monitoreo de progreso
            const bundleUrl = "/games/redalert.jsdos"

            // Monitorear descarga (solo funciona con fetch manual)
            setLoadingProgress(30)
            setLoadingStatus("Descargando Red Alert (puede tomar 1-2 min)...")

            // Iniciar el juego
            const instance = await dos.run(bundleUrl)

            dosInstanceRef.current = instance
            setLoadingProgress(100)
            setLoadingStatus("¡Listo!")
            setTimeout(() => setIsLoading(false), 500)

          } catch (err) {
            console.error("Error al iniciar el juego:", err)
            setError(
              "Error al cargar el juego. Esto puede deberse a:\n" +
              "1. Conexión lenta (el archivo pesa 337MB)\n" +
              "2. El archivo redalert.jsdos no existe en /public/games/\n" +
              "3. Problema de CORS si usas CDN externa\n\n" +
              "Intenta recargar la página (F5)"
            )
            setIsLoading(false)
          }
        }

        script.onerror = () => {
          setError("Error al cargar la librería js-dos desde CDN")
          setIsLoading(false)
        }

        document.head.appendChild(script)

        return () => {
          // Cleanup
          if (dosInstanceRef.current) {
            dosInstanceRef.current.exit()
          }
          if (script.parentNode) {
            document.head.removeChild(script)
          }
        }
      } catch (err) {
        console.error("Error general:", err)
        setError("Error inesperado al cargar el juego")
        setIsLoading(false)
      }
    }

    loadGame()
  }, [])

  const toggleFullscreen = () => {
    if (!containerRef.current) return

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  // Manejar salida de fullscreen con ESC
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  return (
    <div className="w-full h-full min-h-screen bg-black flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="w-full max-w-6xl mb-4">
        <div className="border border-secondary bg-black p-4">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <h1 className="text-2xl md:text-4xl font-bold text-primary font-vt323">
              COMMAND & CONQUER: RED ALERT
            </h1>
            <div className="flex gap-2">
              <button
                onClick={toggleFullscreen}
                className="px-4 py-2 border border-secondary text-primary hover:bg-primary hover:text-black transition-colors font-vt323 text-lg"
              >
                {isFullscreen ? "EXIT FULLSCREEN" : "FULLSCREEN"}
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="px-4 py-2 border border-secondary text-gray-400 hover:bg-secondary hover:text-black transition-colors font-vt323 text-lg"
              >
                HOME
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Game Container */}
      <div className="w-full max-w-6xl flex-1">
        <div className="border border-secondary bg-black relative" style={{ minHeight: "600px" }}>
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-10 p-8">
              <div className="text-primary text-3xl font-vt323 mb-6 animate-pulse">
                {loadingStatus}
              </div>

              {/* Barra de progreso */}
              <div className="w-full max-w-md mb-8">
                <div className="w-full h-4 border border-secondary bg-black">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${loadingProgress}%` }}
                  ></div>
                </div>
                <div className="text-secondary font-vt323 text-sm mt-2 text-center">
                  {loadingProgress}%
                </div>
              </div>

              {/* Tips mientras carga */}
              <div className="border border-secondary p-6 max-w-lg text-primary font-vt323 text-sm">
                <div className="text-secondary text-lg mb-3">LOADING TIPS:</div>
                <ul className="space-y-2 list-disc list-inside">
                  <li>La primera carga toma 1-2 minutos (337MB)</li>
                  <li>Las siguientes serán instantáneas (cache del navegador)</li>
                  <li>Construye base de recursos primero</li>
                  <li>Los tanques son efectivos contra infantería</li>
                  <li>Usa Click derecho para dar órdenes</li>
                </ul>
              </div>

              {loadingProgress < 30 && (
                <div className="text-gray-500 font-vt323 text-xs mt-4 max-w-lg text-center">
                  Tip: Para cargas más rápidas en el futuro, considera usar un CDN
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-10 p-8">
              <div className="text-red-500 text-2xl font-vt323 mb-4 text-center">
                ERROR AL CARGAR
              </div>
              <div className="border border-red-500 p-6 max-w-2xl">
                <pre className="text-primary font-vt323 text-sm whitespace-pre-wrap mb-6">
                  {error}
                </pre>

                <div className="border-t border-secondary pt-4 mt-4">
                  <div className="text-secondary font-vt323 mb-3">SOLUCIONES:</div>
                  <div className="space-y-3 text-primary font-vt323 text-sm">
                    <div>
                      <span className="text-secondary">1. CDN Externa (RECOMENDADO):</span>
                      <br />
                      Sube el archivo a Cloudflare R2, AWS S3, o Bunny CDN
                      <br />
                      Velocidad: 10-20 MB/s (descarga en 20-30 segundos)
                    </div>
                    <div>
                      <span className="text-secondary">2. Versión lite (sin videos):</span>
                      <br />
                      Crea un bundle sin MAIN.MIX (reduce a ~25MB)
                    </div>
                    <div>
                      <span className="text-secondary">3. Verifica el archivo:</span>
                      <br />
                      <code className="bg-gray-900 px-2 py-1">
                        ls -lh public/games/redalert.jsdos
                      </code>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => window.location.reload()}
                  className="mt-6 w-full px-4 py-2 border border-secondary text-primary hover:bg-primary hover:text-black transition-colors font-vt323 text-lg"
                >
                  REINTENTAR (F5)
                </button>
              </div>
            </div>
          )}

          <div ref={containerRef} className="w-full h-full min-h-[600px]"></div>
        </div>
      </div>

      {/* Controls Info */}
      <div className="w-full max-w-6xl mt-4">
        <div className="border border-secondary bg-black p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-vt323 text-primary text-sm">
            <div>
              <span className="text-secondary">CLICK IZQ:</span> Seleccionar
            </div>
            <div>
              <span className="text-secondary">CLICK DER:</span> Órdenes
            </div>
            <div>
              <span className="text-secondary">ESC:</span> Menú
            </div>
            <div>
              <span className="text-secondary">F5:</span> Recargar juego
            </div>
          </div>
        </div>
      </div>

      {/* Performance Tips */}
      {!isLoading && !error && (
        <div className="w-full max-w-6xl mt-2">
          <div className="border border-secondary bg-black p-3">
            <div className="font-vt323 text-gray-500 text-xs text-center">
              Rendimiento lento? Cierra otras pestañas • Usa Chrome/Edge •
              Cache del navegador hace las próximas cargas instantáneas
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
