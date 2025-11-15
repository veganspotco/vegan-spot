import { Leaf, MapPin, UtensilsCrossed } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

const FilterSidebar = () => {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h3 className="mb-4 text-lg font-bold text-foreground">Filtros</h3>
      
      {/* Tipo de Comida */}
      <div className="mb-6">
        <div className="mb-3 flex items-center gap-2">
          <Leaf className="h-4 w-4 text-primary" />
          <Label className="text-sm font-semibold">Tipo de Comida</Label>
        </div>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox id="vegetariano" />
            <label
              htmlFor="vegetariano"
              className="text-sm text-foreground cursor-pointer"
            >
              Vegetariano
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="vegano" />
            <label
              htmlFor="vegano"
              className="text-sm text-foreground cursor-pointer"
            >
              Vegano
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="mixto" />
            <label
              htmlFor="mixto"
              className="text-sm text-foreground cursor-pointer"
            >
              Opciones mixtas
            </label>
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      {/* Ciudad */}
      <div className="mb-6">
        <div className="mb-3 flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          <Label className="text-sm font-semibold">Ciudad</Label>
        </div>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox id="buga" />
            <label
              htmlFor="buga"
              className="text-sm text-foreground cursor-pointer"
            >
              Buga
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="tulua" />
            <label
              htmlFor="tulua"
              className="text-sm text-foreground cursor-pointer"
            >
              Tuluá
            </label>
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      {/* Tipo de Plato */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <UtensilsCrossed className="h-4 w-4 text-primary" />
          <Label className="text-sm font-semibold">Tipo de Plato</Label>
        </div>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox id="desayuno" />
            <label
              htmlFor="desayuno"
              className="text-sm text-foreground cursor-pointer"
            >
              Desayuno
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="almuerzo" />
            <label
              htmlFor="almuerzo"
              className="text-sm text-foreground cursor-pointer"
            >
              Almuerzo
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="cena" />
            <label
              htmlFor="cena"
              className="text-sm text-foreground cursor-pointer"
            >
              Cena
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="postres" />
            <label
              htmlFor="postres"
              className="text-sm text-foreground cursor-pointer"
            >
              Postres
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
