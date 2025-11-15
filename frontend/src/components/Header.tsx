import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.jpg";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Vegan Spot Logo" className="h-10 w-10 object-contain" />
          <div className="flex flex-col">
            <span className="text-lg font-bold text-foreground">Vegan Spot</span>
            <span className="text-xs text-muted-foreground">Buga & Tuluá</span>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <a href="#" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Inicio
          </a>
          <a href="#restaurantes" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Restaurantes
          </a>
          <a href="#sobre" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Sobre Nosotros
          </a>
        </nav>

        <Button variant="outline" size="sm" className="hidden md:flex">
          Iniciar Sesion 
        </Button>
      </div>
    </header>
  );
};

export default Header;
