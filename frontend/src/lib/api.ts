import {
  CreateFarmerDTO,
  Farmer,
  FarmerFilters,
  PaginatedFarmers,
  UpdateFarmerDTO,
} from "@/types/farmer"
import axios from "axios"

if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL não definida")
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

export const farmerApi = {
  // Criar agricultor
  create: async (data: CreateFarmerDTO): Promise<Farmer> => {
    const response = await api.post("/farmers", data)
    return response.data
  },

  // Listar agricultores com paginação e filtros
  list: async (
    page: number = 1,
    limit: number = 20,
    filters?: FarmerFilters
  ): Promise<PaginatedFarmers> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters?.fullName && { fullName: filters.fullName }),
      ...(filters?.cpf && { cpf: filters.cpf }),
      ...(filters?.active !== undefined && {
        active: filters.active.toString(),
      }),
    })

    const response = await api.get(`/farmers?${params}`)
    return response.data
  },

  // Buscar agricultor por ID
  getById: async (id: string): Promise<Farmer> => {
    const response = await api.get(`/farmers/${id}`)
    return response.data
  },

  // Atualizar perfil do agricultor
  updateProfile: async (id: string, data: UpdateFarmerDTO): Promise<Farmer> => {
    const response = await api.put(`/farmers/${id}/profile`, data)
    return response.data
  },

  // Alternar status do agricultor (ativo/inativo)
  toggleStatus: async (id: string): Promise<Farmer> => {
    const response = await api.patch(`/farmers/${id}/status`)
    return response.data
  },

  // Remover agricultor
  remove: async (id: string): Promise<void> => {
    await api.delete(`/farmers/${id}`)
  },
}

export default api
