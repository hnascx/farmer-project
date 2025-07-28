import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
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
import { Power, Trash2, UserX } from "lucide-react"
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
  const EmptyState = () => (
    <div className="flex flex-col items-center gap-2 mt-10 text-center text-muted-foreground">
      <UserX className="h-8 w-8" />
      <span>Nenhum agricultor encontrado</span>
    </div>
  )

  const StatusBadge = ({ active }: { active: boolean }) => (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${
        active
          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      }`}
    >
      {active ? "Ativo" : "Inativo"}
    </span>
  )

  const ActionButtons = ({ farmer }: { farmer: Farmer }) => (
    <div className="flex gap-2">
      <EditFarmerModal farmer={farmer} onSuccess={onRefresh} />

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="border-border hover:bg-accent"
          >
            <Power className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Alteração de status do agricultor
            </AlertDialogTitle>
            <AlertDialogDescription>
              Você tem certeza que deseja{" "}
              {farmer.active ? "desativar" : "ativar"} o agricultor{" "}
              {farmer.fullName}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => onToggleStatus(farmer)}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            disabled={farmer.active}
            className="border-border hover:bg-accent"
            title={
              farmer.active
                ? "Não é possível excluir um agricultor ativo"
                : "Excluir agricultor"
            }
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Exclusão de agricultor</AlertDialogTitle>
            <AlertDialogDescription>
              Você tem certeza que deseja excluir o agricultor {farmer.fullName}
              ? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => onDelete(farmer)}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )

  if (farmers.length === 0) {
    return <EmptyState />
  }

  return (
    <div
      className={farmers.length === 0 ? "pointer-events-none select-none" : ""}
    >
      {/* Versão Desktop */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-foreground">Nome</TableHead>
              <TableHead className="text-foreground">CPF</TableHead>
              <TableHead className="text-foreground">Telefone</TableHead>
              <TableHead className="text-foreground">
                Data de Nascimento
              </TableHead>
              <TableHead className="text-foreground">Status</TableHead>
              <TableHead className="text-foreground">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {farmers.map((farmer) => (
              <TableRow key={farmer._id} className="border-border">
                <TableCell className="text-muted-foreground">
                  {farmer.fullName}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatCPF(farmer.cpf)}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {farmer.phone ? formatPhone(farmer.phone) : "-"}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(farmer.birthDate)}
                </TableCell>
                <TableCell>
                  <StatusBadge active={farmer.active} />
                </TableCell>
                <TableCell>
                  <ActionButtons farmer={farmer} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Versão Mobile */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {farmers.map((farmer) => (
          <div
            key={farmer._id}
            className="bg-background rounded-lg border border-border p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-muted-foreground">
                {farmer.fullName}
              </h3>
              <StatusBadge active={farmer.active} />
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium text-foreground">CPF</span>
                <span className="text-muted-foreground">
                  {formatCPF(farmer.cpf)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-foreground">Telefone</span>
                <span className="text-muted-foreground">
                  {farmer.phone ? formatPhone(farmer.phone) : "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-foreground">
                  Data de Nascimento
                </span>
                <span className="text-muted-foreground">
                  {formatDate(farmer.birthDate)}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-border">
              <ActionButtons farmer={farmer} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
