import { getEstablishments } from './apiRest';

const API_URL = 'http://localhost:3000/api/establishments';

export interface Establishment {
    id?: number;
    name: string;
    description: string;
    address: string;
    city: string;
    type: 'vegan' | 'vegetarian'; // Backend types
    price_range?: string | null;
    phone?: string | null;
    email?: string | null;
    website?: string | null;
    opening_hours?: string | null;
    is_active?: boolean;
    created_at?: string;
    // Frontend specific fields (not in DB yet)
    ingredients?: string[];
    image?: string | null;
}

export const establishmentService = {
    getAll: async (): Promise<Establishment[]> => {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Error fetching establishments');
        const data = await response.json();
        return data.data;
    },

    create: async (establishment: Establishment, userId: string): Promise<Establishment> => {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...establishment,
                created_by: userId
            }),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error creating establishment');
        }
        const data = await response.json();
        return data.data;
    },

    update: async (id: number, establishment: Partial<Establishment>): Promise<Establishment> => {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(establishment),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error updating establishment');
        }
        const data = await response.json();
        return data.data;
    },

    delete: async (id: number): Promise<void> => {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error deleting establishment');
        }
    },

    getAvailableCities: async (): Promise<string[]> => {
        const response = await fetch(`${API_URL}/cities`);
        if (!response.ok) throw new Error('Error fetching cities');
        const data = await response.json();
        return data.data;
    }
};
