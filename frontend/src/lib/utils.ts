import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCPF(cpf: string) {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
}

export function formatPhone(phone: string) {
  const cleaned = phone.replace(/\D/g, "")
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
  }
  return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3")
}

export function formatDate(date: string | undefined | null): string {
  if (!date) return "-"
  try {
    // Pegar a data e adicionar o timezone local
    const [year, month, day] = date.split("T")[0].split("-")
    const localDate = new Date(Number(year), Number(month) - 1, Number(day))
    return localDate.toLocaleDateString("pt-BR")
  } catch {
    return "-"
  }
}
