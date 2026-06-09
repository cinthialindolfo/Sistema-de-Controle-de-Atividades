import { FilterBar } from "@/components/filter-bar";
import { ActivityActions } from "@/components/activity-actions";
import { getActivities, getCurrentUser, logout } from "@/app/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, LogOut, User, Sparkles } from "lucide-react";
import { ActivityModal } from "@/components/activity-modal";
import { SummaryCards } from "@/components/summary-cards";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { SeedButton } from "@/components/seed-button";
import { ThemeToggle } from "@/components/theme-toggle";

// Helper para cores das Badges de Prioridade (Otimizadas para Legibilidade Máxima)
const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case "CRITICA": return <Badge className="bg-red-600 text-white border-red-700 dark:bg-red-600 dark:text-white dark:border-red-500 hover:bg-red-700">Crítica</Badge>;
    case "ALTA": return <Badge className="bg-orange-500 dark:bg-orange-600 dark:text-white border-transparent text-white hover:bg-orange-600">Alta</Badge>;
    case "MEDIA": return <Badge className="bg-yellow-500 dark:bg-yellow-600 dark:text-white border-transparent text-white hover:bg-yellow-600">Média</Badge>;
    case "BAIXA": return <Badge className="bg-blue-500 dark:bg-blue-600 dark:text-white border-transparent text-white hover:bg-blue-600">Baixa</Badge>;
    default: return <Badge variant="outline">{priority}</Badge>;
  }
};

