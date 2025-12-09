import React from 'react';
import { X, Upload, Camera, Save, Plus, Trash2 } from 'lucide-react';
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

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Horario de Atención
                            </label>
                            <div className="space-y-2 border rounded-lg p-4 bg-gray-50 max-h-60 overflow-y-auto">
                                {[
                                    { key: 'monday', label: 'Lunes' },
                                    { key: 'tuesday', label: 'Martes' },
                                    { key: 'wednesday', label: 'Miércoles' },
                                    { key: 'thursday', label: 'Jueves' },
                                    { key: 'friday', label: 'Viernes' },
                                    { key: 'saturday', label: 'Sábado' },
                                    { key: 'sunday', label: 'Domingo' }
                                ].map((day) => {
                                    const isOpen = !!formData.opening_hours?.[day.key];
                                    return (
                                        <div key={day.key} className="flex items-center gap-4">
                                            <div className="w-24">
                                                <label className="inline-flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={isOpen}
                                                        onChange={(e) => {
                                                            const newHours = { ...formData.opening_hours };
                                                            if (e.target.checked) {
                                                                newHours[day.key] = { open: '09:00', close: '18:00' };
                                                            } else {
                                                                delete newHours[day.key];
                                                            }
                                                            setFormData({ ...formData, opening_hours: newHours });
                                                        }}
                                                        className="rounded text-green-600 focus:ring-green-500 h-4 w-4"
                                                    />
                                                    <span className="ml-2 text-sm text-gray-700">{day.label}</span>
                                                </label>
                                            </div>
                                            {isOpen ? (
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="time"
                                                        value={formData.opening_hours[day.key]?.open || ''}
                                                        onChange={(e) => {
                                                            const newHours = { ...formData.opening_hours };
                                                            if (newHours[day.key]) {
                                                                newHours[day.key]!.open = e.target.value;
                                                                setFormData({ ...formData, opening_hours: newHours });
                                                            }
                                                        }}
                                                        className="px-2 py-1 border border-gray-300 rounded text-sm"
                                                    />
                                                    <span className="text-gray-500">-</span>
                                                    <input
                                                        type="time"
                                                        value={formData.opening_hours[day.key]?.close || ''}
                                                        onChange={(e) => {
                                                            const newHours = { ...formData.opening_hours };
                                                            if (newHours[day.key]) {
                                                                newHours[day.key]!.close = e.target.value;
                                                                setFormData({ ...formData, opening_hours: newHours });
                                                            }
                                                        }}
                                                        className="px-2 py-1 border border-gray-300 rounded text-sm"
                                                    />
                                                </div>
                                            ) : (
                                                <span className="text-sm text-gray-400 italic">Cerrado</span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
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

                    {/* IMAGES SECTION */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Imágenes (URLs)
                        </label>
                        <div className="space-y-3">
                            {formData.images.map((img, index) => (
                                <div key={index} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={img}
                                        onChange={(e) => {
                                            const newImages = [...formData.images];
                                            newImages[index] = e.target.value;
                                            setFormData({ ...formData, images: newImages });
                                        }}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="https://example.com/image.jpg"
                                    />
                                    <button
                                        onClick={() => {
                                            const newImages = formData.images.filter((_, i) => i !== index);
                                            setFormData({ ...formData, images: newImages });
                                        }}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={() => setFormData({ ...formData, images: [...formData.images, ''] })}
                                className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
                            >
                                <Plus className="w-4 h-4" /> Agregar URL de imagen
                            </button>
                        </div>
                    </div>

                    {/* MENU SECTION */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Menú
                            </label>
                            <button
                                onClick={() => setFormData({
                                    ...formData,
                                    menu: [...formData.menu, { category: '', items: [] }]
                                })}
                                className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
                            >
                                <Plus className="w-4 h-4" /> Nueva Categoría
                            </button>
                        </div>

                        <div className="space-y-4">
                            {formData.menu.map((category, catIndex) => (
                                <div key={catIndex} className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                                    <div className="flex gap-2 mb-3">
                                        <input
                                            type="text"
                                            value={category.category}
                                            onChange={(e) => {
                                                const newMenu = [...formData.menu];
                                                newMenu[catIndex].category = e.target.value;
                                                setFormData({ ...formData, menu: newMenu });
                                            }}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-medium"
                                            placeholder="Nombre de Categoría (ej. Entradas)"
                                        />
                                        <button
                                            onClick={() => {
                                                const newMenu = formData.menu.filter((_, i) => i !== catIndex);
                                                setFormData({ ...formData, menu: newMenu });
                                            }}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="space-y-2 pl-4 border-l-2 border-gray-200">
                                        {category.items.map((item, itemIndex) => (
                                            <div key={itemIndex} className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={item.name}
                                                    onChange={(e) => {
                                                        const newMenu = [...formData.menu];
                                                        newMenu[catIndex].items[itemIndex].name = e.target.value;
                                                        setFormData({ ...formData, menu: newMenu });
                                                    }}
                                                    className="flex-[2] px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                                                    placeholder="Nombre del plato"
                                                />
                                                <input
                                                    type="text"
                                                    value={item.price === 0 ? '' : item.price}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        if (val === '' || /^\d+$/.test(val)) {
                                                            const newMenu = [...formData.menu];
                                                            newMenu[catIndex].items[itemIndex].price = val === '' ? 0 : Number(val);
                                                            setFormData({ ...formData, menu: newMenu });
                                                        }
                                                    }}
                                                    className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                                                    placeholder="Precio"
                                                />
                                                <button
                                                    onClick={() => {
                                                        const newMenu = [...formData.menu];
                                                        newMenu[catIndex].items = newMenu[catIndex].items.filter((_, i) => i !== itemIndex);
                                                        setFormData({ ...formData, menu: newMenu });
                                                    }}
                                                    className="p-1.5 text-red-400 hover:text-red-500"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => {
                                                const newMenu = [...formData.menu];
                                                newMenu[catIndex].items.push({ name: '', price: 0 });
                                                setFormData({ ...formData, menu: newMenu });
                                            }}
                                            className="text-sm text-gray-500 hover:text-green-600 flex items-center gap-1 mt-2"
                                        >
                                            <Plus className="w-3 h-3" /> Agregar Plato
                                        </button>
                                    </div>
                                </div>
                            ))}
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
