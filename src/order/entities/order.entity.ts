import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderStatus } from "../enums/order-status.enum";
import { OrderPaymentMethod } from "../enums/order-payment-method.enum";
import { OrderDish } from "./order-dish.entity";
import { DeliveryPoint } from "src/delivery-point/entities/delivery-point.entity";


@Entity()
export class Order {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('int',{
        nullable: false,
        default: 150
    })
    totalPrice: number;

    @Column({
        type: 'enum',
        enum: OrderStatus,
        nullable: false,
        default: OrderStatus.PENDIENTE,
    })
    status: OrderStatus;

    @Column({
        type: 'enum',
        enum: OrderPaymentMethod,
        nullable: false,
        default: OrderPaymentMethod.EFECTIVO,
    })
    paymentMethod: OrderPaymentMethod;

    @Column('int', {
        default: 0,
    })
    estimatedTimeMinutes: number;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;

    @OneToMany(
        () => OrderDish,
        (orderDish) => orderDish.order,
        {cascade: true} 
    )
    orderDish: OrderDish[];

    @ManyToOne(
        () => DeliveryPoint,
        (deliveryPoint) => deliveryPoint,
        {onDelete: 'CASCADE'}         
    )
    deliveryPoint: DeliveryPoint;
}
