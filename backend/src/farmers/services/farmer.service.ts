import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Farmer } from '../schemas/farmer.schema';
import { CreateFarmerDto, UpdateFarmerProfileDto } from '../schemas/farmer.zod';

@Injectable()
export class FarmerService {
  constructor(@InjectModel(Farmer.name) private farmerModel: Model<Farmer>) {}

  async create(createFarmerDto: CreateFarmerDto): Promise<Farmer> {
    const existingFarmer = await this.farmerModel.findOne({
      cpf: createFarmerDto.cpf,
    });
    if (existingFarmer) {
      throw new BadRequestException('CPF já cadastrado');
    }

    const createdFarmer = new this.farmerModel(createFarmerDto);
    return createdFarmer.save();
  }

  async findAll(
    page = 1,
    limit = 20,
    filters?: { fullName?: string; cpf?: string; active?: boolean },
  ) {
    const query = {};

    if (filters?.fullName) {
      query['fullName'] = { $regex: filters.fullName, $options: 'i' };
    }
    if (filters?.cpf) {
      query['cpf'] = { $regex: filters.cpf, $options: 'i' };
    }
    if (filters?.active !== undefined) {
      query['active'] = filters.active;
    }

    const skip = (page - 1) * limit;

    const [farmers, total] = await Promise.all([
      this.farmerModel
        .find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      this.farmerModel.countDocuments(query),
    ]);

    return {
      farmers,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Farmer> {
    const farmer = await this.farmerModel.findById(id);
    if (!farmer) {
      throw new NotFoundException('Agricultor não encontrado');
    }
    return farmer;
  }

  async updateProfile(
    id: string,
    updateFarmerProfileDto: UpdateFarmerProfileDto,
  ): Promise<Farmer> {
    const updatedFarmer = await this.farmerModel
      .findOneAndUpdate(
        { _id: id },
        { $set: updateFarmerProfileDto },
        { new: true, runValidators: true },
      )
      .exec();

    if (!updatedFarmer) {
      throw new NotFoundException('Agricultor não encontrado');
    }

    return updatedFarmer;
  }

  async updateStatus(id: string): Promise<Farmer> {
    const farmer = await this.farmerModel.findById(id).exec();
    if (!farmer) {
      throw new NotFoundException('Agricultor não encontrado');
    }

    const updatedFarmer = await this.farmerModel
      .findOneAndUpdate(
        { _id: id },
        { $set: { active: !farmer.active } },
        { new: true, runValidators: true },
      )
      .exec();

    if (!updatedFarmer) {
      throw new NotFoundException('Agricultor não encontrado');
    }

    return updatedFarmer;
  }

  async remove(id: string): Promise<void> {
    const farmer = await this.farmerModel.findById(id).exec();
    if (!farmer) {
      throw new NotFoundException('Agricultor não encontrado');
    }

    if (farmer.active) {
      throw new BadRequestException(
        'Não é possível excluir um agricultor ativo',
      );
    }

    await this.farmerModel.findByIdAndDelete(id).exec();
  }
}