// Helper para cores das Badges de Status (Otimizadas para Legibilidade Máxima)
const getStatusBadge = (status: string) => {
  switch (status) {
    case "CONCLUIDA": return <Badge className="bg-green-600 dark:bg-green-600 dark:text-white border-transparent text-white hover:bg-green-700">Concluída</Badge>;
    case "PENDENTE": return <Badge variant="secondary" className="bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 text-zinc-900 font-bold">Pendente</Badge>;
    case "EM_ANDAMENTO": return <Badge className="bg-sky-600 dark:bg-sky-600 dark:text-white border-transparent text-white hover:bg-sky-700">Em andamento</Badge>;
    case "BLOQUEADA": return <Badge className="bg-red-700 dark:bg-red-700 dark:text-white border-red-800 text-white font-bold">Bloqueada</Badge>;
    default: return <Badge variant="outline">{status}</Badge>;
  }
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const user = await getCurrentUser();
  
  const filters = {
    search: params.search as string,
    priority: params.priority as string,
    category: params.category as string,
    status: params.status as string,
    teamResponsible: params.team as string,
    personResponsible: params.person as string,
  };

  const response = await getActivities(filters);
  const activities = (response.success ? response.data : []) as any[];

  // Busca todas as atividades (sem filtros) para as métricas do dashboard
  const allActivitiesResponse = await getActivities();
  const allActivities = (allActivitiesResponse.success ? allActivitiesResponse.data : []) as any[];

  return (
    <div className="flex flex-col min-h-screen bg-background p-4 md:p-8 space-y-6 md:space-y-8 pb-24 md:pb-10 transition-colors duration-300 font-sans">
      {/* Header Premium Restaurado */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 bg-card p-4 md:p-6 rounded-2xl md:rounded-3xl border border-border shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-primary p-2.5 rounded-xl shadow-lg shadow-primary/20">
            <Sparkles className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="space-y-0.5">
            <h1 className="text-xl md:text-3xl font-black tracking-tight text-foreground">
              ActivityControl
            </h1>
            <p className="text-[10px] md:text-xs text-muted-foreground font-bold uppercase tracking-widest">
              Gestão de Produtividade
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-between md:justify-end gap-2 md:gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2 md:gap-3 bg-muted px-2 md:px-4 py-1.5 md:py-2 rounded-xl md:rounded-2xl border border-border max-w-[180px] md:max-w-none">
            <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center text-primary">
              <User className="h-4 w-4 md:h-5 md:w-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs md:text-sm font-black text-foreground truncate">{user?.firstName} {user?.lastName}</span>
              <span className="text-[9px] md:text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">Colaborador</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <SeedButton />
            
            <form action={logout}>
              <Button variant="outline" size="icon" className="h-9 w-9 md:h-11 md:w-11 rounded-lg md:rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 border-border transition-all">
                <LogOut className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </form>

            {/* Botão Nova Atividade - Desktop/Tablet */}
            <div className="hidden sm:block">
              <ActivityModal>
                <Button className="h-9 md:h-11 gap-2 shadow-lg shadow-primary/10 bg-primary hover:bg-primary/90 text-primary-foreground transition-all px-4 md:px-6 rounded-lg md:rounded-xl text-xs md:text-sm font-bold uppercase tracking-wider">
                  <Plus className="h-4 w-4 md:h-5 md:w-5" />
                  Nova Atividade
                </Button>
              </ActivityModal>
            </div>
          </div>
        </div>
      </div>

      {/* Botão Flutuante (FAB) - Mobile */}
      <div className="fixed bottom-6 right-6 z-50 md:hidden">
        <ActivityModal>
          <Button size="icon" className="h-16 w-16 rounded-full shadow-2xl bg-primary hover:bg-primary/90 text-primary-foreground ring-4 ring-background">
            <Plus className="h-8 w-8" />
          </Button>
        </ActivityModal>
      </div>

      {/* Dashboard de Métricas */}
      <SummaryCards activities={allActivities} />

      {/* Filtros Interativos */}
      <FilterBar />

      {/* Lista de Atividades */}
      <div className="space-y-4">
        {/* Visualização em Tabela (Refinada para Desktop) */}
        <div className="hidden md:block bg-card rounded-2xl border border-border shadow-sm overflow-hidden transition-colors duration-300">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow className="hover:bg-transparent border-b border-border">
                <TableHead className="py-4 font-black text-foreground uppercase text-[10px] tracking-widest pl-6">Demanda / Descrição</TableHead>
                <TableHead className="py-4 font-black text-foreground uppercase text-[10px] tracking-widest text-center">Categoria</TableHead>
                <TableHead className="py-4 font-black text-foreground uppercase text-[10px] tracking-widest text-center">Urgência</TableHead>
                <TableHead className="py-4 font-black text-foreground uppercase text-[10px] tracking-widest">Responsável</TableHead>
                <TableHead className="py-4 font-black text-foreground uppercase text-[10px] tracking-widest text-center">Status</TableHead>
                <TableHead className="py-4 font-black text-foreground uppercase text-[10px] tracking-widest text-center">Datas</TableHead>
                <TableHead className="py-4 font-black text-foreground uppercase text-[10px] tracking-widest text-right pr-6">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.length > 0 ? (
                activities.map((activity) => (
                  <TableRow key={activity.id} className="group hover:bg-muted/30 transition-colors border-b border-border/50 last:border-0 font-sans">
                    <TableCell className="py-5 pl-6">
                      <div className="flex flex-col max-w-[350px]">
                        <span className="font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
                          {activity.title}
                        </span>
                        <span className="text-xs text-muted-foreground mt-1 line-clamp-1 italic font-medium">
                          {activity.description}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="font-black px-2.5 py-0.5 border-border text-muted-foreground bg-muted/50 text-[9px] uppercase tracking-tighter">
                        {activity.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {getPriorityBadge(activity.priority)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center text-[10px] font-black text-muted-foreground border border-border group-hover:border-primary/30 transition-colors">
                          {activity.personResponsible.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-foreground">{activity.personResponsible}</span>
                          <span className="text-[10px] text-muted-foreground font-black uppercase tracking-tighter">{activity.teamResponsible}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {getStatusBadge(activity.status)}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center font-mono">
                        <span className="text-[9px] text-muted-foreground font-black uppercase tracking-tighter mb-0.5">Criado</span>
                        <span className="text-[11px] text-foreground font-medium">
                          {new Date(activity.createdAt).toLocaleDateString('pt-BR')}
                        </span>
                        {activity.updatedAt !== activity.createdAt && (
                          <div className="mt-2 flex flex-col items-center opacity-60">
                            <span className="text-[9px] text-muted-foreground font-black uppercase tracking-tighter mb-0.5">Update</span>
                            <span className="text-[11px] text-foreground font-medium">
                              {new Date(activity.updatedAt).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <ActivityActions activity={activity} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-48 text-center text-muted-foreground italic font-medium">
                    Nenhuma demanda registrada no momento.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Visualização em Cards (Refinada para Mobile) */}
        <div className="grid grid-cols-1 gap-4 md:hidden pb-10">
          {activities.length > 0 ? (
            activities.map((activity) => (
              <div key={activity.id} className="bg-card rounded-2xl border border-border shadow-sm p-4 active:scale-[0.98] transition-transform space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                       {getStatusBadge(activity.status)}
                       <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{activity.category}</span>
                    </div>
                    <h3 className="text-base font-black text-foreground leading-tight pt-1">
                      {activity.title}
                    </h3>
                  </div>
                  <ActivityActions activity={activity} />
                </div>
                
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed bg-muted/30 p-2.5 rounded-xl border border-border/50 font-medium">
                  {activity.description}
                </p>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary">
                      {activity.personResponsible.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-foreground">{activity.personResponsible}</span>
                      <span className="text-[9px] text-muted-foreground font-black uppercase tracking-tighter">{activity.teamResponsible}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] text-muted-foreground font-black uppercase tracking-widest mb-1 opacity-60">Urgência</span>
                    {getPriorityBadge(activity.priority)}
                  </div>
                </div>

                <div className="pt-3 border-t border-border/50 flex justify-between items-center text-[10px] text-muted-foreground font-bold uppercase tracking-tighter font-mono">
                  <span>Início: {new Date(activity.createdAt).toLocaleDateString('pt-BR')}</span>
                  {activity.updatedAt !== activity.createdAt && (
                    <span className="text-primary/70 italic">Modificado</span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-card rounded-2xl border-2 border-dashed border-border p-16 text-center text-muted-foreground text-sm font-bold uppercase tracking-widest">
              Lista vazia
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
