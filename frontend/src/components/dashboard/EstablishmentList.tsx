import React from 'react';
import { Plus, Search, MapPin, Edit2, Trash2 } from 'lucide-react';
import { Establishment } from '../../services/establishmentService';

interface EstablishmentListProps {
    filteredEstablishments: Establishment[];
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    filterCity: 'all' | 'Buga' | 'Tuluá';
    setFilterCity: (city: 'all' | 'Buga' | 'Tuluá') => void;
    filterType: 'all' | 'vegan' | 'vegetarian';
    setFilterType: (type: 'all' | 'vegan' | 'vegetarian') => void;
    handleCreate: () => void;
    handleEdit: (establishment: Establishment) => void;
    handleDelete: (id: number) => void;
}

const EstablishmentList: React.FC<EstablishmentListProps> = ({
    filteredEstablishments,
    searchTerm,
    setSearchTerm,
    filterCity,
    setFilterCity,
    filterType,
    setFilterType,
    handleCreate,
    handleEdit,
    handleDelete
}) => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Gestión de Establecimientos</h2>
                    <p className="text-gray-600 mt-1">{filteredEstablishments.length} lugares encontrados</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition shadow-md"
                >
                    <Plus className="w-4 h-4" />
                    Nuevo Lugar
                </button>
            </div>

            {/* Filtros y búsqueda */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Buscar por nombre o dirección..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <select
                        value={filterCity}
                        onChange={(e) => setFilterCity(e.target.value as any)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                        <option value="all">Todas las ciudades</option>
                        <option value="Buga">Buga</option>
                        <option value="Tulua">Tulua</option>
                    </select>

                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value as any)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                        <option value="all">Todos los tipos</option>
                        <option value="vegan">Vegano</option>
                        <option value="vegetarian">Vegetariano</option>
                    </select>
                </div>
            </div>

            {/* Lista de establecimientos */}
            {filteredEstablishments.length === 0 ? (
                <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-200 text-center">
                    <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No se encontraron lugares</h3>
                    <p className="text-gray-600 mb-4">Intenta con otros filtros o agrega un nuevo lugar</p>
                    <button
                        onClick={handleCreate}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                    >
                        Agregar Primer Lugar
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEstablishments.map(establishment => (
                        <div key={establishment.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all">
                            <div className="relative">
                                <img
                                    src={establishment.image || 'https://via.placeholder.com/400x300?text=No+Image'}
                                    alt={establishment.name}
                                    className="w-full h-48 object-cover"
                                />
                                <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium shadow-lg ${establishment.type === 'vegan'
                                    ? 'bg-green-500 text-white'
                                    : 'bg-blue-500 text-white'
                                    }`}>
                                    {establishment.type === 'vegan' ? 'Vegano' : 'Vegetariano'}
                                </span>
                            </div>

                            <div className="p-5">
                                <div className="mb-3">
                                    <h3 className="text-xl font-bold text-gray-800 mb-1">{establishment.name}</h3>
                                    <p className="text-sm text-gray-500 flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />
                                        {establishment.city}
                                    </p>
                                </div>

                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{establishment.description}</p>

                                <div className="space-y-2 mb-4 text-sm">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <MapPin className="w-4 h-4 flex-shrink-0" />
                                        <span className="line-clamp-1">{establishment.address}</span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-1 mb-4">
                                    {establishment.ingredients && establishment.ingredients.slice(0, 3).map((ing, idx) => (
                                        <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                            {ing}
                                        </span>
                                    ))}
                                    {establishment.ingredients && establishment.ingredients.length > 3 && (
                                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                            +{establishment.ingredients.length - 3}
                                        </span>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(establishment)}
                                        className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100 transition text-sm font-medium"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(establishment.id!)}
                                        className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100 transition text-sm font-medium"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EstablishmentList;
