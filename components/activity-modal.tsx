"use client"

import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription,
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createActivity, updateActivity } from "@/app/actions"
import { toast } from "sonner"

interface ActivityModalProps {
  activityToEdit?: any
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  children?: React.ReactNode
  mode?: "create" | "edit" | "details"
}

export function ActivityModal({ 
  activityToEdit, 
  isOpen: controlledOpen, 
  onOpenChange: setControlledOpen,
  children,
  mode = "create"
}: ActivityModalProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = controlledOpen !== undefined
  const isOpen = isControlled ? controlledOpen : internalOpen
  const onOpenChange = isControlled ? setControlledOpen : setInternalOpen

  const isEditing = mode === "edit"
  const isDetails = mode === "details"

  const handleSubmit = async (formData: FormData) => {
    if (isDetails) return

    const toastId = toast.loading(isEditing ? "Salvando alterações..." : "Criando atividade...")

    try {
      let result
      if (isEditing) {
        result = await updateActivity(activityToEdit.id, formData)
      } else {
        result = await createActivity(formData)
      }

      if (result.success) {
        toast.success(isEditing ? "Atividade atualizada com sucesso!" : "Atividade criada com sucesso!", { id: toastId })
        onOpenChange?.(false)
      } else {
        toast.error(result.error || "Ocorreu um erro inesperado", { id: toastId })
      }
    } catch (error) {
      toast.error("Erro de conexão com o servidor", { id: toastId })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isDetails ? "Detalhes da Atividade" : isEditing ? "Editar Atividade" : "Criar Nova Atividade"}
          </DialogTitle>
          <DialogDescription>
            {isDetails 
              ? "Informações completas sobre a demanda."
              : isEditing 
                ? "Atualize os detalhes da atividade abaixo." 
                : "Preencha os dados para registrar uma nova demanda."}
          </DialogDescription>
        </DialogHeader>
        <form 
          key={activityToEdit?.id || "new"}
          action={handleSubmit} 
          className="space-y-6 pt-4"
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input 
                id="title" 
                name="title" 
                placeholder="Ex: Ajuste no Layout" 
                defaultValue={activityToEdit?.title}
                readOnly={isDetails}
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea 
                id="description" 
                name="description" 
                placeholder="Descreva detalhadamente a atividade..." 
                className="min-h-[100px]"
                defaultValue={activityToEdit?.description}
                readOnly={isDetails}
                required 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Prioridade</Label>
                {isDetails ? (
                  <Input value={activityToEdit?.priority} readOnly />
                ) : (
                  <Select name="priority" defaultValue={activityToEdit?.priority} required>
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BAIXA">Baixa</SelectItem>
                      <SelectItem value="MEDIA">Média</SelectItem>
                      <SelectItem value="ALTA">Alta</SelectItem>
                      <SelectItem value="CRITICA">Crítica</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                {isDetails ? (
                  <Input value={activityToEdit?.category} readOnly />
                ) : (
                  <Select name="category" defaultValue={activityToEdit?.category} required>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BUG">Bug</SelectItem>
                      <SelectItem value="FEATURE">Feature</SelectItem>
                      <SelectItem value="MELHORIA">Melhoria</SelectItem>
                      <SelectItem value="SUPORTE">Suporte</SelectItem>
                      <SelectItem value="OPERACIONAL">Operacional</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="teamResponsible">Time Responsável</Label>
                <Input 
                  id="teamResponsible" 
                  name="teamResponsible" 
                  placeholder="Ex: Frontend" 
                  defaultValue={activityToEdit?.teamResponsible}
                  readOnly={isDetails}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="personResponsible">Responsável</Label>
                <Input 
                  id="personResponsible" 
                  name="personResponsible" 
                  placeholder="Nome da pessoa" 
                  defaultValue={activityToEdit?.personResponsible}
                  readOnly={isDetails}
                  required 
                />
              </div>
            </div>

            {(isEditing || isDetails) && (
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                {isDetails ? (
                  <Input value={activityToEdit?.status} readOnly />
                ) : (
                  <Select name="status" defaultValue={activityToEdit?.status} required>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDENTE">Pendente</SelectItem>
                      <SelectItem value="EM_ANDAMENTO">Em andamento</SelectItem>
                      <SelectItem value="CONCLUIDA">Concluída</SelectItem>
                      <SelectItem value="BLOQUEADA">Bloqueada</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4">
            {!isDetails && (
              <Button type="submit" className="w-full sm:w-auto">
                {isEditing ? "Salvar Alterações" : "Salvar Atividade"}
              </Button>
            )}
            {isDetails && (
              <Button type="button" onClick={() => onOpenChange?.(false)} className="w-full sm:w-auto">
                Fechar
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
