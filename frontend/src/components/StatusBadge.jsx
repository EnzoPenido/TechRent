"use client";

import { Badge } from "@/components/ui/badge";

const statusConfig = {
  aberto: { label: "Aberto", variant: "default", className: "bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30" },
  em_atendimento: { label: "Em Atendimento", variant: "default", className: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30 hover:bg-yellow-500/30" },
  resolvido: { label: "Resolvido", variant: "default", className: "bg-green-500/20 text-green-300 border-green-500/30 hover:bg-green-500/30" },
  cancelado: { label: "Cancelado", variant: "default", className: "bg-red-500/20 text-red-300 border-red-500/30 hover:bg-red-500/30" },
  operacional: { label: "Operacional", variant: "default", className: "bg-green-500/20 text-green-300 border-green-500/30 hover:bg-green-500/30" },
  em_manutencao: { label: "Em Manutenção", variant: "default", className: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30 hover:bg-yellow-500/30" },
  desativado: { label: "Desativado", variant: "default", className: "bg-slate-500/20 text-slate-400 border-slate-500/30 hover:bg-slate-500/30" },
};

const prioridadeConfig = {
  alta: { label: "Alta", className: "bg-red-500/20 text-red-300 border-red-500/30" },
  media: { label: "Média", className: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30" },
  baixa: { label: "Baixa", className: "bg-green-500/20 text-green-300 border-green-500/30" },
};

export function StatusBadge({ status }) {
  const config = statusConfig[status] || { label: status, className: "bg-slate-500/20 text-slate-400 border-slate-500/30" };
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}

export function PrioridadeBadge({ prioridade }) {
  const config = prioridadeConfig[prioridade] || { label: prioridade, className: "bg-slate-500/20 text-slate-400 border-slate-500/30" };
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}
