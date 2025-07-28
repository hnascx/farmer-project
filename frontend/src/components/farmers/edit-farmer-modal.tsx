"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { farmerApi } from "@/lib/api"
import {
  updateFarmerSchema,
  type UpdateFarmerInput,
} from "@/lib/schemas/farmer-schema"
import { Farmer } from "@/types/farmer"
import { zodResolver } from "@hookform/resolvers/zod"
import { Pencil } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"

interface EditFarmerModalProps {
  farmer: Farmer
  onSuccess: () => void
}

export function EditFarmerModal({ farmer, onSuccess }: EditFarmerModalProps) {
  const [open, setOpen] = useState(false)

  const form = useForm<UpdateFarmerInput>({
    resolver: zodResolver(updateFarmerSchema),
    defaultValues: {
      fullName: farmer.fullName,
      birthDate: farmer.birthDate?.split("T")[0] || undefined,
      phone: farmer.phone || undefined,
      active: farmer.active,
    },
  })

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset()
    } else {
      form.reset({
        fullName: farmer.fullName,
        birthDate: farmer.birthDate?.split("T")[0] || undefined,
        phone: farmer.phone || undefined,
        active: farmer.active,
      })
    }
    setOpen(open)
  }

  async function onSubmit(data: UpdateFarmerInput) {
    try {
      const formattedData = {
        ...data,
        birthDate: data.birthDate?.split("T")[0] || "",
      }

      await farmerApi.updateProfile(farmer._id, formattedData)
      onSuccess()
      setOpen(false)
    } catch (error: any) {
      console.error("Erro ao atualizar agricultor:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Agricultor</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormItem>
              <FormLabel>CPF</FormLabel>
              <FormControl>
                <Input
                  value={farmer.cpf}
                  disabled
                  className="bg-slate-800 text-slate-400"
                />
              </FormControl>
            </FormItem>

            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="birthDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Nascimento</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite o telefone"
                      maxLength={11}
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "")
                        field.onChange(value)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Salvar Alterações
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
