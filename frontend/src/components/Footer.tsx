import { Heart } from "lucide-react";
import logo from "@/assets/logo.jpg";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src={logo} alt="Vegan Spot Logo" className="h-10 w-10 object-contain" />
              <div className="flex flex-col">
                <span className="text-lg font-bold text-foreground">Vegan Spot</span>
                <span className="text-xs text-muted-foreground">Buga & Tuluá</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              Promoviendo una alimentación saludable y sostenible en el Valle del Cauca.
              Descubre los mejores lugares vegetarianos y veganos de tu ciudad.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">Enlaces</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Inicio</a></li>
              <li><a href="#restaurantes" className="hover:text-primary transition-colors">Restaurantes</a></li>
              <li><a href="#sobre" className="hover:text-primary transition-colors">Sobre Nosotros</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contacto</a></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">Proyecto</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Universidad del Valle</li>
              <li>Tecnologia en Desarrollo de Software</li>
              <li>Buga - Tuluá</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center">
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
            Hecho con <Heart className="h-4 w-4 text-destructive fill-destructive" /> para promover
            una alimentación consciente y sostenible
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            © 2025 Vegan Spot. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
