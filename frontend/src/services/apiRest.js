// services/api.js
const API_BASE_URL = 'http://localhost:3000'; // Para establishments-service
const SEARCH_API_URL = 'http://localhost:3002'; // Para search-service


// Función para obtener establecimientos
export const getEstablishments = async () => {
  try {
    const response = await fetch(`${SEARCH_API_URL}/api/list/`);
    if (!response.ok) throw new Error('Error en la petición');
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

//Funcion para obtener usuarios
export const getUsers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/`);
    if (!response.ok) throw new Error('Error en la petición');
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Función para buscar
export const searchEstablishments = async (query) => {
  try {
    const response = await fetch(`${SEARCH_API_URL}/api/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Error en la búsqueda');
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};