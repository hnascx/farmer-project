import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import {
  CreateFarmerDto,
  createFarmerSchema,
  FarmerParams,
  farmerParamsSchema,
  UpdateFarmerProfileDto,
  updateFarmerProfileSchema,
} from '../schemas/farmer.zod';
import { FarmerService } from '../services/farmer.service';

@Controller('farmers')
export class FarmerController {
  constructor(private readonly farmerService: FarmerService) {}

  @Post()
  create(
    @Body(new ZodValidationPipe(createFarmerSchema))
    createFarmerDto: CreateFarmerDto,
  ) {
    return this.farmerService.create(createFarmerDto);
  }

  @Get()
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @Query('fullName') fullName?: string,
    @Query('cpf') cpf?: string,
    @Query('active') active?: string,
  ) {
    const filters = {
      ...(fullName && { fullName }),
      ...(cpf && { cpf }),
      ...(active && { active: active === 'true' }),
    };

    return this.farmerService.findAll(
      parseInt(page, 10),
      parseInt(limit, 10),
      filters,
    );
  }

  @Get(':id')
  findOne(
    @Param(new ZodValidationPipe(farmerParamsSchema))
    params: FarmerParams,
  ) {
    return this.farmerService.findOne(params.id);
  }

  @Put(':id/profile')
  updateProfile(
    @Param(new ZodValidationPipe(farmerParamsSchema))
    params: FarmerParams,
    @Body(new ZodValidationPipe(updateFarmerProfileSchema))
    updateFarmerProfileDto: UpdateFarmerProfileDto,
  ) {
    return this.farmerService.updateProfile(params.id, updateFarmerProfileDto);
  }

  @Patch(':id/status')
  updateStatus(
    @Param(new ZodValidationPipe(farmerParamsSchema))
    params: FarmerParams,
  ) {
    return this.farmerService.updateStatus(params.id);
  }

  @Delete(':id')
  remove(
    @Param(new ZodValidationPipe(farmerParamsSchema))
    params: FarmerParams,
  ) {
    return this.farmerService.remove(params.id);
  }
}
