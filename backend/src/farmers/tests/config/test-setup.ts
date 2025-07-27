import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { Farmer } from '../../schemas/farmer.schema';
import { FarmerService } from '../../services/farmer.service';

interface MockFarmer extends Partial<Farmer> {
  _id: string;
  fullName: string;
  cpf: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const mockFarmer: MockFarmer = {
  _id: 'some-id',
  fullName: 'John Doe',
  cpf: '12345678901',
  active: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export interface TestContext {
  service: FarmerService;
  model: Model<Farmer>;
}

export const createTestContext = async (
  modelMock: Partial<Model<Farmer>>,
): Promise<TestContext> => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      FarmerService,
      {
        provide: getModelToken(Farmer.name),
        useValue: modelMock,
      },
    ],
  }).compile();

  return {
    service: module.get<FarmerService>(FarmerService),
    model: module.get<Model<Farmer>>(getModelToken(Farmer.name)),
  };
};

export const createValidatorContext = <T>(ValidatorClass: new () => T): T => {
  return new ValidatorClass();
};
