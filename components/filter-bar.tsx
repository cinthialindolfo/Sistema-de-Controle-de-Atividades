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
    
    // Sempre que um filtro mudar, resetamos a página para 1
    params.set("page", "1");
    
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
    <div className={`bg-card rounded-2xl border border-border shadow-sm transition-all ${isPending ? "opacity-70" : "opacity-100"}`}>
      <div className="p-4 md:p-6">
        <div className="flex flex-col gap-5 md:grid md:grid-cols-6 md:gap-6">
          
          {/* Linha Principal: Busca e Botão de Filtro (Mobile) */}
          <div className="flex flex-col gap-2 md:col-span-2 lg:col-span-1">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Busca</label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1 group">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input 
                  placeholder="Título..." 
                  className="flex h-11 w-full rounded-xl border border-border bg-muted/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all pl-10" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Button 
                variant="outline" 
                className={`md:hidden h-11 px-4 shrink-0 gap-2 font-bold text-xs uppercase tracking-wider rounded-xl ${isExpanded ? "bg-muted border-primary/50" : ""}`}
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <SlidersHorizontal className="h-4 w-4" />
                {isExpanded ? "Fechar" : "Filtros"}
              </Button>
            </div>
          </div>

          {/* Filtros Secundários: Colapsáveis no Mobile, Sempre Visíveis no Desktop */}
          <div className={`${isExpanded ? "grid" : "hidden"} grid-cols-2 md:grid md:grid-cols-5 md:col-span-4 lg:col-span-5 gap-4 md:gap-5 transition-all`}>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Prioridade</label>
              <Select value={priority} onValueChange={(v) => { setPriority(v); updateFilters({ priority: v }); }}>
                <SelectTrigger className="h-11 text-xs md:text-sm rounded-xl bg-muted/50 border-border focus:ring-primary/20">
                  <SelectValue placeholder="Prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="BAIXA">Baixa</SelectItem>
                  <SelectItem value="MEDIA">Média</SelectItem>
                  <SelectItem value="ALTA">Alta</SelectItem>
                  <SelectItem value="CRITICA">Crítica</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Categoria</label>
              <Select value={category} onValueChange={(v) => { setCategory(v); updateFilters({ category: v }); }}>
                <SelectTrigger className="h-11 text-xs md:text-sm rounded-xl bg-muted/50 border-border focus:ring-primary/20">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="BUG">Bug</SelectItem>
                  <SelectItem value="FEATURE">Feature</SelectItem>
                  <SelectItem value="MELHORIA">Melhoria</SelectItem>
                  <SelectItem value="SUPORTE">Suporte</SelectItem>
                  <SelectItem value="OPERACIONAL">Operacional</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Status</label>
              <Select value={status} onValueChange={(v) => { setStatus(v); updateFilters({ status: v }); }}>
                <SelectTrigger className="h-11 text-xs md:text-sm rounded-xl bg-muted/50 border-border focus:ring-primary/20">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="PENDENTE">Pendente</SelectItem>
                  <SelectItem value="EM_ANDAMENTO">Em andamento</SelectItem>
                  <SelectItem value="CONCLUIDA">Concluída</SelectItem>
                  <SelectItem value="BLOQUEADA">Bloqueada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Time</label>
              <input 
                placeholder="Time..." 
                className="flex h-11 w-full rounded-xl border border-border bg-muted/50 px-3 py-2 text-xs md:text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all"
                value={team}
                onChange={(e) => setTeam(e.target.value)}
              />
            </div>
            
            <div className="col-span-2 md:col-span-1 flex flex-col gap-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Responsável</label>
              <input 
                placeholder="Nome..." 
                className="flex h-11 w-full rounded-xl border border-border bg-muted/50 px-3 py-2 text-xs md:text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all"
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
