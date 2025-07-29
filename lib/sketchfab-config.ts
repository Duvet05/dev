// Configuración del portafolio de Sketchfab
export const SKETCHFAB_CONFIG = {
  // Usuario de Sketchfab a mostrar
  username: 'cuadot',
  
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
      type: "VEHICLE",
      status: "ACTIVE",
      description: "High-performance sports car with detailed modeling and realistic PBR materials",
      tech: ["SKETCHFAB", "PBR", "WEBGL"],
      sketchfabUid: "acccd15d4e454399a39dbe40f4f6df71",
      date: "2024.07.28",
      fileSize: "25.4MB",
      renderTime: "Live",
      complexity: "HIGH"
    },
    {
      title: "WOODTOY_HORSE.DEMO",
      type: "TOY", 
      status: "COMPLETE",
      description: "Charming wooden toy horse made in Blender with Substance Painter textures",
      tech: ["BLENDER", "SUBSTANCE", "PBR", "SKETCHFAB"],
      sketchfabUid: "e114132dd22b43b5be17ae543697c9e8",
      date: "2020.05.17",
      fileSize: "8.2MB",
      renderTime: "Live",
      complexity: "MEDIUM"
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
