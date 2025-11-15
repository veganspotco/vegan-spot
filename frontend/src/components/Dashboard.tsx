import React, { useState, useEffect } from 'react';
import { Lock, LogOut, Home, Plus, Edit2, Trash2, Upload, BarChart3, MapPin, Camera, Save, X, Eye, Menu, Bell, Search, Filter } from 'lucide-react';

// Interfaces
interface User {
    id: string;
    email: string;
    name: string;
}

interface Establishment {
    id: number;
    name: string;
    city: 'Buga' | 'Tuluá';
    address: string;
    type: 'Vegano' | 'Vegetariano';
    description: string;
    ingredients: string[];
    image: string;
    phone: string;
    hours: string;
    createdAt?: string;
}

interface DashboardProps {
    user?: User;
    onLogout?: () => void;
}

interface FormData {
    name: string;
    city: 'Buga' | 'Tuluá';
    address: string;
    type: 'Vegano' | 'Vegetariano';
    description: string;
    ingredients: string;
    image: string;
    phone: string;
    hours: string;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
    const [currentView, setCurrentView] = useState<'dashboard' | 'establishments'>('dashboard');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Estados para establecimientos
    const [establishments, setEstablishments] = useState<Establishment[]>([
        {
            id: 1,
            name: 'Verde Vida',
            city: 'Buga',
            address: 'Calle 5 #10-20',
            type: 'Vegano',
            description: 'Restaurante 100% vegano con opciones orgánicas',
            ingredients: ['Tofu', 'Quinoa', 'Verduras orgánicas'],
            image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
            phone: '310-555-0101',
            hours: '8:00 AM - 8:00 PM',
            createdAt: '2024-01-15'
        },
        {
            id: 2,
            name: 'Raíces Naturales',
            city: 'Tuluá',
            address: 'Carrera 25 #15-30',
            type: 'Vegetariano',
            description: 'Comida vegetariana tradicional y saludable',
            ingredients: ['Lentejas', 'Champiñones', 'Espinaca'],
            image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400',
            phone: '320-555-0202',
            hours: '7:00 AM - 9:00 PM',
            createdAt: '2024-02-20'
        },
        {
            id: 3,
            name: 'El Jardín Secreto',
            city: 'Buga',
            address: 'Avenida Santander #8-45',
            type: 'Vegano',
            description: 'Cafetería vegana con postres artesanales',
            ingredients: ['Leche de almendras', 'Cacao orgánico', 'Frutas'],
            image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
            phone: '315-555-0303',
            hours: '9:00 AM - 7:00 PM',
            createdAt: '2024-03-10'
        }
    ]);

