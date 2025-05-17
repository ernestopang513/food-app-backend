import { Exclude } from "class-transformer";
import { Order } from "src/order/entities/order.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ValidRoles } from "../interfaces/valid-roles";
import { ApiProperty } from "@nestjs/swagger";



@Entity('users')
export class User {

    @ApiProperty({
        example: 'c8aeeb0b-f04b-40c1-9294-4b37576a4959',
        description: 'User ID',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'jose@hotmail.com',
        description: 'Email del usuario',
        uniqueItems: true
    })
    @Column('text', {
        unique: true
    })
    email: string;
    
    @ApiProperty({
        example: 'OsitoFi',
        description: 'UserName del usuario',
        uniqueItems: true
    })
    @Column('text', {
        unique: true
    })
    userName: string;
    
    @ApiProperty({
        example: 'Jose Perez Martinez',
        description: 'Nombre completo del usuario',
    })
    @Column('text')
    fullName: string;

    @ApiProperty({
        example: 'Abc123',
        description: 'Contraseña del usuario',
    })
    @Exclude()
    @Column('text', {
        select: false
    })
    password: string;

    @ApiProperty({
        example: true,
        description: 'Indicador para saber si el user esta activo',
        default: true
    })
    @Column('bool', {
        default: true
    })
    isActive: boolean;

    @ApiProperty({
        enum: ValidRoles,
        enumName: 'ValidRoles',
        example: ValidRoles.USER,
        description: 'Role del usuario',
        default: ValidRoles.USER
    })
    @Column({
        type: 'enum',
        enum: ValidRoles,
        nullable: false,
        default: ValidRoles.USER
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
        this.userName = this.userName
            .normalize('NFD')                          // Decompose accented characters
            .replace(/[\u0300-\u036f]/g, '')          // Remove accents
            .replace(/[^a-zA-Z0-9_]/g, '')            // Allow only letters, numbers, underscore
            .replace(/\s+/g, '')                      // Remove all spaces
            .toLowerCase();                           // Optional: convert to lowercase
    }

    @BeforeUpdate()
    checkFieldBeforeUpdate() {
        this.checkFieldsBeforeInsert();
    }

}
