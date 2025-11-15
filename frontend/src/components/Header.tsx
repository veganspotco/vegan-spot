import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "../components/context/authContext";
import { useState } from "react";
import LoginModal from "./LoginModal";
import logo from "@/assets/logo.jpg";

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    // Aquí va tu lógica de login
    console.log('Login con:', email, password);

    // Simular login exitoso
    const mockUser = {
      id: '1',
      email: email,
      name: email.split('@')[0]
    };

    // Cerrar modal después del login exitoso
    setIsLoginModalOpen(false);
  };

  const handleLogout = () => {
    logout();
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
            <Link
              to="/restaurants"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Restaurantes
            </Link>
            <Link
              to="/about"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Sobre Nosotros
            </Link>
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