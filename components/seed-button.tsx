"use client"

import { Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { seedActivities } from "@/app/actions";
import { toast } from "sonner";

export function SeedButton() {
  const handleSeed = async () => {
    const toastId = toast.loading("Gerando dados de exemplo...");
    try {
      const result = await seedActivities();
      if (result.success) {
        toast.success("Dados gerados com sucesso!", { id: toastId });
      } else {
        toast.error(result.error || "Falha ao gerar dados.", { id: toastId });
      }
    } catch {
      toast.error("Erro ao conectar com o servidor.", { id: toastId })
    }

  };

  return (
    <Button 
      variant="outline" 
      onClick={handleSeed}
      className="h-9 md:h-11 gap-2 border-zinc-200 hover:bg-zinc-50 text-zinc-600 rounded-lg md:rounded-xl text-xs md:text-sm shadow-sm"
    >
      <Database className="h-4 w-4 md:h-5 md:w-5" />
      <span className="hidden lg:inline">Gerar Dados de Exemplo</span>
      <span className="lg:hidden">Seed</span>
    </Button>
  );
}
