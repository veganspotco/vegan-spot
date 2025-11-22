import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/context/authContext';
import { userService } from '../services/userService';
import { useNavigate } from 'react-router-dom';
import LoginModal from '../components/LoginModal';

const LoginPage: React.FC = () => {
    const [error, setError] = useState<string>('');
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // Si ya está autenticado, redirigir al dashboard
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    const handleLogin = async (email: string, password: string) => {
        setError('');

        try {
            // Call the backend login service
            const user = await userService.login(email, password);

            // For now, we'll generate a mock token since the backend doesn't return one yet
            // In a real app, the backend should return the token
            const token = 'mock-jwt-token-' + Date.now();

            login(token, user);
        } catch (err: any) {
            // Re-throw with a user-friendly message if possible
            throw new Error(err.message || 'Error al iniciar sesión');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Logo y título */}
                <div className="text-center">
                    <div className="mx-auto h-20 w-20 bg-green-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                        <span className="text-white text-2xl font-bold">VS</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Vegan Spot</h1>
                    <p className="text-gray-600">Panel Administrativo - Buga & Tuluá</p>
                </div>

                {/* Formulario */}
                <LoginModal
                    onLogin={handleLogin}
                    isOpen={true}
                    onClose={() => { }}
                />

                {/* Información adicional */}
                <div className="text-center space-y-2">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                            Credenciales de prueba:
                        </p>
                        <p className="text-xs text-gray-600">
                            Email: <span className="font-mono text-green-600">admin@veganspot.com</span>
                        </p>
                        <p className="text-xs text-gray-600">
                            Password: <span className="font-mono text-green-600">admin123</span>
                        </p>
                    </div>

                    <p className="text-xs text-gray-500">
                        Al iniciar sesión, aceptas nuestros{' '}
                        <a href="/terms" className="text-green-600 hover:text-green-800">
                            Términos de servicio
                        </a>{' '}
                        y{' '}
                        <a href="/privacy" className="text-green-600 hover:text-green-800">
                            Política de privacidad
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;