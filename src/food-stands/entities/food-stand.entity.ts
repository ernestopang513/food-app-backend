import { ApiProperty } from "@nestjs/swagger";
import { timeStamp } from "console";
import { FoodStandDish } from "src/food-stand-dish/entities/food-stand-dish.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";




@Entity()
export class FoodStand {

    @ApiProperty({
        example: 'c8aeeb0b-f04b-40c1-9294-4b37576a4959',
        description: 'FoodStand ID',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'Química',
        description: 'Nombre unico del food stand'
    })
    @Column('varchar' , {
        unique: true,
    })
    name: string;

    @ApiProperty({
        example: 'Enfrente de la explanada',
        description: 'Descripción de la locación del food stand',
        required: false,
        nullable: true
    })
    @Column({
        type: 'text',
        nullable: true
    })
    location: string;

    @ApiProperty({
        example: 19.33125638836458,
        description: 'Coordenadas de latitud del food stand'
    })
    @Column({
        type: 'float',
        nullable: false
    })
    latitude: number;


    @ApiProperty({
        example: -99.18388852822785,
        description: 'Coordenadas de longitud del food stand'
    })
    @Column({
        type: 'float',
        nullable: false
    })
    longitude: number;

    @ApiProperty({
        example: true,
        description: 'Indicador para saber si el food stand esta activo',
        default: false
    })
    @Column({
        type: "bool",
        default: false
    })
    isOpen: boolean;

    @ApiProperty({
        example: '2025-05-15 21:04:24.453103',
        type: 'string',
        description: 'TimeStamp de cuando se creo el food stand',
        format: 'date-time'
    })
    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP'
    })
    createdAt: Date;

    
    @OneToMany(
        () => FoodStandDish,
        (foodStandDish) => foodStandDish.foodStand,
        {cascade: true},
        //* No tiene sentido usar eager porque ya hago relations para extraer los datos en el metodo find
        // {cascade: true, eager: true}
    )
    foodStandDishes?: FoodStandDish[];
}
