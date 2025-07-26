import { Types } from 'mongoose';

export interface FarmerResponse {
  _id: Types.ObjectId;
  fullName: string;
  cpf: string;
  birthDate?: Date;
  phone?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
