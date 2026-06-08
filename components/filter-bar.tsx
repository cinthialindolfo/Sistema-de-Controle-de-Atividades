"use client"

import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useEffect, useState } from "react";

export function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Estados locais para controle imediato da UI
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [priority, setPriority] = useState(searchParams.get("priority") || "all");
  const [category, setCategory] = useState(searchParams.get("category") || "all");
  const [status, setStatus] = useState(searchParams.get("status") || "all");
  const [team, setTeam] = useState(searchParams.get("team") || "");
  const [person, setPerson] = useState(searchParams.get("person") || "");

  // Função para atualizar a URL
  const updateFilters = (newFilters: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== "all") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  // Debounce para busca de texto
  useEffect(() => {
    const timer = setTimeout(() => {
      const filtersToUpdate: Record<string, string> = {};
      
      if (search !== (searchParams.get("search") || "")) filtersToUpdate.search = search;
      if (team !== (searchParams.get("team") || "")) filtersToUpdate.team = team;
      if (person !== (searchParams.get("person") || "")) filtersToUpdate.person = person;

      if (Object.keys(filtersToUpdate).length > 0) updateFilters(filtersToUpdate);
    }, 500);

    return () => clearTimeout(timer);
  }, [search, team, person]);

  return (
    <div className={`bg-white rounded-xl border border-zinc-200 shadow-sm transition-all ${isPending ? "opacity-70" : "opacity-100"}`}>
      <div className="p-3 md:p-4">
        <div className="flex flex-col gap-3 md:grid md:grid-cols-6 md:gap-4">
          
          {/* Linha Principal: Busca e Botão de Filtro (Mobile) */}
          <div className="flex items-center gap-2 md:col-span-2 lg:col-span-1">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
              <input 
                placeholder="Buscar por título..." 
                className="flex h-10 w-full rounded-md border border-zinc-200 bg-zinc-50/50 px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-9" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              className={`md:hidden h-10 px-3 shrink-0 gap-2 font-medium text-xs ${isExpanded ? "bg-zinc-100 border-zinc-400" : ""}`}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              {isExpanded ? "Fechar" : "Filtros"}
            </Button>
          </div>

          {/* Filtros Secundários: Colapsáveis no Mobile, Sempre Visíveis no Desktop */}
          <div className={`${isExpanded ? "grid" : "hidden"} grid-cols-2 md:grid md:grid-cols-5 md:col-span-4 lg:col-span-5 gap-3 md:gap-4 transition-all`}>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-zinc-400 uppercase md:hidden">Prioridade</label>
              <Select value={priority} onValueChange={(v) => { setPriority(v); updateFilters({ priority: v }); }}>
                <SelectTrigger className="h-10 text-xs md:text-sm"><SelectValue placeholder="Prioridade" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas Prioridades</SelectItem>
                  <SelectItem value="BAIXA">Baixa</SelectItem>
                  <SelectItem value="MEDIA">Média</SelectItem>
                  <SelectItem value="ALTA">Alta</SelectItem>
                  <SelectItem value="CRITICA">Crítica</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-zinc-400 uppercase md:hidden">Categoria</label>
              <Select value={category} onValueChange={(v) => { setCategory(v); updateFilters({ category: v }); }}>
                <SelectTrigger className="h-10 text-xs md:text-sm"><SelectValue placeholder="Categoria" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas Categorias</SelectItem>
                  <SelectItem value="BUG">Bug</SelectItem>
                  <SelectItem value="FEATURE">Feature</SelectItem>
                  <SelectItem value="MELHORIA">Melhoria</SelectItem>
                  <SelectItem value="SUPORTE">Suporte</SelectItem>
                  <SelectItem value="OPERACIONAL">Operacional</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-zinc-400 uppercase md:hidden">Status</label>
              <Select value={status} onValueChange={(v) => { setStatus(v); updateFilters({ status: v }); }}>
                <SelectTrigger className="h-10 text-xs md:text-sm"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos Status</SelectItem>
                  <SelectItem value="PENDENTE">Pendente</SelectItem>
                  <SelectItem value="EM_ANDAMENTO">Em andamento</SelectItem>
                  <SelectItem value="CONCLUIDA">Concluída</SelectItem>
                  <SelectItem value="BLOQUEADA">Bloqueada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-zinc-400 uppercase md:hidden">Time</label>
              <input 
                placeholder="Time Responsável..." 
                className="flex h-10 w-full rounded-md border border-zinc-200 bg-zinc-50/50 px-3 py-2 text-xs md:text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={team}
                onChange={(e) => setTeam(e.target.value)}
              />
            </div>
            
            <div className="col-span-2 md:col-span-1 flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-zinc-400 uppercase md:hidden">Responsável</label>
              <input 
                placeholder="Pessoa Responsável..." 
                className="flex h-10 w-full rounded-md border border-zinc-200 bg-zinc-50/50 px-3 py-2 text-xs md:text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={person}
                onChange={(e) => setPerson(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
