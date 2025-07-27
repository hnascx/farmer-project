import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FarmerController } from './controllers/farmer.controller';
import { Farmer, FarmerSchema } from './schemas/farmer.schema';
import { FarmerService } from './services/farmer.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Farmer.name, schema: FarmerSchema }]),
  ],
  controllers: [FarmerController],
  providers: [FarmerService],
})
export class FarmerModule {}
