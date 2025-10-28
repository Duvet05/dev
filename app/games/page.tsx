"use client"

import { useEffect, useRef, useState } from "react"

// Definir tipos para js-dos
interface DosInstance {
  exit: () => void
}

declare global {
  interface Window {
    Dos: (element: HTMLDivElement, config?: { url?: string }) => DosInstance
    emulators: {
      pathPrefix: string
    }
  }
}

export default function GamesPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const dosInstanceRef = useRef<DosInstance | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [isStarted, setIsStarted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Configurar path de emuladores
    window.emulators = {
      pathPrefix: "/js-dos/emulators/"
    }

    // Cargar CSS
    const cssLink = document.createElement("link")
    cssLink.rel = "stylesheet"
    cssLink.href = "/js-dos/js-dos.css"
    document.head.appendChild(cssLink)

    // Cargar script
    const script = document.createElement("script")
    script.src = "/js-dos/js-dos.js"
    script.async = false

    script.onload = () => {
      console.log("js-dos cargado correctamente")
      setIsReady(true)
    }

    script.onerror = () => {
      console.error("Error al cargar js-dos")
      setError("Error al cargar js-dos")
    }

    document.head.appendChild(script)

    return () => {
      if (dosInstanceRef.current) {
        try {
          dosInstanceRef.current.exit()
        } catch (e) {
          console.error("Error al cerrar DOS:", e)
        }
      }
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
      if (document.head.contains(cssLink)) {
        document.head.removeChild(cssLink)
      }
    }
  }, [])

  const startGame = async () => {
    if (!containerRef.current || !window.Dos || dosInstanceRef.current) return

    try {
      console.log("Inicializando js-dos con audio...")

      // CRÍTICO: Crear y desbloquear AudioContext ANTES de js-dos
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
      const audioContext = new AudioContextClass()

      console.log("AudioContext state:", audioContext.state)

      if (audioContext.state === 'suspended') {
        await audioContext.resume()
        console.log("AudioContext resumed:", audioContext.state)
      }

      // Pequeña pausa para asegurar que el audio esté listo
      await new Promise(resolve => setTimeout(resolve, 100))

      // Crear instancia de js-dos
      console.log("Creando instancia de Dos...")
      dosInstanceRef.current = window.Dos(containerRef.current, {
        url: "/games/redalert-v5.jsdos"
      })

      console.log("Dos instance created:", dosInstanceRef.current)
      setIsStarted(true)

    } catch (err) {
      console.error("Error al inicializar:", err)
      setError(`Error: ${err instanceof Error ? err.message : 'Desconocido'}`)
    }
  }

  return (
    <div className="w-full h-screen bg-black relative">
      {/* Botón de inicio */}
      {isReady && !isStarted && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
          <div className="text-center">
            <button
              onClick={startGame}
              className="px-16 py-8 text-4xl font-bold bg-gradient-to-r from-green-400 to-green-600 text-white border-4 border-green-400 hover:from-green-500 hover:to-green-700 hover:border-green-300 transition-all cursor-pointer shadow-2xl hover:shadow-green-400/80 font-mono rounded-lg transform hover:scale-105 active:scale-95 animate-pulse"
              style={{
                textShadow: '0 0 10px rgba(0,255,0,0.5), 0 0 20px rgba(0,255,0,0.3)',
                boxShadow: '0 0 30px rgba(74,222,128,0.6), 0 0 60px rgba(74,222,128,0.4), inset 0 0 20px rgba(255,255,255,0.1)'
              }}
            >
              ▶ CLICK PARA INICIAR CON AUDIO
            </button>
            <p className="mt-8 text-green-400 font-mono text-lg bg-black/50 px-6 py-3 rounded border border-green-400/30">
              ⚠️ El audio requiere interacción del usuario
            </p>
            <p className="mt-4 text-gray-400 font-mono text-sm">
              Haz clic en el botón verde para activar el sonido
            </p>
          </div>
        </div>
      )}

      {/* Mensaje de carga inicial */}
      {!isReady && !error && (
        <div className="absolute inset-0 flex items-center justify-center text-green-500 text-2xl font-mono">
          Cargando js-dos...
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-red-500 text-xl font-mono text-center p-8">
            <p className="mb-4">ERROR</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Instrucciones después de iniciar */}
      {isStarted && (
        <div className="absolute top-5 left-1/2 transform -translate-x-1/2 z-40 bg-black/80 border border-green-500 px-6 py-3 text-green-500 font-mono text-sm">
          Audio activado - Si no escuchas sonido, verifica el volumen del navegador o presiona F1 en el juego
        </div>
      )}

      {/* Contenedor del juego */}
      <div ref={containerRef} className="w-full h-full"></div>
    </div>
  )
}
