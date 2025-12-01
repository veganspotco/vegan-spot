import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FilterSidebar from "@/components/FilterSidebar";
//import RestaurantCard from "@/components/RestaurantCard";
import RestaurantCard from '@/components/RestaurantCard';
import { getEstablishments, Establishment, getEstablishmentsWithFilters } from "@/services/apiRest";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";

import restaurant1 from "@/assets/restaurant-1.jpg";
import restaurant2 from "@/assets/restaurant-2.jpg";
import restaurant3 from "@/assets/restaurant-3.jpg";
import restaurant4 from "@/assets/restaurant-4.jpg";

const mockRestaurants = [
  {
    id: 1,
    name: "Verde Vital",
    address: "Calle 5 #10-25",
    city: "Buga",
    type: "vegano" as const,
    image: restaurant1,
    description: "Bowls nutritivos con quinoa, aguacate y vegetales frescos. Alimentación consciente y saludable.",
    featured: true,
  },
  {
    id: 2,
    name: "Tierra Verde",
    address: "Carrera 14 #8-40",
    city: "Tuluá",
    type: "vegetariano" as const,
    image: restaurant2,
    description: "Hamburguesas veganas gourmet con papas de camote. Sabor sin compromisos.",
    featured: true,
  },
  {
    id: 3,
    name: "Sabor Natural",
    address: "Calle 7 #12-15",
    city: "Buga",
    type: "mixto" as const,
    image: restaurant3,
    description: "Pizzas vegetarianas artesanales con ingredientes frescos y locales.",
    featured: false,
  },
  {
    id: 4,
    name: "El Huerto",
    address: "Carrera 20 #15-30",
    city: "Tuluá",
    type: "vegano" as const,
    image: restaurant4,
    description: "Smoothie bowls y postres saludables. Perfecto para un desayuno nutritivo.",
    featured: false,
  },
  {
    id: 5,
    name: "La Cosecha",
    address: "Calle 9 #8-20",
    city: "Buga",
    type: "vegetariano" as const,
    image: restaurant1,
    description: "Platos del día con ingredientes orgánicos. Menú variado y económico.",
    featured: false,
  },
  {
    id: 6,
    name: "Raíces",
    address: "Carrera 12 #10-45",
    city: "Tuluá",
    type: "vegano" as const,
    image: restaurant3,
    description: "Comida vegana casera con recetas tradicionales adaptadas.",
    featured: false,
  },
];



const Index = () => {
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [loading, setLoading] = useState(true);

  // Search State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("todas");
  const [selectedFoodTypes, setSelectedFoodTypes] = useState<string[]>([]);
  const [selectedDishTypes, setSelectedDishTypes] = useState<string[]>([]);

  const fetchEstablishments = async () => {
    setLoading(true);
    try {
      const filters = {
        city: selectedCity,
        foodTypes: selectedFoodTypes,
        type: selectedDishTypes,
        searchText: searchTerm
      };

      const response = await getEstablishmentsWithFilters(filters);

      if (response.success) {
        setEstablishments(response.data);
      }
    } catch (error) {
      console.error('Error loading establishments:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchEstablishments();
  }, []);

  // Trigger search when filters change (except text search which is manual via button)
  useEffect(() => {
    fetchEstablishments();
  }, [selectedCity, selectedFoodTypes, selectedDishTypes]);

  const handleSearch = () => {
    fetchEstablishments();
  };

  if (loading) return <div>Cargando establecimientos...</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          onSearch={handleSearch}
        />

        {/* Restaurants Section */}
        <section id="restaurantes" className="py-16 bg-muted/20">
          <div className="container px-4">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold text-foreground md:text-4xl mb-4">
                Explora Nuestros Spots
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Descubre una selección curada de los mejores lugares para disfrutar
                comida vegetariana y vegana en Buga y Tuluá
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
              {/* Filters Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-20">
                  <FilterSidebar
                    selectedFoodTypes={selectedFoodTypes}
                    setSelectedFoodTypes={setSelectedFoodTypes}
                    selectedCity={selectedCity}
                    setSelectedCity={setSelectedCity}
                    selectedDishTypes={selectedDishTypes}
                    setSelectedDishTypes={setSelectedDishTypes}
                  />
                </div>
              </div>

              {/* Restaurant Grid */}
              <div className="lg:col-span-3">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Mostrando {establishments.length} restaurantes
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {establishments.map((establishment) => (
                    <RestaurantCard
                      key={establishment.id}
                      establishment={establishment}
                      // Puedes añadir lógica para determinar si es featured
                      featured={establishment.type === 'vegan'} // Ejemplo
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="sobre" className="py-16">
          <div className="container px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold text-foreground md:text-4xl mb-6">
                Nuestra Misión
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Vegan Spot nace con el propósito de promover una alimentación saludable,
                apoyar a los negocios locales sostenibles y contribuir a la disminución del
                sufrimiento animal mediante el fomento de alternativas alimentarias libres de
                productos de origen animal.
              </p>
              <p className="text-lg text-muted-foreground">
                Facilitamos el acceso a información sobre restaurantes vegetarianos y veganos
                en Buga y Tuluá, conectando a la comunidad con opciones conscientes y deliciosas.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
