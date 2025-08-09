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
}

// Función helper para cambiar fácilmente de usuario
export function updateSketchfabUser(newUsername: string) {
  return {
    ...SKETCHFAB_CONFIG,
    username: newUsername
  }
}
