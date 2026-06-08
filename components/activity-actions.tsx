"use client"

import { MoreHorizontal, CheckCircle, Trash, Edit } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { updateActivity, deleteActivity } from "@/app/actions";
import { useState } from "react";
import { ActivityModal } from "./activity-modal";

interface ActivityActionsProps {
  activity: any;
}

export function ActivityActions({ activity }: ActivityActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const handleComplete = async () => {
    const formData = new FormData();
    formData.append("title", activity.title);
    formData.append("description", activity.description);
    formData.append("priority", activity.priority);
    formData.append("category", activity.category);
    formData.append("teamResponsible", activity.teamResponsible);
    formData.append("personResponsible", activity.personResponsible);
    formData.append("status", "CONCLUIDA");
    
    await updateActivity(activity.id, formData);
  };

  const handleDelete = async () => {
    await deleteActivity(activity.id);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => setShowDetailsModal(true)} className="gap-2">
            <Edit className="h-4 w-4 text-zinc-600" />
            Ver Detalhes
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleComplete} className="gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            Marcar como Concluída
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setShowEditModal(true)} className="gap-2">
            <Edit className="h-4 w-4 text-blue-600" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem 
            onSelect={() => setShowDeleteDialog(true)} 
            className="gap-2 text-red-600 focus:text-red-600"
          >
            <Trash className="h-4 w-4" />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ActivityModal 
        activityToEdit={activity} 
        isOpen={showDetailsModal} 
        onOpenChange={setShowDetailsModal}
        mode="details"
      />

      <ActivityModal 
        activityToEdit={activity} 
        isOpen={showEditModal} 
        onOpenChange={setShowEditModal}
        mode="edit"
      />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza que deseja excluir esta atividade?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente a atividade
              do nosso banco de dados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Confirmar Exclusão
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
