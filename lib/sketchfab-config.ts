// Configuración del portafolio de Sketchfab
export const SKETCHFAB_CONFIG = {
  // Usuario de Sketchfab a mostrar
  username: 'cuadot', // Si este usuario no funciona, se usará el fallback
  
  // Límite de modelos a cargar (para evitar sobrecarga)
  maxModels: 10,
  
  // Configuración de cache (en minutos)
  cacheExpiry: 30,
  
  // Modelos a excluir por UID (si hay alguno que no quieres mostrar)
  excludeModels: [],
  
  // Configuración de fallback si falla la API
  fallbackProjects: [
    {
      title: "RACING_CAR.DEMO",
      source: "SKETCHFAB",
      description: "High-performance sports car with detailed modeling and realistic PBR materials",
      date: "2024.07.28",
      fileSize: "25.4MB",
      renderTime: "Live",
      complexity: "HIGH",
      sketchfabUid: "acccd15d4e454399a39dbe40f4f6df71",
      categories: ["vehicle"],
      tags: ["car", "racing", "demo"],
      thumbnails: {
        small: "https://via.placeholder.com/200x200/333333/ffffff?text=TEST1",
        medium: "https://via.placeholder.com/640x360/666666/ffffff?text=TEST2", 
        large: "https://via.placeholder.com/1024x576/999999/ffffff?text=TEST3"
      }
    },
    {
      title: "WOODTOY_HORSE.DEMO",
      source: "SKETCHFAB",
      description: "Charming wooden toy horse made in Blender with Substance Painter textures",
      date: "2020.05.17",
      fileSize: "8.2MB",
      renderTime: "Live",
      complexity: "MEDIUM",
      sketchfabUid: "e114132dd22b43b5be17ae543697c9e8",
      categories: ["toy"],
      tags: ["horse", "wood", "blender"],
      thumbnails: {
        small: "https://via.placeholder.com/200x200/444444/ffffff?text=HORSE1",
        medium: "https://via.placeholder.com/640x360/777777/ffffff?text=HORSE2",
        large: "https://via.placeholder.com/1024x576/aaaaaa/ffffff?text=HORSE3"
      }
    }
  ]
}

// Función helper para cambiar fácilmente de usuario
export function updateSketchfabUser(newUsername: string) {
  return {
    ...SKETCHFAB_CONFIG,
    username: newUsername
  }
}