    const [editingEstablishment, setEditingEstablishment] = useState<Establishment | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCity, setFilterCity] = useState<'all' | 'Buga' | 'Tuluá'>('all');
    const [filterType, setFilterType] = useState<'all' | 'Vegano' | 'Vegetariano'>('all');

    const [formData, setFormData] = useState<FormData>({
        name: '',
        city: 'Buga',
        address: '',
        type: 'Vegetariano',
        description: '',
        ingredients: '',
        image: '',
        phone: '',
        hours: ''
    });

    // Usuario por defecto si no se proporciona
    const currentUser = user || {
        id: '1',
        email: 'admin@veganspot.com',
        name: 'Administrador'
    };

    // Función de logout
    const handleLogout = () => {
        if (onLogout) {
            onLogout();
        } else {
            // Fallback si no se proporciona función de logout
            localStorage.removeItem('authToken');
            window.location.href = '/login';
        }
    };

    // CRUD Functions
    const handleCreate = () => {
        setEditingEstablishment(null);
        setFormData({
            name: '',
            city: 'Buga',
            address: '',
            type: 'Vegetariano',
            description: '',
            ingredients: '',
            image: '',
            phone: '',
            hours: ''
        });
        setShowModal(true);
    };

    const handleEdit = (establishment: Establishment) => {
        setEditingEstablishment(establishment);
        setFormData({
            ...establishment,
            ingredients: establishment.ingredients.join(', ')
        });
        setShowModal(true);
    };

    const handleDelete = (id: number) => {
        if (window.confirm('¿Estás seguro de eliminar este establecimiento?')) {
            setEstablishments(establishments.filter(e => e.id !== id));
        }
    };

    const handleSave = () => {
        const ingredientsArray = formData.ingredients.split(',').map(i => i.trim()).filter(i => i);

        if (!formData.name || !formData.address || !formData.description) {
            alert('Por favor completa todos los campos requeridos');
            return;
        }

        if (editingEstablishment) {
            // Editar existente
            setEstablishments(establishments.map(e =>
                e.id === editingEstablishment.id
                    ? { ...formData, id: e.id, ingredients: ingredientsArray, createdAt: e.createdAt }
                    : e
            ));
        } else {
            // Crear nuevo
            const newEstablishment: Establishment = {
                ...formData,
                id: Math.max(...establishments.map(e => e.id), 0) + 1,
                ingredients: ingredientsArray,
                createdAt: new Date().toISOString().split('T')[0]
            };
            setEstablishments([...establishments, newEstablishment]);
        }
        setShowModal(false);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, image: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    // Filtrar establecimientos
    const filteredEstablishments = establishments.filter(est => {
        const matchesSearch = est.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            est.address.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCity = filterCity === 'all' || est.city === filterCity;
        const matchesType = filterType === 'all' || est.type === filterType;
        return matchesSearch && matchesCity && matchesType;
    });

    // Estadísticas
    const stats = {
        total: establishments.length,
        buga: establishments.filter(e => e.city === 'Buga').length,
        tulua: establishments.filter(e => e.city === 'Tuluá').length,
        vegano: establishments.filter(e => e.type === 'Vegano').length,
        vegetariano: establishments.filter(e => e.type === 'Vegetariano').length
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo y título */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                            >
                                <Menu className="w-6 h-6 text-gray-600" />
                            </button>
                            <div className="bg-green-600 w-10 h-10 rounded-lg flex items-center justify-center">
                                <Home className="w-6 h-6 text-white" />
                            </div>
                            <div className="hidden sm:block">
                                <h1 className="text-xl font-bold text-gray-800">Panel Administrativo</h1>
                                <p className="text-xs text-gray-500">Vegan Spot - Buga & Tuluá</p>
                            </div>
                        </div>

                        {/* Usuario y acciones */}
                        <div className="flex items-center gap-3">
                            <button className="p-2 hover:bg-gray-100 rounded-lg relative hidden sm:block">
                                <Bell className="w-5 h-5 text-gray-600" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>

                            <div className="hidden sm:flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
                                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                                    <span className="text-white text-sm font-semibold">
                                        {currentUser.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div className="hidden lg:block">
                                    <p className="text-sm font-medium text-gray-800">{currentUser.name}</p>
                                    <p className="text-xs text-gray-500">{currentUser.email}</p>
                                </div>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="hidden sm:inline">Salir</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Navigation Tabs */}
                <div className="bg-white rounded-lg shadow-sm p-2 mb-6 flex gap-2 overflow-x-auto">
                    <button
                        onClick={() => setCurrentView('dashboard')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition whitespace-nowrap ${currentView === 'dashboard'
                                ? 'bg-green-100 text-green-700 font-medium'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        <BarChart3 className="w-4 h-4" />
                        Dashboard
                    </button>
                    <button
                        onClick={() => setCurrentView('establishments')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition whitespace-nowrap ${currentView === 'establishments'
                                ? 'bg-green-100 text-green-700 font-medium'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        <MapPin className="w-4 h-4" />
                        Establecimientos ({establishments.length})
                    </button>
                </div>

                {/* Dashboard View */}
                {currentView === 'dashboard' && (
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
                                    {((stats.buga / stats.total) * 100).toFixed(0)}% del total
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
                                    {((stats.tulua / stats.total) * 100).toFixed(0)}% del total
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
                                                style={{ width: `${(stats.vegano / stats.total) * 100}%` }}
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
                                                style={{ width: `${(stats.vegetariano / stats.total) * 100}%` }}
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
                                        <img src={est.image} alt={est.name} className="w-full h-32 object-cover" />
                                        <div className="p-3">
                                            <h4 className="font-semibold text-gray-800 mb-1">{est.name}</h4>
                                            <p className="text-xs text-gray-500">{est.city}</p>
                                            <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs ${est.type === 'Vegano' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                {est.type}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Establishments View */}
                {currentView === 'establishments' && (
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
                                    <option value="Tuluá">Tuluá</option>
                                </select>

                                <select
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value as any)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="all">Todos los tipos</option>
                                    <option value="Vegano">Vegano</option>
                                    <option value="Vegetariano">Vegetariano</option>
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
                                                src={establishment.image}
                                                alt={establishment.name}
                                                className="w-full h-48 object-cover"
                                            />
                                            <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium shadow-lg ${establishment.type === 'Vegano'
                                                    ? 'bg-green-500 text-white'
                                                    : 'bg-blue-500 text-white'
                                                }`}>
                                                {establishment.type}
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
                                                {establishment.ingredients.slice(0, 3).map((ing, idx) => (
                                                    <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                                        {ing}
                                                    </span>
                                                ))}
                                                {establishment.ingredients.length > 3 && (
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
                                                    onClick={() => handleDelete(establishment.id)}
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
                )}
            </div>

            {/* Modal para Crear/Editar */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8">
                        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-2xl">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">
                                    {editingEstablishment ? 'Editar Establecimiento' : 'Nuevo Establecimiento'}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    {editingEstablishment ? 'Actualiza la información del lugar' : 'Completa los datos del nuevo lugar'}
                                </p>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-5 max-h-[calc(100vh-200px)] overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nombre del Establecimiento *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="Ej: Verde Vida"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Ciudad *</label>
                                    <select
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value as 'Buga' | 'Tuluá' })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    >
                                        <option value="Buga">Buga</option>
                                        <option value="Tuluá">Tuluá</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Tipo *</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value as 'Vegano' | 'Vegetariano' })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    >
                                        <option value="Vegetariano">Vegetariano</option>
                                        <option value="Vegano">Vegano</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Dirección Completa *
                                </label>
                                <input
                                    type="text"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Ej: Calle 5 #10-20"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Descripción *
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    rows={3}
                                    placeholder="Describe el establecimiento, su ambiente, especialidades..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ingredientes Principales
                                </label>
                                <input
                                    type="text"
                                    value={formData.ingredients}
                                    onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Separados por coma: Tofu, Quinoa, Verduras orgánicas"
                                />
                                <p className="text-xs text-gray-500 mt-1">Separa cada ingrediente con una coma</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Teléfono de Contacto
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="310-555-0000"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Horario de Atención
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.hours}
                                        onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="8:00 AM - 8:00 PM"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Imagen del Establecimiento
                                </label>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <label className="flex-1 cursor-pointer">
                                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-green-500 transition text-center">
                                                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                                <p className="text-sm text-gray-600">
                                                    <span className="text-green-600 font-medium">Subir imagen</span> o arrastra aquí
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">PNG, JPG hasta 5MB</p>
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>

                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Camera className="w-5 h-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            value={formData.image}
                                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            placeholder="O pega la URL de una imagen"
                                        />
                                    </div>

                                    {formData.image && (
                                        <div className="relative">
                                            <img
                                                src={formData.image}
                                                alt="Preview"
                                                className="w-full h-48 object-cover rounded-lg border border-gray-200"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Imagen+no+disponible';
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, image: '' })}
                                                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex gap-3 border-t rounded-b-2xl">
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-medium"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 transition font-medium shadow-md"
                            >
                                <Save className="w-4 h-4" />
                                {editingEstablishment ? 'Actualizar' : 'Guardar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard