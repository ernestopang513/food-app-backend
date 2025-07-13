import { ApiProperty } from "@nestjs/swagger";
import { DishImage } from "src/dish-image/entities/dish-image.entity";
import { FoodStandDish } from "src/food-stand-dish/entities/food-stand-dish.entity";
import { OrderDish } from "src/order/entities/order-dish.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";




@Entity()
export class Dish {

    @ApiProperty({
            example: 'c8aeeb0b-f04b-40c1-9294-4b37576a4959',
            description: 'Dish ID',
            uniqueItems: true
        })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 55,
        description: 'Precio del platillo',
        default: 0,
        required: false
    })
    @Column('int', {
        default: 0,
    })
    price: number;

    @ApiProperty({
        example: 'Pollo con mango habanero',
        description: 'Nombre unico del platillo',
        uniqueItems: true,
        required: true
    })
    @Column('text', {
        unique: true
    })
    name: string;

    @ApiProperty({
        example: 'Pollo sasonado muy rico',
        description: 'Descripción del platillo'
    })
    @Column('text')
    description: string;


    @OneToMany(
        () => FoodStandDish,
        (foodStandDish) => foodStandDish.dish,
        {cascade: true}
    )
    foodStandDishes: FoodStandDish[];
    
    
    @OneToMany(
        () => OrderDish,
        (orderDish) => orderDish.dish,
        {cascade: true}
    )
    orderDishes: OrderDish[];
    
    @OneToOne(
        () => DishImage,
        (dishImage) => dishImage.dish,
        {cascade: true, eager: true, nullable: true}
    )
    @JoinColumn()
    image?: DishImage;


}
