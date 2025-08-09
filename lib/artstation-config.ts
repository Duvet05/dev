// Configuración del portafolio de ArtStation
export const ARTSTATION_CONFIG = {
	// Usuario de ArtStation a mostrar
	username: 'cuadot',

	// ID del usuario de ArtStation
	userId: 175617,

	// Límite de proyectos a cargar (para evitar sobrecarga)
	maxProjects: 10,

	// Configuración de cache (en minutos)
	cacheExpiry: 30,

	// Proyectos a excluir por UID (si hay alguno que no quieres mostrar)
	excludeProjects: [],
}

// Función helper para cambiar fácilmente de usuario
export function updateArtStationUser(newUsername: string) {
	return {
		...ARTSTATION_CONFIG,
		username: newUsername
	}
}
