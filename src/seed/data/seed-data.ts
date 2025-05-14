

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

interface User{
    userName: string;
    password: string;
    email: string;
    fullName: string;
}

interface DeliveryPoint {
    name: string;
    latitude: number;
    longitude: number;
}


interface SeedData {
    foodStands: SeedFoodStand[];
    dishes: Dish[];
    users: User[];
    deliveryPoints: DeliveryPoint[];
    
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
    users: [
        {
            "userName": "LauraRivas",
            "password": "Abc123",
            "email": "laura.rivas82@example.com",
            "fullName": "Laura Rivas Montenegro"
        },
        {
            "userName": "CarlosGT",
            "password": "Abc123",
            "email": "carlosgt91@gmail.com",
            "fullName": "Carlos Gómez Torres"
        },
        {
            "userName": "AnaMart",
            "password": "Abc123",
            "email": "anamartinez22@hotmail.com",
            "fullName": "Ana Martínez Delgado"
        },
        {
            "userName": "JMendez89",
            "password": "Abc123",
            "email": "jmendez89@yahoo.com",
            "fullName": "Jorge Méndez Sánchez"
        },
        {
            "userName": "TaniaVega",
            "password": "Abc123",
            "email": "taniavega@mail.com",
            "fullName": "Tania Vega Ramírez"
        },
        {
            "userName": "ErnestoPang",
            "password": "Abc123",
            "email": "ernestopang513@gmail.com",
            "fullName": "Ernesto Pang Araizaga"

        }
    ],
    deliveryPoints: [
        {
            "name": "Medicina",
            "latitude": 19.333474,
            "longitude": -99.180545
        },
        {
            "name": "Filosofia",
            "latitude": 19.333977,
            "longitude": -99.187342
        },
    ]

}