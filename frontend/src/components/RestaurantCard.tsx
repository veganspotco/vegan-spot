import { MapPin, Leaf, Star, Phone, Globe, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreVertical, Info, Map } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [locationData, setLocationData] = useState<any>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const handleViewDetails = () => {
    setShowDetailsDialog(true);
  };

  const handleViewLocation = async () => {
    setShowLocationDialog(true);
    setLoadingLocation(true);
    try {
      const response = await fetch(`http://localhost:3003/api/locations/${establishment.id}`);
      const data = await response.json();
      if (data.success) {
        setLocationData(data.data);
      }
    } catch (error) {
      console.error("Error fetching location:", error);
    } finally {
      setLoadingLocation(false);
    }
  };

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

        {/* Dropdown Menu */}
        <div className="absolute bottom-3 right-3" onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Más opciones</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleViewDetails}>
                <Info className="mr-2 h-4 w-4" />
                <span>Ver detalles</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleViewLocation}>
                <Map className="mr-2 h-4 w-4" />
                <span>Ver ubicación</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog open={showLocationDialog} onOpenChange={setShowLocationDialog}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Ubicación: {name}</DialogTitle>
                <DialogDescription>
                  {address}, {city}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {loadingLocation ? (
                  <div className="flex justify-center p-4">Cargando ubicación...</div>
                ) : locationData ? (
                  <div className="flex flex-col gap-2">
                    <div className="h-64 w-full bg-slate-100 rounded-md overflow-hidden">
                      {/* OpenStreetMap Embed */}
                      <iframe
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        scrolling="no"
                        marginHeight={0}
                        marginWidth={0}
                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${locationData.lng - 0.01}%2C${locationData.lat - 0.01}%2C${locationData.lng + 0.01}%2C${locationData.lat + 0.01}&layer=mapnik&marker=${locationData.lat}%2C${locationData.lng}`}
                        style={{ border: 0 }}
                        title="Mapa de ubicación"
                      ></iframe>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 text-center">
                      <a href={`https://www.openstreetmap.org/?mlat=${locationData.lat}&mlon=${locationData.lng}#map=16/${locationData.lat}/${locationData.lng}`} target="_blank" className="hover:underline text-primary">
                        Ver mapa más grande
                      </a>
                    </p>
                  </div>
                ) : (
                  <div className="text-center text-red-500">No se pudo cargar la ubicación</div>
                )}
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
            <DialogContent className="sm:max-w-[600px] max-h-[85vh] flex flex-col p-0 overflow-hidden">
              <ScrollArea className="flex-1 w-full p-6">
                <div className="space-y-6">
                  {/* Header Image */}
                  <div className="rounded-lg overflow-hidden h-48 w-full shrink-0">
                    <img
                      src={imageUrl}
                      alt={name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Title & Badges */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-2xl font-bold">{name}</h2>
                      <div className="flex gap-2">
                        {featured && (
                          <Badge className="bg-amber-500 hover:bg-amber-600">
                            <Star className="mr-1 h-3 w-3 fill-current" />
                            Destacado
                          </Badge>
                        )}
                        <Badge variant={type === "vegan" ? "default" : "secondary"}>
                          {typeInSpanish.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-lg">{description}</p>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-4 border-t border-b py-4">
                    <div className="space-y-1">
                      <h4 className="font-semibold text-sm">Dirección</h4>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <MapPin className="h-4 w-4" /> {address}, {city}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-semibold text-sm">Contacto</h4>
                      {phone && <p className="text-sm text-muted-foreground flex items-center gap-2"><Phone className="h-4 w-4" /> {phone}</p>}
                      {website && <p className="text-sm text-muted-foreground flex items-center gap-2"><Globe className="h-4 w-4" /> <a href={website} target="_blank" className="hover:underline underline-offset-4">Sitio Web</a></p>}
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-semibold text-sm">Precios</h4>
                      <p className="text-sm text-muted-foreground">{priceSymbol || "No disponible"}</p>
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-semibold text-sm">Horario Hoy</h4>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Clock className="h-4 w-4" /> {todayHours ? `${todayHours.open} - ${todayHours.close}` : "Cerrado"}
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollArea>
              <div className="p-4 border-t bg-slate-50 flex justify-end">
                <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>Cerrar</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
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
