import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatCPF, formatDate, formatPhone } from "@/lib/utils"
import { Farmer } from "@/types/farmer"
import { Power, Trash2 } from "lucide-react"
import { EditFarmerModal } from "./edit-farmer-modal"

interface FarmersTableProps {
  farmers: Farmer[]
  onToggleStatus: (farmer: Farmer) => void
  onDelete: (farmer: Farmer) => void
  onRefresh: () => void
}

export function FarmersTable({
  farmers,
  onToggleStatus,
  onDelete,
  onRefresh,
}: FarmersTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-slate-200">Nome</TableHead>
          <TableHead className="text-slate-200">CPF</TableHead>
          <TableHead className="text-slate-200">Telefone</TableHead>
          <TableHead className="text-slate-200">Data de Nascimento</TableHead>
          <TableHead className="text-slate-200">Status</TableHead>
          <TableHead className="text-slate-200">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {farmers?.map((farmer) => (
          <TableRow key={farmer._id} className="border-slate-700">
            <TableCell className="text-slate-300">{farmer.fullName}</TableCell>
            <TableCell className="text-slate-300">
              {formatCPF(farmer.cpf)}
            </TableCell>
            <TableCell className="text-slate-300">
              {farmer.phone ? formatPhone(farmer.phone) : "-"}
            </TableCell>
            <TableCell className="text-slate-300">
              {formatDate(farmer.birthDate)}
            </TableCell>
            <TableCell>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  farmer.active
                    ? "bg-green-900 text-green-200"
                    : "bg-red-900 text-red-200"
                }`}
              >
                {farmer.active ? "Ativo" : "Inativo"}
              </span>
            </TableCell>
            <TableCell className="space-x-2">
              <EditFarmerModal farmer={farmer} onSuccess={onRefresh} />
              <Button
                variant="outline"
                size="icon"
                onClick={() => onToggleStatus(farmer)}
                className="border-slate-700 hover:bg-slate-800"
              >
                <Power className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onDelete(farmer)}
                disabled={farmer.active}
                className="border-slate-700 hover:bg-slate-800 disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
