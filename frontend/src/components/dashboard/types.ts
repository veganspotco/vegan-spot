export interface User {
    id: string;
    email: string;
    name: string;
}

export interface EstablishmentFormState {
    name: string;
    email: string;
    website: string;
    city: string;
    address: string;
    type: 'vegan' | 'vegetarian';
    description: string;
    //ingredients: string;
    //image: string;
    phone: string;
    //hours: string;
    hours?: string; // Made optional to match usage in some contexts if needed, but keeping consistent with previous definition
}
