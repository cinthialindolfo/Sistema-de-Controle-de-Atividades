import { FilterBar } from "@/components/filter-bar";
import { ActivityActions } from "@/components/activity-actions";
import { getActivities, getCurrentUser, logout } from "@/app/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, LogOut, User } from "lucide-react";
import { ActivityModal } from "@/components/activity-modal";
import { SummaryCards } from "@/components/summary-cards";
// ... (rest of imports)
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import Link from "next/link";

// ... (helpers)

// Helper para cores das Badges de Prioridade
const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case "CRITICA": return <Badge variant="destructive" className="bg-red-600 hover:bg-red-700">Crítica</Badge>;
    case "ALTA": return <Badge className="bg-orange-500 hover:bg-orange-600 border-transparent text-white">Alta</Badge>;
    case "MEDIA": return <Badge className="bg-yellow-500 hover:bg-yellow-600 border-transparent text-white">Média</Badge>;
    case "BAIXA": return <Badge className="bg-blue-500 hover:bg-blue-600 border-transparent text-white">Baixa</Badge>;
    default: return <Badge variant="outline">{priority}</Badge>;
  }
};

// Helper para cores das Badges de Status
const getStatusBadge = (status: string) => {
  switch (status) {
    case "CONCLUIDA": return <Badge className="bg-green-600 hover:bg-green-700 border-transparent text-white">Concluída</Badge>;
    case "PENDENTE": return <Badge variant="secondary" className="bg-zinc-200 text-zinc-800">Pendente</Badge>;
    case "EM_ANDAMENTO": return <Badge className="bg-sky-600 hover:bg-sky-700 border-transparent text-white">Em andamento</Badge>;
    case "BLOQUEADA": return <Badge variant="destructive" className="bg-red-800">Bloqueada</Badge>;
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
// ... (rest of filters)
    search: params.search as string,
    priority: params.priority as string,
    category: params.category as string,
    status: params.status as string,
    teamResponsible: params.team as string,
    personResponsible: params.person as string,
  };

  const response = await getActivities(filters);
  const activities = response.success ? response.data : [];

  // Busca todas as atividades (sem filtros) para as métricas do dashboard
  const allActivitiesResponse = await getActivities();
  const allActivities = allActivitiesResponse.success ? allActivitiesResponse.data : [];

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50/50 p-4 md:p-10 space-y-6 md:space-y-8 pb-24 md:pb-10">
      {/* Header com Branding Restaurado */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-zinc-900">
            Controle de Atividades
          </h1>
          <p className="text-xs md:text-base text-zinc-500 font-medium">
            Sistema de Gestão e Acompanhamento de Demandas
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3 bg-zinc-50 px-4 py-2 rounded-2xl border border-zinc-100">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <User className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-zinc-800">{user?.firstName} {user?.lastName}</span>
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-tighter">Colaborador</span>
            </div>
          </div>

          <form action={logout}>
            <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl text-zinc-500 hover:text-red-600 hover:bg-red-50 border-zinc-200 hover:border-red-100 transition-all">
              <LogOut className="h-5 w-5" />
            </Button>
          </form>

          {/* Botão Nova Atividade - Desktop */}
          <div className="hidden md:block">
            <ActivityModal>
              <Button className="h-11 gap-2 shadow-md bg-zinc-900 hover:bg-zinc-800 transition-all px-6 rounded-xl">
                <Plus className="h-5 w-5" />
                Nova Atividade
              </Button>
            </ActivityModal>
          </div>
        </div>
      </div>

      {/* Botão Flutuante (FAB) - Mobile */}
      <div className="fixed bottom-6 right-6 z-50 md:hidden">
        <ActivityModal>
          <Button size="icon" className="h-16 w-16 rounded-full shadow-2xl bg-zinc-900 hover:bg-zinc-800 text-white ring-4 ring-white/10">
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
        <div className="hidden md:block bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-zinc-50/80">
              <TableRow className="hover:bg-transparent border-b border-zinc-100">
                <TableHead className="py-4 font-bold text-zinc-900">Demanda / Descrição</TableHead>
                <TableHead className="py-4 font-bold text-zinc-900 text-center">Categoria</TableHead>
                <TableHead className="py-4 font-bold text-zinc-900 text-center">Urgência</TableHead>
                <TableHead className="py-4 font-bold text-zinc-900">Responsável</TableHead>
                <TableHead className="py-4 font-bold text-zinc-900 text-center">Status</TableHead>
                <TableHead className="py-4 font-bold text-zinc-900 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.length > 0 ? (
                activities.map((activity) => (
                  <TableRow key={activity.id} className="group hover:bg-zinc-50/50 transition-colors border-b border-zinc-50 last:border-0">
                    <TableCell className="py-4">
                      <div className="flex flex-col max-w-[350px]">
                        <span className="font-bold text-zinc-900 group-hover:text-sky-700 transition-colors leading-tight">
                          {activity.title}
                        </span>
                        <span className="text-xs text-zinc-500 mt-1 line-clamp-1 italic">
                          {activity.description}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="font-semibold px-2.5 py-0.5 border-zinc-200 text-zinc-600 bg-zinc-50">
                        {activity.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {getPriorityBadge(activity.priority)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-zinc-100 flex items-center justify-center text-[10px] font-bold text-zinc-500 border border-zinc-200">
                          {activity.personResponsible.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-zinc-800">{activity.personResponsible}</span>
                          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-tighter">{activity.teamResponsible}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {getStatusBadge(activity.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <ActivityActions activity={activity} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-40 text-center text-zinc-400 italic">
                    Nenhuma demanda registrada no momento.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Visualização em Cards (Refinada para Mobile) */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {activities.length > 0 ? (
            activities.map((activity) => (
              <div key={activity.id} className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-4 active:scale-[0.98] transition-transform space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                       {getStatusBadge(activity.status)}
                       <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{activity.category}</span>
                    </div>
                    <h3 className="text-base font-black text-zinc-900 leading-tight pt-1">
                      {activity.title}
                    </h3>
                  </div>
                  <ActivityActions activity={activity} />
                </div>
                
                <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed bg-zinc-50/50 p-2 rounded-lg border border-zinc-100/50">
                  {activity.description}
                </p>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-zinc-900 flex items-center justify-center text-[9px] font-bold text-white">
                      {activity.personResponsible.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-zinc-800">{activity.personResponsible}</span>
                      <span className="text-[9px] text-zinc-400 font-bold uppercase">{activity.teamResponsible}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] text-zinc-400 font-bold uppercase">Urgência</span>
                    {getPriorityBadge(activity.priority)}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl border-2 border-dashed border-zinc-100 p-12 text-center text-zinc-400 text-sm font-medium">
              Lista vazia.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
