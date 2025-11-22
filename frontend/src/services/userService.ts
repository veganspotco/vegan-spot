const API_URL = 'http://localhost:3000/api/users';

export interface User {
    id: string;
    email: string;
    name: string;
    role?: string;
}

export const userService = {
    login: async (email: string, password: string): Promise<User> => {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error logging in');
        }

        const data = await response.json();
        // Map backend full_name to frontend name
        return {
            ...data.data,
            name: data.data.full_name || data.data.name
        };
    }
};