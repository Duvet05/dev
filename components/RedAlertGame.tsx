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

export default function RedAlertGame() {
  const containerRef = useRef<HTMLDivElement>(null)
  const dosInstanceRef = useRef<DosInstance | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const loadGame = async () => {
      if (!containerRef.current) return

      try {
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
            // Crear instancia de DOS
            const dos = window.Dos(containerRef.current, {
              url: "https://cdn.jsdelivr.net/npm/js-dos@8.xx/dist/"
            })

            // Iniciar el juego
            // NOTA: Necesitas proporcionar tu propio archivo .jsdos
            const instance = await dos.run("/games/redalert.jsdos")
            dosInstanceRef.current = instance
            setIsLoading(false)
          } catch (err) {
            console.error("Error al iniciar el juego:", err)
            setError(
              "Error al cargar el juego. Asegúrate de que el archivo redalert.jsdos existe en /public/games/"
            )
            setIsLoading(false)
          }
        }

        script.onerror = () => {
          setError("Error al cargar la librería js-dos")
          setIsLoading(false)
        }

        document.head.appendChild(script)

        return () => {
          // Cleanup
          if (dosInstanceRef.current) {
            dosInstanceRef.current.exit()
          }
          document.head.removeChild(script)
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

  return (
    <div className="w-full h-full min-h-screen bg-black flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="w-full max-w-6xl mb-4">
        <div className="border border-secondary bg-black p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl md:text-4xl font-bold text-primary font-vt323">
              COMMAND & CONQUER: RED ALERT
            </h1>
            <button
              onClick={toggleFullscreen}
              className="px-4 py-2 border border-secondary text-primary hover:bg-primary hover:text-black transition-colors font-vt323 text-lg"
            >
              {isFullscreen ? "EXIT FULLSCREEN" : "FULLSCREEN"}
            </button>
          </div>
        </div>
      </div>

      {/* Game Container */}
      <div className="w-full max-w-6xl flex-1">
        <div className="border border-secondary bg-black relative" style={{ minHeight: "600px" }}>
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-10">
              <div className="text-primary text-2xl font-vt323 mb-4">LOADING...</div>
              <div className="w-64 h-2 border border-secondary">
                <div className="h-full bg-primary animate-pulse" style={{ width: "50%" }}></div>
              </div>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-10 p-8">
              <div className="text-red-500 text-xl font-vt323 mb-4 text-center">ERROR</div>
              <div className="text-primary font-vt323 text-center max-w-lg mb-6">{error}</div>
              <div className="border border-secondary p-4 text-primary font-vt323 text-sm">
                <p className="mb-2">Para hacer funcionar el juego:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Crea la carpeta /public/games/</li>
                  <li>Consigue el archivo redalert.jsdos</li>
                  <li>Colócalo en /public/games/redalert.jsdos</li>
                </ol>
                <p className="mt-4 text-xs">
                  Ver README.md para instrucciones detalladas de cómo obtener el archivo del juego.
                </p>
              </div>
            </div>
          )}

          <div ref={containerRef} className="w-full h-full min-h-[600px]"></div>
        </div>
      </div>

      {/* Controls Info */}
      <div className="w-full max-w-6xl mt-4">
        <div className="border border-secondary bg-black p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-vt323 text-primary text-sm">
            <div>
              <span className="text-secondary">CLICK IZQUIERDO:</span> Seleccionar
            </div>
            <div>
              <span className="text-secondary">CLICK DERECHO:</span> Dar órdenes
            </div>
            <div>
              <span className="text-secondary">ESC:</span> Menú
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
