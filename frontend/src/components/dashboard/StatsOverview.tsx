import React from 'react';
import { Plus, MapPin, Home, BarChart3 } from 'lucide-react';
import { Establishment } from '../../services/establishmentService';

interface StatsOverviewProps {
    stats: {
        total: number;
        buga: number;
        tulua: number;
        vegano: number;
        vegetariano: number;
    };
    establishments: Establishment[];
    setCurrentView: (view: 'dashboard' | 'establishments') => void;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ stats, establishments, setCurrentView }) => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Estadísticas del Sistema</h2>
                    <p className="text-gray-600 mt-1">Resumen general de establecimientos</p>
                </div>
                <button
                    onClick={() => setCurrentView('establishments')}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                    <Plus className="w-4 h-4" />
                    Agregar Lugar
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-600 font-medium">Total de Lugares</h3>
                        <div className="bg-blue-100 p-3 rounded-lg">
                            <MapPin className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                    <p className="text-4xl font-bold text-gray-800">{stats.total}</p>
                    <p className="text-sm text-gray-500 mt-2">Establecimientos registrados</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-600 font-medium">Buga</h3>
                        <div className="bg-green-100 p-3 rounded-lg">
                            <Home className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                    <p className="text-4xl font-bold text-gray-800">{stats.buga}</p>
                    <p className="text-sm text-gray-500 mt-2">
                        {stats.total > 0 ? ((stats.buga / stats.total) * 100).toFixed(0) : 0}% del total
                    </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-600 font-medium">Tuluá</h3>
                        <div className="bg-purple-100 p-3 rounded-lg">
                            <Home className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                    <p className="text-4xl font-bold text-gray-800">{stats.tulua}</p>
                    <p className="text-sm text-gray-500 mt-2">
                        {stats.total > 0 ? ((stats.tulua / stats.total) * 100).toFixed(0) : 0}% del total
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Distribución por tipo */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-green-600" />
                        Distribución por Tipo
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-700 font-medium">Vegano</span>
                                <span className="text-gray-900 font-bold">{stats.vegano}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                    className="bg-green-500 h-3 rounded-full transition-all duration-500"
                                    style={{ width: `${stats.total > 0 ? (stats.vegano / stats.total) * 100 : 0}%` }}
                                ></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-700 font-medium">Vegetariano</span>
                                <span className="text-gray-900 font-bold">{stats.vegetariano}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                    className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                                    style={{ width: `${stats.total > 0 ? (stats.vegetariano / stats.total) * 100 : 0}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Resumen rápido */}
                <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl shadow-lg text-white">
                    <h3 className="text-lg font-semibold mb-3">Resumen del Sistema</h3>
                    <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between py-2 border-b border-green-400">
                            <span className="text-green-100">Total Establecimientos</span>
                            <span className="font-bold text-xl">{stats.total}</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-green-400">
                            <span className="text-green-100">Ciudades Activas</span>
                            <span className="font-bold text-xl">2</span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <span className="text-green-100">Último Agregado</span>
                            <span className="font-bold">Hoy</span>
                        </div>
                    </div>
                    <button
                        onClick={() => setCurrentView('establishments')}
                        className="w-full bg-white text-green-600 px-4 py-3 rounded-lg hover:bg-green-50 transition font-medium shadow-md"
                    >
                        Ver Todos los Lugares
                    </button>
                </div>
            </div>

            {/* Últimos agregados */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Últimos Lugares Agregados</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {establishments.slice(0, 3).map(est => (
                        <div key={est.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition">
                            <img src={est.image || 'https://via.placeholder.com/400x300?text=No+Image'} alt={est.name} className="w-full h-32 object-cover" />
                            <div className="p-3">
                                <h4 className="font-semibold text-gray-800 mb-1">{est.name}</h4>
                                <p className="text-xs text-gray-500">{est.city}</p>
                                <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs ${est.type === 'vegan' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                    }`}>
                                    {est.type === 'vegan' ? 'Vegano' : 'Vegetariano'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StatsOverview;
