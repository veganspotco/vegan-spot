
// Array simulado de ubicaciones para demo
const locations = [
    { establishmentId: '1', lat: 4.6097, lng: -74.0817, address: 'Carrera 3 #6-23', city: 'Buga' },
    { establishmentId: '2', lat: 4.6120, lng: -74.0850, address: 'En la miercoles y un poquito mas abajo', city: 'Tuluá' },
    { establishmentId: '3', lat: 4.6150, lng: -74.0900, address: 'Calle Principal 123', city: 'Tuluá' }
];

export const getLocationByEstablishmentId = async (req, res) => {
    try {
        const { id } = req.params;
        const location = locations.find(l => l.establishmentId === id);

        if (!location) {
            // Return dummy data for any ID not found, for demo purposes
            return res.status(200).json({
                success: true,
                data: {
                    establishmentId: id,
                    lat: 4.6000 + (Math.random() * 0.1),
                    lng: -74.0800 + (Math.random() * 0.1),
                    address: "Dirección simulada",
                    city: "Ciudad Ejemplo"
                }
            });
        }

        res.status(200).json({
            success: true,
            data: location
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const updateLocation = async (req, res) => {
    try {
        const { id } = req.params;
        const { lat, lng } = req.body;

        // Simulación de actualización
        res.status(200).json({
            success: true,
            message: `Ubicación actualizada para establecimiento ${id}`,
            data: { establishmentId: id, lat, lng }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
