import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Incident } from './entities/incident.entity';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000'],
    credentials: true,
  },
})
export class IncidentsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  notifyIncidentCreated(incident: Incident) {
    this.server.emit('incident:created', incident);
  }

  notifyIncidentUpdated(incident: Incident) {
    this.server.emit('incident:updated', incident);
  }

  notifyIncidentDeleted(id: string) {
    this.server.emit('incident:deleted', { id });
  }
}
