
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';
import { OrdersSocketGateway } from './ordersSocket.gateway';

interface ConnectedClinets {
    [id: string] : {
        socket: Socket,
        user: User,
    }
}


@Injectable()
export class OrdersSocketService {

    
    private connectedClients: ConnectedClinets = {}

    constructor (
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        // private readonly gateway: OrdersGateway
    ) {}


    async registerClient(client: Socket, userId: string) {

        const user = await this.userRepository.findOneBy({id: userId, isActive: true})
        if(!user) throw new Error('User not found');
        if(!user.isActive) throw new Error('User not active');


        this.connectedClients[client.id] = {
            socket: client,
            user: user,
        }

    }

    getConnectedClients() {
        return this.connectedClients
    }

    getSocketById(id: string): Socket {
        return this.connectedClients[id].socket;
    }

    removeClient(clientId: string) {
        delete this.connectedClients[clientId]
    }


    // emitOrderChangeToAll(order: { deliveryPointId: string; orderId: string }) {
    // this.gateway.emitOrderAssigned(order);
//   }


    //////////////////////
}
