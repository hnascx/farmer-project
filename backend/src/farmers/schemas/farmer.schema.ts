import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
  toJSON: {
    transform: (_, ret: { __v?: any }) => {
      delete ret.__v;
      return ret;
    },
  },
})
export class Farmer extends Document {
  @Prop({ required: true })
  fullName: string;

  @Prop({
    required: true,
    unique: true,
    set: (cpf: string) => cpf.replace(/[^\d]/g, ''),
  })
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
