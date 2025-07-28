import { z } from "zod"

const phoneRegex = /^[1-9]{2}9?[0-9]{8}$/

export const createFarmerSchema = z
  .object({
    fullName: z
      .string()
      .nonempty("Nome completo é obrigatório")
      .min(3, "Nome deve ter no mínimo 3 caracteres"),

    cpf: z
      .string()
      .nonempty("CPF é obrigatório")
      .min(11, "CPF deve ter 11 dígitos e ser composto só por números"),

    birthDate: z
      .string()
      .refine((date) => {
        if (!date) return true
        const parsedDate = new Date(date)
        const minDate = new Date("1900-01-01")
        const today = new Date()
        return (
          !isNaN(parsedDate.getTime()) &&
          parsedDate >= minDate &&
          parsedDate <= today
        )
      }, "Data deve estar entre 01/01/1900 e hoje")
      .or(z.literal(""))
      .optional(),

    phone: z
      .string()
      .refine((phone) => {
        if (!phone) return true
        return phoneRegex.test(phone)
      }, "Telefone deve ter 10 ou 11 dígitos (DDD + número)")
      .or(z.literal(""))
      .optional(),

    active: z.boolean(),
  })
  .required({
    active: true,
  })

export const updateFarmerSchema = z.object({
  fullName: z
    .string()
    .min(3, "Nome deve ter no mínimo 3 caracteres")
    .optional(),

  birthDate: z
    .string()
    .optional()
    .refine((date) => {
      if (!date) return true
      const parsedDate = new Date(date + "T00:00:00") // Adicionando horário para evitar problemas de timezone
      const minDate = new Date("1900-01-01T00:00:00")
      const today = new Date(
        new Date().toISOString().split("T")[0] + "T00:00:00"
      )
      return parsedDate >= minDate && parsedDate <= today
    }, "Insira uma data válida"),

  phone: z
    .string()
    .refine((phone) => {
      if (!phone) return true
      return phoneRegex.test(phone)
    }, "Telefone deve ter 10 ou 11 dígitos (DDD + número)")
    .optional(),

  active: z.boolean().optional(),
})

export type CreateFarmerInput = z.infer<typeof createFarmerSchema>
export type UpdateFarmerInput = z.infer<typeof updateFarmerSchema>
