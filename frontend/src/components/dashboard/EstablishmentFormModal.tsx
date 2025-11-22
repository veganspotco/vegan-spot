import React from 'react';
import { X, Upload, Camera, Save } from 'lucide-react';
import { Establishment } from '../../services/establishmentService';
import { EstablishmentFormState } from './types';

interface EstablishmentFormModalProps {
    showModal: boolean;
    setShowModal: (show: boolean) => void;
    editingEstablishment: Establishment | null;
    formData: EstablishmentFormState;
    setFormData: (data: EstablishmentFormState) => void;
    handleSave: () => void;
}

const EstablishmentFormModal: React.FC<EstablishmentFormModalProps> = ({
    showModal,
    setShowModal,
    editingEstablishment,
    formData,
    setFormData,
    handleSave
}) => {
    if (!showModal) return null;

    return (
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
                                onChange={(e) => setFormData({ ...formData, city: e.target.value as 'Buga' | 'Tulua' })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            >
                                <option value="Buga">Buga</option>
                                <option value="Tulua">Tuluá</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo *</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'vegan' | 'vegetarian' })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            >
                                <option value="vegetarian">Vegetariano</option>
                                <option value="vegan">Vegano</option>
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
                            disabled
                            type="text"
                            //={formData.ingredients}
                            //={(e) => setFormData({ ...formData, ingredients: e.target.value })}
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
                                disabled
                                type="text"
                                //value={formData.hours}
                                //={(e) => setFormData({ ...formData, hours: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="8:00 AM - 8:00 PM"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="email@domain.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Web
                            </label>
                            <input
                                type="url"
                                value={formData.website}
                                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="https://www.domain.com"
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
                                        //onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Camera className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    disabled
                                    type="text"
                                    //value={formData.image}
                                    //onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="O pega la URL de una imagen"
                                />
                            </div>

                            {/* {formData.image && (
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
                            )} */}
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
    );
};

export default EstablishmentFormModal;
