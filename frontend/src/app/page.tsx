"use client"

import { CreateFarmerModal } from "@/components/farmers/create-farmer-modal"
import { FarmersTable } from "@/components/farmers/farmers-table"
import { Logo } from "@/components/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { Input } from "@/components/ui/input"
import { Pagination } from "@/components/ui/pagination"
import { useLoading } from "@/contexts/loading-context"
import { farmerApi } from "@/lib/api"
import { defaultMessages, notifications } from "@/lib/notifications"
import { Farmer, FarmerFilters } from "@/types/farmer"
import { ChevronDown } from "lucide-react"
import { useEffect, useState } from "react"
import { useDebounce } from "../hooks/use-debounce"

export default function Home() {
  const [farmers, setFarmers] = useState<Farmer[]>([])
  const [filters, setFilters] = useState<FarmerFilters>({})
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const { showLoading, hideLoading } = useLoading()

  const debouncedFilters = useDebounce(filters, 500)

  async function loadFarmers(page = currentPage) {
    try {
      showLoading()
      const response = await farmerApi.list(page, 20, filters)
      setFarmers(response.farmers)
      setTotalPages(response.totalPages)
      setCurrentPage(page)
    } catch (error) {
      notifications.error("Erro ao carregar agricultores.")
    } finally {
      hideLoading()
    }
  }

  useEffect(() => {
    loadFarmers(1)
  }, [debouncedFilters])

  const handleToggleStatus = async (farmer: Farmer) => {
    try {
      showLoading()
      await farmerApi.toggleStatus(farmer._id)
      await loadFarmers(currentPage)
      notifications.success(
        `Status do agricultor ${
          farmer.active ? "desativado" : "ativado"
        } com sucesso!`
      )
    } catch (error) {
      notifications.error("Erro ao alterar status do agricultor.")
    } finally {
      hideLoading()
    }
  }

  const handleDelete = async (farmer: Farmer) => {
    if (farmer.active) {
      notifications.error("Não é possível excluir um agricultor ativo")
      return
    }

    try {
      showLoading()
      await farmerApi.remove(farmer._id)
      await loadFarmers(currentPage)
      notifications.success(defaultMessages.delete.success)
    } catch (error) {
      notifications.error(defaultMessages.delete.error)
    } finally {
      hideLoading()
    }
  }

  const handlePageChange = (page: number) => {
    loadFarmers(page)
  }

  return (
    <div className="py-10">
      {/* Mobile Layout */}
      <div className="flex flex-col gap-4 sm:hidden">
        <div className="flex justify-between items-center">
          <Logo />
          <ThemeToggle />
        </div>

        <div className="text-center">
          <h1 className="text-xl text-foreground">
            Gestão de Agricultores
          </h1>
        </div>

        <div className="w-full">
          <CreateFarmerModal
            onSuccess={() => loadFarmers(currentPage)}
            className="w-full"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Input
            placeholder="Filtrar por nome..."
            value={filters.fullName || ""}
            onChange={(e) => {
              const value = e.target.value
              setFilters((prev) => ({
                ...prev,
                fullName: value,
              }))
            }}
            className="bg-background border-border h-10"
          />
          <div className="flex gap-2">
            <Input
              placeholder="Filtrar por CPF..."
              value={filters.cpf || ""}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "")
                setFilters((prev) => ({
                  ...prev,
                  cpf: value,
                }))
              }}
              className="bg-background border-border flex-1 h-10"
            />
            <div className="relative w-30 mb-4">
              <select
                className="w-full h-10 px-3 py-2 rounded-md bg-background border-border text-foreground cursor-pointer appearance-none pr-10 text-sm"
                value={filters.active?.toString() || ""}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    active:
                      e.target.value === ""
                        ? undefined
                        : e.target.value === "true",
                  }))
                }
              >
                <option value="">Todos</option>
                <option value="true">Ativos</option>
                <option value="false">Inativos</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:block">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-6">
            <Logo />
            <div className="h-8 w-px bg-border" />
            <h1 className="text-xl text-foreground">
              Gestão de Agricultores
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <CreateFarmerModal onSuccess={() => loadFarmers(currentPage)} />
            <ThemeToggle />
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <Input
            placeholder="Filtrar por nome..."
            value={filters.fullName || ""}
            onChange={(e) => {
              const value = e.target.value
              setFilters((prev) => ({
                ...prev,
                fullName: value,
              }))
            }}
            className="bg-background border-border"
          />
          <Input
            placeholder="Filtrar por CPF..."
            value={filters.cpf || ""}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "")
              setFilters((prev) => ({
                ...prev,
                cpf: value,
              }))
            }}
            className="bg-background border-border"
          />
          <div className="relative inline-block">
            <select
              className="px-3 py-2 rounded-md bg-background border-border text-foreground cursor-pointer appearance-none pr-10 text-sm"
              value={filters.active?.toString() || ""}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  active:
                    e.target.value === ""
                      ? undefined
                      : e.target.value === "true",
                }))
              }
            >
              <option value="">Todos</option>
              <option value="true">Ativos</option>
              <option value="false">Inativos</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>

      <FarmersTable
        farmers={farmers}
        onToggleStatus={handleToggleStatus}
        onDelete={handleDelete}
        onRefresh={() => loadFarmers(currentPage)}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  )
}
