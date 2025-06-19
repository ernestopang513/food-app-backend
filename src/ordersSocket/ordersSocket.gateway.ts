import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { OrdersSocketService } from './ordersSocket.service';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces';

@WebSocketGateway({cors: true})
export class OrdersSocketGateway implements OnGatewayConnection, OnGatewayDisconnect {

@WebSocketServer()
    server: Server;

  constructor(
    private readonly ordersSocketService: OrdersSocketService,
    private readonly jwtService: JwtService
  ) {}


  async handleConnection(client: Socket) {

    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload;
    try {
      // console.log(token)
      // console.log(client)
      payload = this.jwtService.verify(token);
      await this.ordersSocketService.registerClient(client, payload.id);
    } catch (error) {
      client.disconnect();
      return;
    }

    // console.log({payload})
    // const clients = this.ordersSocketService.getConnectedClients();
    // console.log(clients)

  }
  
  
  handleDisconnect(client: Socket) {
    this.ordersSocketService.removeClient(client.id)
  }


  emitOrderUpdate(data: { deliveryPointId: string; orderId: string, foodStandId: string }) {

    const clients = this.ordersSocketService.getConnectedClients()

    for(const client of Object.values(clients)) {
      client.socket.emit('order-assigned', data)
    }

    // for (const clientId of clients) {

    // }

    // this.server.emit('order-assigned', data);
  }


  // emitToAll(event: string, payload:any) {
  //       Object.values(this.connectedClients).forEach(({socket}) => {
  //           socket.emit(event,payload);
  //       })
    // // }
    // emitOrderAssigned(order: {deliveryPointId: string, orderId:string}) {
    //     console.log('Emitting order-assigned', order);
    //     this.server.emit('order-assigned', order)
    // }
    // // emitOrderChangeToAll(order: {deliveryPointId: string, orderId:string}) {
    //     Object.values(this.connectedClients).forEach(({socket}) => {
    //         socket.emit('order-assigned', order);
    //     })
    // }


}
