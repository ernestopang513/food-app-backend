import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderStatus } from "../enums/order-status.enum";
import { OrderPaymentMethod } from "../enums/order-payment-method.enum";
import { OrderDish } from "./order-dish.entity";
import { DeliveryPoint } from "src/delivery-point/entities/delivery-point.entity";
import { User } from "src/auth/entities/user.entity";


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
        {cascade: true, eager: false} 
    )
    orderDish: OrderDish[];

    @ManyToOne(
        () => DeliveryPoint,
        (deliveryPoint) => deliveryPoint.order,
        {onDelete: 'CASCADE'}         
    )
    deliveryPoint: DeliveryPoint;
    
    @ManyToOne(
        () => User,
        (user) => user.ordersCreated,
        {onDelete: 'CASCADE'}         
    )
    user: User ;
    
    @ManyToOne(
        () => User,
        (user) => user.ordersDelivered,
        {onDelete: 'CASCADE'}         
    )
    // @JoinColumn({name: 'deliveryUserId'}) 
    deliveryUser: User ;
    
    // @Column({
    //     nullable: true
    // })
    // deliveryUserId: string;
}
