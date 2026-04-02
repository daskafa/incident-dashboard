import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      status: 'ok',
      message: 'Incident Management API is running',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    };
  }
}
