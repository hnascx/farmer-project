import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCPF(cpf: string) {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
}

export function formatPhone(phone: string) {
  return phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
}

export function formatDate(date: string | undefined) {
  if (!date) return "-"
  // Adiciona um dia na exibição para compensar o timezone
  const d = new Date(date)
  d.setDate(d.getDate() + 1)
  return d.toLocaleDateString("pt-BR")
}

export function maskCPF(value: string) {
  return value
    .replace(/\D/g, "") // Remove tudo que não é dígito
    .replace(/(\d{3})(\d)/, "$1.$2") // Coloca ponto após 3 dígitos
    .replace(/(\d{3})(\d)/, "$1.$2") // Coloca ponto após 3 dígitos
    .replace(/(\d{3})(\d{1,2})/, "$1-$2") // Coloca hífen entre 3 e 2 dígitos
    .replace(/(-\d{2})\d+?$/, "$1") // Mantém apenas os 11 dígitos
}

export function maskPhone(value: string) {
  return value
    .replace(/\D/g, "") // Remove tudo que não é dígito
    .replace(/(\d{2})(\d)/, "($1) $2") // Coloca parênteses em volta dos dois primeiros dígitos
    .replace(/(\d{5})(\d)/, "$1-$2") // Coloca hífen entre o quinto e o sexto dígitos
    .replace(/(-\d{4})\d+?$/, "$1") // Mantém apenas 11 dígitos
}

export function unmask(value: string) {
  return value.replace(/\D/g, "")
}
