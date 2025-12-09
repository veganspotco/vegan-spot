import React, { useState, useEffect } from 'react';
import { useAuth } from './context/authContext';
import { BarChart3, MapPin } from 'lucide-react';
import { establishmentService, Establishment } from '../services/establishmentService';
import DashboardHeader from './dashboard/DashboardHeader';
import StatsOverview from './dashboard/StatsOverview';
import EstablishmentList from './dashboard/EstablishmentList';
import EstablishmentFormModal from './dashboard/EstablishmentFormModal';
import { User, EstablishmentFormState } from './dashboard/types';

interface DashboardProps {
    user?: User;
    onLogout?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
    const [currentView, setCurrentView] = useState<'dashboard' | 'establishments'>('dashboard');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Estados para establecimientos
    const [establishments, setEstablishments] = useState<Establishment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [editingEstablishment, setEditingEstablishment] = useState<Establishment | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCity, setFilterCity] = useState<'all' | 'Buga' | 'Tuluá'>('all');
    const [filterType, setFilterType] = useState<'all' | 'vegan' | 'vegetarian'>('all');

    const [formData, setFormData] = useState<EstablishmentFormState>({
        name: '',
        email: '',
        website: '',
        city: 'Buga',
        address: '',
        type: 'vegetarian',
        description: '',
        //ingredients: '',
        //image: '',
        phone: '',
        //hours: '',
        menu: [],
        images: [],
        opening_hours: {}
    });

    const { user: authUser } = useAuth();

    // Usuario por defecto si no se proporciona
    const currentUser = authUser || user || {
        id: '1',
        email: 'admin@veganspot.com',
        name: 'Administrador'
    };

    // Cargar establecimientos al iniciar
    useEffect(() => {
        loadEstablishments();
    }, []);

    const loadEstablishments = async () => {
        try {
            setLoading(true);
            const data = await establishmentService.getAll();
            setEstablishments(data);
            setError(null);
        } catch (err) {
            console.error('Error loading establishments:', err);
            setError('Error al cargar los establecimientos');
        } finally {
            setLoading(false);
        }
    };

    // Función de logout
    const handleLogout = () => {
        if (onLogout) {
            onLogout();
        } else {
            // Fallback si no se proporciona función de logout
            localStorage.removeItem('authToken');
            window.location.href = '/';
        }
    };

    // CRUD Functions
    const handleCreate = () => {
        setEditingEstablishment(null);
        setFormData({
            name: '',
            email: '',
            website: '',
            city: 'Buga',
            address: '',
            type: 'vegetarian',
            description: '',
            //ingredients: '',
            //image: '',
            phone: '',
            //hours: '',
            menu: [],
            images: [],
            opening_hours: {}
        });
        setShowModal(true);
    };

    const handleEdit = (establishment: Establishment) => {
        setEditingEstablishment(establishment);
        setFormData({
            name: establishment.name,
            email: establishment.email,
            website: establishment.website,
            city: establishment.city,
            address: establishment.address,
            type: establishment.type,
            description: establishment.description,
            //ingredients: establishment.ingredients ? establishment.ingredients.join(', ') : '',
            //image: establishment.image || '',
            phone: establishment.phone || '',
            //hours: establishment.opening_hours || '',
            menu: establishment.menu || [],
            images: establishment.images || [],
            opening_hours: establishment.opening_hours || {}
        });
        setShowModal(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('¿Estás seguro de eliminar este establecimiento?')) {
            try {
                await establishmentService.delete(id);
                await loadEstablishments(); // Recargar lista
            } catch (err) {
                console.error('Error deleting establishment:', err);
                alert('Error al eliminar el establecimiento');
            }
        }
    };

    const handleSave = async () => {
        //const ingredientsArray = formData.ingredients.split(',').map(i => i.trim()).filter(i => i);

        if (!formData.name || !formData.address || !formData.description) {
            alert('Por favor completa todos los campos requeridos');
            return;
        }

        try {
            const establishmentData: Establishment = {
                name: formData.name,
                email: formData.email || null,
                website: formData.website || null,
                city: formData.city,
                address: formData.address,
                type: formData.type,
                description: formData.description,
                //ingredients: ingredientsArray,
                //image: formData.image,
                phone: formData.phone || null,
                //opening_hours: formData.hours,
                menu: formData.menu,
                images: formData.images.filter(img => img.trim() !== ''),
                opening_hours: Object.keys(formData.opening_hours).length > 0 ? formData.opening_hours : null
            };

            // Log de datos para depuración
            console.log('Payload to send:', establishmentData);

            if (editingEstablishment && editingEstablishment.id) {
                // Editar existente
                await establishmentService.update(editingEstablishment.id, establishmentData);
            } else {
                // Crear nuevo
                await establishmentService.create(establishmentData, currentUser.id);
            }

            await loadEstablishments(); // Recargar lista
            setShowModal(false);
        } catch (err) {
            console.error('Error saving establishment:', err);
            alert('Error al guardar el establecimiento');
        }
    };

    /*const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, image: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };*/

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
        tulua: establishments.filter(e => e.city === 'Tulua').length,
        vegano: establishments.filter(e => e.type === 'vegan').length,
        vegetariano: establishments.filter(e => e.type === 'vegetarian').length
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <DashboardHeader
                user={currentUser}
                onLogout={handleLogout}
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
            />

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

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 p-4 rounded-lg text-red-600 text-center">
                        {error}
                    </div>
                ) : (
                    <>
                        {/* Dashboard View */}
                        {currentView === 'dashboard' && (
                            <StatsOverview
                                stats={stats}
                                establishments={establishments}
                                setCurrentView={setCurrentView}
                            />
                        )}

                        {/* Establishments View */}
                        {currentView === 'establishments' && (
                            <EstablishmentList
                                filteredEstablishments={filteredEstablishments}
                                searchTerm={searchTerm}
                                setSearchTerm={setSearchTerm}
                                filterCity={filterCity}
                                setFilterCity={setFilterCity}
                                filterType={filterType}
                                setFilterType={setFilterType}
                                handleCreate={handleCreate}
                                handleEdit={handleEdit}
                                handleDelete={handleDelete}
                            />
                        )}
                    </>
                )}
            </div>

            {/* Modal para Crear/Editar */}
            <EstablishmentFormModal
                showModal={showModal}
                setShowModal={setShowModal}
                editingEstablishment={editingEstablishment}
                formData={formData}
                setFormData={setFormData}
                handleSave={handleSave}
            />
        </div>
    );
};

export default Dashboard;