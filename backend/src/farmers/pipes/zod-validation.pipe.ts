import { BadRequestException, PipeTransform } from '@nestjs/common';
import { ZodError, ZodObject } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodObject<any>) {}

  transform(value: unknown) {
    try {
      return this.schema.parse(value);
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues[0].message;
        throw new BadRequestException(message);
      }
      throw error;
    }
  }
}
