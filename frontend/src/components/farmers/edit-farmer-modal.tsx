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
import { useLoading } from "@/contexts/loading-context"
import { farmerApi } from "@/lib/api"
import { defaultMessages, notifications } from "@/lib/notifications"
import {
  updateFarmerSchema,
  type UpdateFarmerInput,
} from "@/lib/schemas/farmer-schema"
import { maskCPF, maskPhone, unmask } from "@/lib/utils"
import { Farmer } from "@/types/farmer"
import { zodResolver } from "@hookform/resolvers/zod"
import { Calendar, Pencil } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"

interface EditFarmerModalProps {
  farmer: Farmer
  onSuccess: () => void
}

export function EditFarmerModal({ farmer, onSuccess }: EditFarmerModalProps) {
  const [open, setOpen] = useState(false)
  const { showLoading, hideLoading } = useLoading()

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
      showLoading()
      const formattedData = {
        ...data,
        birthDate: data.birthDate?.split("T")[0] || "",
      }

      await farmerApi.updateProfile(farmer._id, formattedData)
      onSuccess()
      setOpen(false)
      notifications.success(defaultMessages.update.success)
    } catch (error: any) {
      notifications.error(defaultMessages.update.error)
    } finally {
      hideLoading()
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
                  value={maskCPF(farmer.cpf)}
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
                    <div
                      className="relative cursor-pointer"
                      onClick={() => {
                        const input = document.getElementById(
                          "birth-date"
                        ) as HTMLInputElement
                        input?.showPicker()
                      }}
                    >
                      <Input
                        id="birth-date"
                        type="date"
                        {...field}
                        value={field.value || ""}
                        className="appearance-none pr-10 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:absolute"
                      />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
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
                      maxLength={15}
                      {...field}
                      value={maskPhone(field.value || "")}
                      onChange={(e) => {
                        const unmasked = unmask(e.target.value)
                        field.onChange(unmasked)
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
