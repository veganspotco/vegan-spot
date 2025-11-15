import { Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import heroBanner from "@/assets/hero-banner.jpg";

const Hero = () => {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroBanner} 
          alt="Deliciosa comida vegetariana y vegana" 
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/70 to-background" />
      </div>

      {/* Content */}
      <div className="container relative z-10 px-4 py-20 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-6xl">
            Descubre los Mejores Lugares
            <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mt-2">
              Vegetarianos y Veganos
            </span>
          </h1>
          <p className="mb-8 text-lg text-muted-foreground md:text-xl ">
            Encuentra restaurantes, menús saludables y opciones deliciosas en Buga y Tuluá
          </p>

          {/* Search Bar */}
          <div className="mx-auto max-w-2xl rounded-xl bg-card p-4 shadow-lg">
            <div className="flex flex-col gap-3 md:flex-row">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar restaurantes, platos..."
                    className="pl-10 border-border"
                  />
                </div>
              </div>
              <Select defaultValue="todas">
                <SelectTrigger className="w-full md:w-[180px] border-border">
                  <MapPin className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Ciudad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas</SelectItem>
                  <SelectItem value="buga">Buga</SelectItem>
                  <SelectItem value="tulua">Tuluá</SelectItem>
                </SelectContent>
              </Select>
              <Button className="w-full md:w-auto bg-primary hover:bg-primary/90">
                Buscar
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-12 grid grid-cols-3 gap-4 md:gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary md:text-4xl">12+</div>
              <div className="text-sm text-muted-foreground">Restaurantes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary md:text-4xl">50+</div>
              <div className="text-sm text-muted-foreground">Platillos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent md:text-4xl">2</div>
              <div className="text-sm text-muted-foreground">Ciudades</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
