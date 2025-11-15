import React, { useState } from 'react';
import { useAuth } from '../components/context/authContext';
import { useNavigate } from 'react-router-dom';
import LoginModal from '../components/LoginModal';

const LoginPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (email: string, password: string) => {
        setIsLoading(true);
        setError('');

        try {
            // Simular una llamada a la API
            console.log('Intentando login con:', { email, password });

            // Aquí iría tu llamada real a la API
            // const response = await authService.login(email, password);

            // Simulamos un retraso de red
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Simulamos un error para demostración (quitar en producción)
            if (password === 'error') {
                throw new Error('Credenciales incorrectas');
            }

            // Simular respuesta exitosa
            const mockUser = {
                id: '1',
                email: email,
                name: email.split('@')[0]
            };

            const mockToken = 'mock-jwt-token';

            // Llamar al contexto de autenticación
            login(mockToken, mockUser);

            // Redirigir al dashboard
            navigate('/dashboard');

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Logo y título */}
                <div className="text-center">
                    <div className="mx-auto h-20 w-20 bg-green-600 rounded-full flex items-center justify-center mb-4">
                        <span className="text-white text-2xl font-bold">VS</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Vegan Spot</h1>
                    <p className="text-gray-600">Buga & Tuluá</p>
                </div>

                {/* Formulario */}
                <LoginModal
                    onLogin={handleLogin}
                    isOpen={true}
                    onClose={() => {}}
                />

                {/* Información adicional */}
                <div className="text-center">
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