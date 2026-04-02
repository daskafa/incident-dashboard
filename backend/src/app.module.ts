import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IncidentsModule } from './incidents/incidents.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT || '5432', 10),
      username: process.env.DATABASE_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'postgres',
      database: process.env.DATABASE_NAME || 'incident_db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Only for development
      logging: false,
    }),
    IncidentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
