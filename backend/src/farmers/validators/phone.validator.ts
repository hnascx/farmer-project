import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'phone', async: false })
export class PhoneValidator implements ValidatorConstraintInterface {
  validate(phone: string) {
    if (!phone) return true; // Opcional

    // Remove caracteres especiais
    const phoneNumber = phone.replace(/[^\d]/g, '');

    // Verifica se tem 10 ou 11 dígitos (com DDD)
    return phoneNumber.length >= 10 && phoneNumber.length <= 11;
  }

  defaultMessage() {
    return 'Formato de telefone inválido. Use (XX) XXXX-XXXX ou (XX) XXXXX-XXXX';
  }
}
