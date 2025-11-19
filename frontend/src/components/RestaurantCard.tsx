import { MapPin, Leaf, Star, Phone, Globe, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Interface actualizada para coincidir con los datos del microservicio
interface Establishment {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  type: "vegan" | "vegetarian" | "mixto";
  phone?: string;
  email?: string;
  website?: string;
  price_range?: "low" | "medium" | "high" | "luxury";
  opening_hours?: Record<string, { open: string; close: string }> | null;
  is_active: boolean;
}

interface RestaurantCardProps {
  establishment: Establishment;
  featured?: boolean;
}

// Mapeo de tipos en inglés a español
const typeMap = {
  vegan: "vegano",
  vegetarian: "vegetariano",
  mixto: "mixto"
} as const;

// Mapeo de rangos de precios
const priceRangeMap = {
  low: "$",
  medium: "$$",
  high: "$$$",
  luxury: "$$$$"
} as const;

// Función para obtener horario de hoy
const getTodayHours = (opening_hours: Record<string, { open: string; close: string }> | null | undefined) => {
  if (!opening_hours) return null;
  
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const today = days[new Date().getDay()];
  return opening_hours[today];
};

// Imagen por defecto basada en el tipo de establecimiento
const getDefaultImage = (type: string) => {
  const images = {
    vegan: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=250&fit=crop",
    vegetarian: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=250&fit=crop",
    mixto: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=250&fit=crop"
  };
  return images[type as keyof typeof images] || images.vegan;
};

const RestaurantCard = ({
  establishment,
  featured = false,
}: RestaurantCardProps) => {
  const {
    name,
    address,
    city,
    type,
    description,
    phone,
    website,
    price_range,
    opening_hours
  } = establishment;

  const todayHours = getTodayHours(opening_hours);
  const typeInSpanish = typeMap[type] || "mixto";
  const priceSymbol = price_range ? priceRangeMap[price_range] : "";
  const imageUrl = getDefaultImage(type);

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer h-full flex flex-col">
      <div className="relative h-48 overflow-hidden flex-shrink-0">
        <img
          src={imageUrl}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        
        {/* Badge destacado */}
        {featured && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-amber-500 text-white">
              <Star className="mr-1 h-3 w-3 fill-current" />
              Destacado
            </Badge>
          </div>
        )}
        
        {/* Badge tipo de establecimiento */}
        <div className="absolute top-3 left-3">
          <Badge 
            variant={type === "vegan" ? "default" : "secondary"}
            className={type === "vegan" ? "bg-green-600" : "bg-blue-600"}
          >
            <Leaf className="mr-1 h-3 w-3" />
            {typeInSpanish.charAt(0).toUpperCase() + typeInSpanish.slice(1)}
          </Badge>
        </div>

        {/* Badge rango de precios */}
        {price_range && (
          <div className="absolute bottom-3 left-3">
            <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
              {priceSymbol}
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-5 flex-1 flex flex-col">
        {/* Nombre y descripción */}
        <div className="flex-1">
          <h3 className="mb-2 text-xl font-bold text-foreground line-clamp-1">{name}</h3>
          <p className="mb-3 text-sm text-muted-foreground line-clamp-2">{description}</p>
        </div>

        {/* Información de contacto y ubicación */}
        <div className="space-y-2 mt-auto">
          {/* Dirección */}
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <span className="line-clamp-2">{address}</span>
            <span className="ml-1 font-semibold">({city})</span>
          </div>

          {/* Horario de hoy */}
          {todayHours && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3 text-primary" />
              <span>
                Hoy: {todayHours.open} - {todayHours.close}
              </span>
            </div>
          )}

          {/* Información de contacto */}
          <div className="flex items-center gap-3 pt-2 border-t border-border">
            {phone && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Phone className="h-3 w-3" />
                <span>{phone}</span>
              </div>
            )}
            
            {website && (
              <a 
                href={website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-primary hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                <Globe className="h-3 w-3" />
                <span>Web</span>
              </a>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RestaurantCard;
