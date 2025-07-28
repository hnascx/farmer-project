import { Types } from 'mongoose';
import { z } from 'zod';

// Função auxiliar para validação de CPF
const validateCPF = (cpf: string) => {
  const cleanCPF = cpf.replace(/[^\d]/g, '');

  if (cleanCPF.length !== 11) return false;
  if (/^(\d)\1+$/.test(cleanCPF)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit > 9) digit = 0;
  if (digit !== parseInt(cleanCPF.charAt(9))) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit > 9) digit = 0;
  if (digit !== parseInt(cleanCPF.charAt(10))) return false;

  return true;
};

export const farmerParamsSchema = z.object({
  id: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'ID inválido')
    .refine((val) => Types.ObjectId.isValid(val), 'ID inválido'),
});

export const createFarmerSchema = z.object({
  fullName: z
    .string()
    .min(3, 'Nome completo deve ter no mínimo 3 caracteres')
    .nonempty('Nome completo é obrigatório'),

  cpf: z
    .string()
    .nonempty('CPF é obrigatório')
    .transform((val) => val.replace(/[^\d]/g, ''))
    .refine(validateCPF, 'CPF inválido'),

  birthDate: z
    .union([
      z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD')
        .refine((val) => {
          const date = new Date(val);
          return !isNaN(date.getTime());
        }, 'Data de nascimento inválida')
        .refine((val) => {
          const date = new Date(val);
          const minDate = new Date(1900, 0, 1);
          const now = new Date();
          return date > minDate && date <= now;
        }, 'Data de nascimento deve estar entre 01/01/1900 e a data atual'),
      z.undefined(),
    ])
    .optional(),

  phone: z
    .string()
    .transform((val) => val.replace(/[^\d]/g, ''))
    .refine((val) => {
      if (!val) return true; // opcional
      if (val.length !== 10 && val.length !== 11) return false;
      const ddd = val.substring(0, 2);
      return /^[1-9][0-9]$/.test(ddd); // DDD válido entre 11 e 99
    }, 'Telefone inválido (deve ser um número válido com DDD)')
    .optional(),

  active: z
    .union([
      z.boolean(),
      z
        .string()
        .refine(
          (val) => val === 'true' || val === 'false',
          'O campo active deve ser um booleano (true/false)',
        )
        .transform((val) => val === 'true'),
    ])
    .default(true),
});

export const updateFarmerProfileSchema = z
  .object({
    fullName: z
      .string()
      .min(3, 'Nome completo deve ter no mínimo 3 caracteres')
      .optional(),

    birthDate: z
      .union([
        z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD')
          .transform((val) => {
            // Forçar timezone para UTC
            return new Date(`${val}T00:00:00.000Z`).toISOString().split('T')[0];
          })
          .refine((val) => {
            const date = new Date(val + 'T00:00:00.000Z');
            return !isNaN(date.getTime());
          }, 'Data de nascimento inválida')
          .refine((val) => {
            const date = new Date(val + 'T00:00:00.000Z');
            const minDate = new Date('1900-01-01T00:00:00.000Z');
            const now = new Date();
            return date > minDate && date <= now;
          }, 'Data de nascimento deve estar entre 01/01/1900 e a data atual'),
        z.undefined(),
      ])
      .optional(),

    phone: z
      .string()
      .transform((val) => val.replace(/[^\d]/g, ''))
      .refine((val) => {
        if (!val) return true;
        if (val.length !== 10 && val.length !== 11) return false;
        const ddd = val.substring(0, 2);
        return /^[1-9][0-9]$/.test(ddd);
      }, 'Telefone inválido (deve ser um número válido com DDD)')
      .optional(),

    active: z.boolean().optional(),
  })
  .strict();

export type CreateFarmerDto = z.infer<typeof createFarmerSchema>;
export type UpdateFarmerProfileDto = z.infer<typeof updateFarmerProfileSchema>;
export type FarmerParams = z.infer<typeof farmerParamsSchema>;
