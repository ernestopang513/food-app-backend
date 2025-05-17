import { ApiProperty } from "@nestjs/swagger";
import { Dish } from "src/dish/entities/dish.entity";
import { FoodStand } from "src/food-stands/entities/food-stand.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";



@Entity()
@Unique(['foodStand', 'dish'])
export class FoodStandDish {

    @ApiProperty({
        example: 'c8aeeb0b-f04b-40c1-9294-4b37576a4959',
        description: 'FoodStandDish ID',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 30,
        description: 'Cantidad de platillos por food stand',
        default: 0,
        required: false,
    })
    @Column('int' , {
        default: 0
    })
    quantity: number;

    @ApiProperty({
        example: true,
        description: 'Indicador para saber si el food stand dish esta activo',
        default: false
    })
    @Column({
        type: "bool",
        default: true
    })
    is_active: boolean;

    @ApiProperty({
        type: () => FoodStand,
        description: "Puesto de comida al que pertenece este platillo",
    })
    @ManyToOne(
        () => FoodStand,
        ( foodStand ) => foodStand.foodStandDishes,
        {onDelete: 'CASCADE'}
    )
    foodStand: FoodStand;

    @ApiProperty({
        type: () => Dish,
        description: "Platillo asociado al puesto de comida",
    })
    @ManyToOne(
        () => Dish,
        (dish) => dish.foodStandDishes,
        {onDelete: 'CASCADE'}
    )
    dish: Dish
}
