import { Plus, Search } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getActivities } from "@/app/actions";

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

export default async function DashboardPage() {
  const response = await getActivities();
  const activities = response.success ? response.data : [];

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50/50 p-6 md:p-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Controle de Atividades</h1>
          <p className="text-zinc-500">Gerencie e acompanhe o progresso das demandas técnicas.</p>
        </div>
        <Button className="w-full md:w-auto gap-2 shadow-sm">
          <Plus className="h-4 w-4" />
          Nova Atividade
        </Button>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4 bg-white p-4 rounded-xl border border-zinc-200 shadow-sm">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
          <Input placeholder="Buscar por título..." className="pl-9" />
        </div>
        
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Prioridade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="BAIXA">Baixa</SelectItem>
            <SelectItem value="MEDIA">Média</SelectItem>
            <SelectItem value="ALTA">Alta</SelectItem>
            <SelectItem value="CRITICA">Crítica</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="BUG">Bug</SelectItem>
            <SelectItem value="FEATURE">Feature</SelectItem>
            <SelectItem value="MELHORIA">Melhoria</SelectItem>
            <SelectItem value="SUPORTE">Suporte</SelectItem>
            <SelectItem value="OPERACIONAL">Operacional</SelectItem>
          </SelectContent>
        </Select>

        <Input placeholder="Time responsável..." />
        <Input placeholder="Responsável..." />
      </div>

      {/* Tabela de Atividades */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-50/50">
            <TableRow>
              <TableHead className="font-semibold text-zinc-900">Título</TableHead>
              <TableHead className="font-semibold text-zinc-900">Categoria</TableHead>
              <TableHead className="font-semibold text-zinc-900">Prioridade</TableHead>
              <TableHead className="font-semibold text-zinc-900">Responsável</TableHead>
              <TableHead className="font-semibold text-zinc-900">Status</TableHead>
              <TableHead className="text-right font-semibold text-zinc-900">Atualizado em</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities && activities.length > 0 ? (
              activities.map((activity) => (
                <TableRow key={activity.id} className="hover:bg-zinc-50/50 transition-colors">
                  <TableCell className="font-medium max-w-[300px] truncate">
                    <div className="flex flex-col">
                      <span>{activity.title}</span>
                      <span className="text-xs text-zinc-500 font-normal truncate">{activity.description}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-zinc-600 font-medium">{activity.category}</span>
                  </TableCell>
                  <TableCell>
                    {getPriorityBadge(activity.priority)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{activity.personResponsible}</span>
                      <span className="text-xs text-zinc-500">{activity.teamResponsible}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(activity.status)}
                  </TableCell>
                  <TableCell className="text-right text-zinc-500 text-sm">
                    {new Date(activity.updatedAt).toLocaleDateString("pt-BR")}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-zinc-500">
                  Nenhuma atividade cadastrada. Clique em &quot;Nova Atividade&quot; para começar!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
