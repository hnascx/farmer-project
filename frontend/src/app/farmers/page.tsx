"use client"

import { CreateFarmerModal } from "@/components/farmers/create-farmer-modal"
import { FarmersTable } from "@/components/farmers/farmers-table"
import { Input } from "@/components/ui/input"
import { farmerApi } from "@/lib/api"
import { Farmer, FarmerFilters } from "@/types/farmer"
import { useEffect, useState } from "react"

export default function FarmersPage() {
  const [farmers, setFarmers] = useState<Farmer[]>([])
  const [filters, setFilters] = useState<FarmerFilters>({})
  const [loading, setLoading] = useState(true)

  async function loadFarmers() {
    try {
      setLoading(true)
      const response = await farmerApi.list(1, 20, filters)
      setFarmers(response.farmers)
    } catch (error) {
      console.error("Erro ao carregar agricultores:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFarmers()
  }, [filters])

  const handleToggleStatus = async (farmer: Farmer) => {
    try {
      await farmerApi.toggleStatus(farmer._id)
      await loadFarmers()
    } catch (error) {
      console.error("Erro ao alterar status:", error)
    }
  }

  const handleDelete = async (farmer: Farmer) => {
    if (farmer.active) {
      alert("Não é possível excluir um agricultor ativo")
      return
    }

    if (!confirm("Tem certeza que deseja excluir este agricultor?")) {
      return
    }

    try {
      await farmerApi.remove(farmer._id)
      await loadFarmers()
    } catch (error) {
      console.error("Erro ao excluir agricultor:", error)
    }
  }

  return (
    <div className="py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-50">Agricultores</h1>
        <CreateFarmerModal onSuccess={loadFarmers} />
      </div>

      <div className="flex gap-4 mb-6">
        <Input
          placeholder="Filtrar por nome..."
          value={filters.fullName || ""}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, fullName: e.target.value }))
          }
          className="bg-slate-900"
        />
        <Input
          placeholder="Filtrar por CPF..."
          value={filters.cpf || ""}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, cpf: e.target.value }))
          }
          className="bg-slate-900"
        />
        <select
          className="px-3 py-2 rounded-md bg-slate-900 border-slate-700 text-slate-50"
          value={filters.active?.toString() || ""}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              active:
                e.target.value === "" ? undefined : e.target.value === "true",
            }))
          }
        >
          <option value="">Todos</option>
          <option value="true">Ativos</option>
          <option value="false">Inativos</option>
        </select>
      </div>

      {loading ? (
        <div className="text-slate-50">Carregando...</div>
      ) : (
        <FarmersTable
          farmers={farmers}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDelete}
          onRefresh={loadFarmers}
        />
      )}
    </div>
  )
}
