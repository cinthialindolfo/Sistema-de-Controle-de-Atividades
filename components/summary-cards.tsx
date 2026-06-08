import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { List, Clock, Play, AlertCircle } from "lucide-react";

interface Activity {
  id: string;
  status: string;
  [key: string]: any;
}

interface SummaryCardsProps {
  activities: any[];
}

export function SummaryCards({ activities = [] }: SummaryCardsProps) {
  // Cálculos dinâmicos das métricas
  const total = activities.length;
  const pending = activities.filter(a => a.status === "PENDENTE").length;
  const inProgress = activities.filter(a => a.status === "EM_ANDAMENTO").length;
  const blocked = activities.filter(a => a.status === "BLOQUEADA").length;

  const metrics = [
    {
      title: "Total de Atividades",
      value: total,
      icon: List,
      color: "text-zinc-600",
      borderColor: "border-zinc-200"
    },
    {
      title: "Pendentes",
      value: pending,
      icon: Clock,
      color: "text-yellow-600",
      borderColor: "border-yellow-200"
    },
    {
      title: "Em Andamento",
      value: inProgress,
      icon: Play,
      color: "text-sky-600",
      borderColor: "border-sky-200"
    },
    {
      title: "Bloqueadas",
      value: blocked,
      icon: AlertCircle,
      color: "text-red-600",
      borderColor: "border-red-200"
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
      {metrics.map((metric, index) => (
        <Card key={index} className={`shadow-sm border-l-[3px] ${metric.borderColor} transition-all hover:shadow-md`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-2 md:p-6 pb-1 md:pb-2">
            <CardTitle className="text-[10px] md:text-sm font-medium text-zinc-500 uppercase tracking-wider truncate pr-1">
              {metric.title}
            </CardTitle>
            <metric.icon className={`h-3 w-3 md:h-4 md:w-4 flex-shrink-0 ${metric.color}`} />
          </CardHeader>
          <CardContent className="p-2 md:p-6 pt-0 md:pt-0">
            <div className="text-lg md:text-2xl font-bold leading-none">{metric.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
