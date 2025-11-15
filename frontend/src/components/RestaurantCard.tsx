import { MapPin, Leaf, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RestaurantCardProps {
  name: string;
  address: string;
  city: string;
  type: "vegetariano" | "vegano" | "mixto";
  image: string;
  description: string;
  featured?: boolean;
}

const RestaurantCard = ({
  name,
  address,
  city,
  type,
  image,
  description,
  featured = false,
}: RestaurantCardProps) => {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer">
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        {featured && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-secondary text-secondary-foreground">
              <Star className="mr-1 h-3 w-3" />
              Destacado
            </Badge>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <Badge 
            variant={type === "vegano" ? "default" : "secondary"}
            className={type === "vegano" ? "bg-primary" : ""}
          >
            <Leaf className="mr-1 h-3 w-3" />
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Badge>
        </div>
      </div>
      <CardContent className="p-5">
        <h3 className="mb-2 text-xl font-bold text-foreground">{name}</h3>
        <p className="mb-3 text-sm text-muted-foreground line-clamp-2">{description}</p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 text-primary" />
          <span>{address}, {city}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default RestaurantCard;
