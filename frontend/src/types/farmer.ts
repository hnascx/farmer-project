export interface Farmer {
  _id: string
  fullName: string
  cpf: string
  birthDate?: string
  phone?: string
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateFarmerDTO {
  fullName: string
  cpf: string
  birthDate?: string
  phone?: string
  active?: boolean
}

export interface UpdateFarmerDTO {
  fullName?: string
  birthDate?: string
  phone?: string
  active?: boolean
}

export interface FarmerFilters {
  fullName?: string
  cpf?: string
  active?: boolean
}

export interface PaginatedFarmers {
  farmers: Farmer[]
  total: number
  page: number
  totalPages: number
}
