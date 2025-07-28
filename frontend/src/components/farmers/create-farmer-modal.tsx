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
  createFarmerSchema,
  type CreateFarmerInput,
} from "@/lib/schemas/farmer-schema"
import { cn, maskCPF, maskPhone, unmask } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { Calendar, Plus } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"

interface CreateFarmerModalProps {
  onSuccess: () => void
  className?: string
}

export function CreateFarmerModal({ onSuccess, className }: CreateFarmerModalProps) {
  const [open, setOpen] = useState(false)
  const { showLoading, hideLoading } = useLoading()

  const form = useForm<CreateFarmerInput>({
    resolver: zodResolver(createFarmerSchema),
    defaultValues: {
      fullName: "",
      cpf: "",
      birthDate: "",
      phone: "",
      active: true,
    },
  })

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset()
    }
    setOpen(open)
  }

  async function onSubmit(data: CreateFarmerInput) {
    try {
      showLoading()
      const formattedData = {
        ...data,
        birthDate: data.birthDate || undefined,
        phone: data.phone || undefined,
      }

      await farmerApi.create(formattedData)
      form.reset()
      onSuccess()
      setOpen(false)
      notifications.success(defaultMessages.create.success)
    } catch (error: any) {
      if (error.response?.data?.message === "CPF já cadastrado") {
        form.setError("cpf", { message: "CPF já cadastrado" })
        return
      }
      notifications.error(defaultMessages.create.error)
    } finally {
      hideLoading()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className={cn("justify-center sm:w-fit", className)}>
          <Plus className="mr-2 h-4 w-4" /> Novo Agricultor
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Novo Agricultor</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              name="cpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite o CPF"
                      maxLength={14}
                      {...field}
                      value={maskCPF(field.value)}
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
              Criar Agricultor
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
