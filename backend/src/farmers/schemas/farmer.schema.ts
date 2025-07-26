import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Farmer extends Document {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, unique: true })
  cpf: string;

  @Prop()
  birthDate?: Date;

  @Prop()
  phone?: string;

  @Prop({ default: true })
  active: boolean;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}

export const FarmerSchema = SchemaFactory.createForClass(Farmer);
