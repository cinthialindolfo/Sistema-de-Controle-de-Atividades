import { Card, CardContent } from "@/components/ui/card";
import { List, Clock, Play, AlertCircle } from "lucide-react";

interface SummaryCardsProps {
  activities: any[];
}

export function SummaryCards({ activities = [] }: SummaryCardsProps) {
  const total = activities.length;
  const pending = activities.filter(a => a.status === "PENDENTE").length;
  const inProgress = activities.filter(a => a.status === "EM_ANDAMENTO").length;
  const blocked = activities.filter(a => a.status === "BLOQUEADA").length;

  const metrics = [
    {
      title: "Total",
      value: total,
      icon: List,
      color: "bg-blue-600",
      textColor: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-800",
    },
    {
      title: "Pendentes",
      value: pending,
      icon: Clock,
      color: "bg-amber-500",
      textColor: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-50 dark:bg-amber-900/20",
      borderColor: "border-amber-200 dark:border-amber-800",
    },
    {
      title: "Em Execução",
      value: inProgress,
      icon: Play,
      color: "bg-emerald-500",
      textColor: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
      borderColor: "border-emerald-200 dark:border-emerald-800",
    },
    {
      title: "Bloqueadas",
      value: blocked,
      icon: AlertCircle,
      color: "bg-red-600",
      textColor: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      borderColor: "border-red-200 dark:border-red-800",
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 font-sans">
      {metrics.map((metric, index) => (
        <Card key={index} className="relative overflow-hidden border border-border shadow-sm dark:bg-zinc-900 transition-all hover:shadow-md">
          {/* Barra de cor lateral para identificação rápida */}
          <div className={`absolute top-0 left-0 w-1.5 h-full ${metric.color}`} />
          
          <CardContent className="p-4 md:p-6 pl-6 md:pl-8">
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                    {metric.title}
                  </p>
                  <h2 className="text-2xl md:text-4xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
                    {metric.value}
                  </h2>
                </div>
                
                <div className={`p-2 md:p-3 rounded-xl border ${metric.bgColor} ${metric.borderColor} ${metric.textColor}`}>
                  <metric.icon className="h-4 w-4 md:h-6 md:w-6" />
                </div>
              </div>
              
              <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${metric.color} transition-all duration-1000 ease-in-out`}
                  style={{ width: total > 0 ? `${(metric.value / total) * 100}%` : '0%' }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
