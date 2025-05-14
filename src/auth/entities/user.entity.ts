import { Exclude } from "class-transformer";
import { Order } from "src/order/entities/order.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";



@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        unique: true
    })
    email: string;
    
    @Column('text', {
        unique: true
    })
    userName: string;
    
    @Column('text')
    fullName: string;

    @Exclude()
    @Column('text', {
        select: false
    })
    password: string;

    @Column('bool', {
        default: true
    })
    isActive: boolean;

    @Column('text', {
        default: 'user'
    })
    role: string;


    @OneToMany(
        () => Order,
        (order) => order.user,
        {cascade: true} 
    )
    ordersCreated: Order[];
    
    @OneToMany(
        () => Order,
        (order) => order.deliveryUser,
        {cascade: true} 
    )
    ordersDelivered: Order[];
    
   


    @BeforeInsert()
    checkFieldsBeforeInsert() {
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldBeforeUpdate() {
        this.checkFieldsBeforeInsert();
    }

}
