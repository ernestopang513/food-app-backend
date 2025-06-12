import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";
import { Dish } from "src/dish/entities/dish.entity";


@Entity()
export class OrderDish {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'int',
    })
    quantity: number;

    @Column({
        type: 'int',
    })
    subtotal: number;

    @ManyToOne(

        () => Order,
        (order) => order.orderDish,
        {onDelete: 'CASCADE', eager: false}  

    )
    // @JoinColumn({name: 'orderId'})
    order: Order;

    @ManyToOne(
        () => Dish,
        (dish) => dish.orderDishes,
        {onDelete: 'CASCADE'}
    )
    dish: Dish;
}














