import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../components/context/authContext";
import { useState } from "react";
import LoginModal from "./LoginModal";
import logo from "@/assets/logo.jpg";

const Header = () => {
  const { isAuthenticated, user, logout, login } = useAuth(); // ✅ Agregamos 'login'
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    try {
      console.log('Login con:', email, password);

      // Simulamos un retraso de red
      await new Promise(resolve => setTimeout(resolve, 1500));

      // VALIDACIÓN DE CREDENCIALES
      if (email === 'admin@veganspot.com' && password === 'admin123') {
        const mockUser = {
          id: '1',
          email: email,
          name: email.split('@')[0]
        };

        const mockToken = 'jwt-token-' + Date.now();

        // ✅ Autenticar usando el contexto
        login(mockToken, mockUser);

        // Cerrar modal después del login exitoso
        setIsLoginModalOpen(false);

        // ✅ Redirigir al dashboard
        navigate('/dashboard');
      } else {
        throw new Error('Credenciales incorrectas. Usa: admin@veganspot.com / admin123');
      }
    } catch (err) {
      // El error será manejado por el LoginModal
      throw err;
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/'); // ✅ Redirigir a la página principal después del logout
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          {/* Logo y nombre */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="Vegan Spot Logo" className="h-10 w-10 object-contain" />
              <div className="flex flex-col">
                <span className="text-lg font-bold text-foreground">Vegan Spot</span>
                <span className="text-xs text-muted-foreground">Buga & Tuluá</span>
              </div>
            </Link>
          </div>

          {/* Navegación */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Inicio
            </Link>
            <a
              href="#restaurantes"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Restaurantes
            </a>
            <a
              href="#sobre"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Sobre Nosotros
            </a>
            {/* ✅ Agregar link al dashboard si está autenticado */}
            {isAuthenticated && (
              <Link
                to="/dashboard"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                Dashboard
              </Link>
            )}
          </nav>

          {/* Botones de usuario */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground hidden md:block">
                  Hola, {user?.name || user?.email}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                >
                  Cerrar Sesión
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsLoginModalOpen(true)}
                className="hidden md:flex"
              >
                Iniciar Sesión
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Modal de Login */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
      />
    </>
  );
};

export default Header;