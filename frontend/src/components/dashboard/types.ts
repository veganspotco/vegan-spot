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
    //hours?: string;
    opening_hours: { [key: string]: { open: string; close: string } | undefined };
    menu: { category: string; items: { name: string; price: number }[] }[];
    images: string[];
}
