import { FoodStand } from "src/food-stands/entities/food-stand.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";



@Entity()
export class FoodStandDish {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('int' , {
        default: 0
    })
    quantity: number;

    @Column({
        type: "bool",
        default: true
    })
    is_active: boolean;

    @ManyToOne(
        () => FoodStand,
        ( foodStand ) => foodStand.foodStandDishes,
        {onDelete: 'CASCADE'}
    )
    foodStand: FoodStand;
}
