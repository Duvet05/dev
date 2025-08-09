'use client'

import { useState } from 'react'

export default function ArtStationTestPage() {
  const [loading, setLoading] = useState(false)

  const testArtstationAPI = async () => {
    try {
      setLoading(true)
      console.log('🎨 Testing Local ArtStation API...')

      const response = await fetch('/api/artstation')
      console.log('📡 Response status:', response.status)

      const data = await response.json()
      console.log('📊 API Response:', data)

      if (Array.isArray(data) && data.length > 0) {
        const firstProject = data[0]
        console.log('🖼️ First Project:', {
          title: firstProject.title,
          hashId: firstProject.hashId,
          user: firstProject.user?.username,
          assets: firstProject.assets?.length,
          coverUrl: firstProject.coverUrl,
        })

        if (firstProject.assets?.length > 0) {
          console.log('📷 First asset preview:', firstProject.assets[0].imageUrl)
        }
      }
    } catch (error) {
      console.error('❌ ArtStation API Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 bg-neutral-950 text-white min-h-screen">
      <h1 className="text-2xl mb-4 font-bold text-purple-400">🧪 ArtStation API Test</h1>

      <button
        onClick={testArtstationAPI}
        className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Cargando...' : 'Test ArtStation API'}
      </button>

      <p className="mt-4 text-sm text-gray-400">
        Abre la consola del navegador para ver los resultados.
      </p>
    </div>
  )
}
