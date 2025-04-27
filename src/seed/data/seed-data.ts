

interface SeedFoodStand {
    name: string;
    location: string;
    latitude: number;
    longitude: number;
    // is_open: boolean;

}

interface Dish {
    price: number;
    name: string;
    description: string;
}



interface SeedData {
    foodStands: SeedFoodStand[];
    dishes: Dish[];
    
}


export const InitialData: SeedData = {
    foodStands: [
        {
            "name": "Anexo Ingeniería",
            "location": "Debajo del edificio I (Anexo de Ingeniería).",
            "latitude": 19.33125638836458,
            "longitude": -99.18388852822785
        },
        {
            "name": "Principal Ingeniería",
            "location": "Enfrente de la puerta principal de ingenieria.",
            "latitude": 19.33125638836458,
            "longitude": -99.18388852822785
        }
    ],
    dishes: [
        {
            "price": 55,
            "name": "Pollo Mango Habanero",
            "description": "Pollo sazonado de forma muy rica"
         },
        {
            "price": 55,
            "name": "Pollo a la naranja",
            "description": "Pollo sazonado de forma muy rica"
         },
        {
            "price": 55,
            "name": "Pollo BBQ",
            "description": "Pollo sazonado de forma muy rica"
         },
    ],
    
}