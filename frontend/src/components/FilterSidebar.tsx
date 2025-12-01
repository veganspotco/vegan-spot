import { Leaf, MapPin, UtensilsCrossed } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

interface FilterSidebarProps {
  selectedFoodTypes: string[];
  setSelectedFoodTypes: (types: string[]) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  selectedDishTypes: string[];
  setSelectedDishTypes: (types: string[]) => void;
}

const FilterSidebar = ({
  selectedFoodTypes,
  setSelectedFoodTypes,
  selectedCity,
  setSelectedCity,
  selectedDishTypes,
  setSelectedDishTypes
}: FilterSidebarProps) => {

  const handleFoodTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      setSelectedFoodTypes([...selectedFoodTypes, type]);
    } else {
      setSelectedFoodTypes(selectedFoodTypes.filter(t => t !== type));
    }
  };

  const handleCityChange = (city: string, checked: boolean) => {
    if (checked) {
      setSelectedCity(city);
    } else if (selectedCity === city) {
      setSelectedCity('todas');
    }
  };

  const handleDishTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      setSelectedDishTypes([...selectedDishTypes, type]);
    } else {
      setSelectedDishTypes(selectedDishTypes.filter(t => t !== type));
    }
  };
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
            <Checkbox
              id="vegetariano"
              checked={selectedFoodTypes.includes('vegetariano')}
              onCheckedChange={(checked) => handleFoodTypeChange('vegetariano', checked as boolean)}
            />
            <label
              htmlFor="vegetariano"
              className="text-sm text-foreground cursor-pointer"
            >
              Vegetariano
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="vegano"
              checked={selectedFoodTypes.includes('vegano')}
              onCheckedChange={(checked) => handleFoodTypeChange('vegano', checked as boolean)}
            />
            <label
              htmlFor="vegano"
              className="text-sm text-foreground cursor-pointer"
            >
              Vegano
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="mixto"
              checked={selectedFoodTypes.includes('mixto')}
              onCheckedChange={(checked) => handleFoodTypeChange('mixto', checked as boolean)}
            />
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
            <Checkbox
              id="buga"
              checked={selectedCity === 'buga'}
              onCheckedChange={(checked) => handleCityChange('buga', checked as boolean)}
            />
            <label
              htmlFor="buga"
              className="text-sm text-foreground cursor-pointer"
            >
              Buga
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="tulua"
              checked={selectedCity === 'Tuluá'}
              onCheckedChange={(checked) => handleCityChange('Tuluá', checked as boolean)}
            />
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
            <Checkbox
              disabled
              id="desayuno"
              checked={selectedDishTypes.includes('desayuno')}
              onCheckedChange={(checked) => handleDishTypeChange('desayuno', checked as boolean)}
            />
            <label
              htmlFor="desayuno"
              className="text-sm text-foreground cursor-pointer"
            >
              Desayuno
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              disabled
              id="almuerzo"
              checked={selectedDishTypes.includes('almuerzo')}
              onCheckedChange={(checked) => handleDishTypeChange('almuerzo', checked as boolean)}
            />
            <label
              htmlFor="almuerzo"
              className="text-sm text-foreground cursor-pointer"
            >
              Almuerzo
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              disabled
              id="cena"
              checked={selectedDishTypes.includes('cena')}
              onCheckedChange={(checked) => handleDishTypeChange('cena', checked as boolean)}
            />
            <label
              htmlFor="cena"
              className="text-sm text-foreground cursor-pointer"
            >
              Cena
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              disabled
              id="postres"
              checked={selectedDishTypes.includes('postres')}
              onCheckedChange={(checked) => handleDishTypeChange('postres', checked as boolean)}
            />
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
