import { FoodStandDish } from "src/food-stand-dish/entities/food-stand-dish.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";




@Entity()
export class FoodStand {


    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar' , {
        unique: true,
    })
    name: string;

    @Column({
        type: 'text',
        nullable: true
    })
    location: string;

    @Column({
        type: 'float',
        nullable: false
    })
    latitude: number;

    @Column({
        type: 'float',
        nullable: false
    })
    longitude: number;


    @Column({
        type: "bool",
        default: false
    })
    is_open: boolean;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP'
    })
    created_at: Date;

    @OneToMany(
        () => FoodStandDish,
        (foodStandDish) => foodStandDish.foodStand,
        {cascade: true},
        //* No tiene sentido usar eager porque ya hago relations para extraer los datos en el metodo find
        // {cascade: true, eager: true}
    )
    foodStandDishes?: FoodStandDish[];
}
