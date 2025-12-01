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

// Función para buscar (Deprecated or needs update, but keeping for compatibility if used elsewhere)
export const searchEstablishments = async (query) => {
  try {
    // Mapping to searchWithFilters since /api/search doesn't exist
    const response = await fetch(`${SEARCH_API_URL}/api/establishments/search/filters?searchText=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Error en la búsqueda');
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Función para buscar con filtros
export const getEstablishmentsWithFilters = async (filters) => {
  try {
    const queryParams = new URLSearchParams();

    if (filters.city && filters.city !== 'todas') queryParams.append('city', filters.city);
    if (filters.foodTypes && filters.foodTypes.length > 0) queryParams.append('foodTypes', filters.foodTypes.join(','));
    if (filters.type && filters.type.length > 0) queryParams.append('type', filters.type.join(',')); // dish types
    if (filters.searchText) queryParams.append('searchText', filters.searchText);

    const response = await fetch(`${SEARCH_API_URL}/api/establishments/search/filters?${queryParams.toString()}`);
    if (!response.ok) throw new Error('Error en la búsqueda con filtros');
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};