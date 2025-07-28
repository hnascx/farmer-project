import { toast } from "sonner"

export const notifications = {
  success: (message: string) => {
    toast.success(message, {
      duration: 0,
      dismissible: true,
    })
  },
  error: (message: string) => {
    toast.error(message || "Ocorreu um erro. Tente novamente.", {
      duration: 0,
      dismissible: true,
    })
  },
}

export const defaultMessages = {
  create: {
    success: "Agricultor cadastrado com sucesso!",
    error: "Erro ao cadastrar agricultor.",
  },
  update: {
    success: "Agricultor atualizado com sucesso!",
    error: "Erro ao atualizar agricultor.",
  },
  delete: {
    success: "Agricultor removido com sucesso!",
    error: "Erro ao remover agricultor.",
  },
}
