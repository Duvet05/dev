export default function TestPage() {
  const testAPI = async () => {
    try {
      console.log('🚀 Testing Sketchfab API...')
      
      const response = await fetch('https://api.sketchfab.com/v3/models?user=cuadot&count=2', {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (compatible; 3D-Portfolio/1.0)'
        }
      })
      
      console.log('📡 Response status:', response.status)
      console.log('📡 Response OK:', response.ok)
      
      const data = await response.json()
      console.log('📊 API Response:', data)
      console.log('📈 Results count:', data.results?.length || 0)
      
      if (data.results && data.results.length > 0) {
        const firstModel = data.results[0]
        console.log('🎨 First model:', {
          uid: firstModel.uid,
          name: firstModel.name,
          thumbnails: firstModel.thumbnails
        })
        
        if (firstModel.thumbnails?.images) {
          console.log('🖼️ Thumbnail images:', firstModel.thumbnails.images.map((img: any) => ({
            url: img.url,
            width: img.width,
            height: img.height
          })))
        }
      }
    } catch (error) {
      console.error('❌ Error:', error)
    }
  }

  const testLocalAPI = async () => {
    try {
      console.log('🏠 Testing Local API...')
      
      const response = await fetch('/api/sketchfab-models?username=cuadot&page=1&limit=2')
      const data = await response.json()
      
      console.log('🏠 Local API Response:', data)
      
      if (data.projects && data.projects.length > 0) {
        console.log('🎨 First project:', data.projects[0])
        console.log('🖼️ First project thumbnails:', data.projects[0].thumbnails)
      }
    } catch (error) {
      console.error('❌ Local API Error:', error)
    }
  }

  return (
    <div className="p-8 bg-black text-white min-h-screen">
      <h1 className="text-2xl mb-4">API Test Page</h1>
      
      <div className="space-y-4">
        <button 
          onClick={testAPI}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
          Test Sketchfab API Direct
        </button>
        
        <button 
          onClick={testLocalAPI}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded ml-4"
        >
          Test Local API
        </button>
      </div>
      
      <div className="mt-4 text-sm text-gray-400">
        Check browser console for results
      </div>
    </div>
  )
}
