import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  TicketPlus, Wrench, LayoutDashboard, Shield, Zap, Users,
  ArrowRight, MonitorSmartphone, CheckCircle2, Clock, Activity,
} from "lucide-react";

const features = [
  {
    icon: TicketPlus,
    color: "text-cyan-400",
    bg: "bg-cyan-500/20 ring-cyan-500/30",
    label: "Abertura de Chamados",
    desc: "Clientes relatam problemas de TI de forma rápida, selecionando o equipamento afetado e descrevendo o problema.",
  },
  {
    icon: Wrench,
    color: "text-violet-400",
    bg: "bg-violet-500/20 ring-violet-500/30",
    label: "Gestão de Manutenção",
    desc: "Técnicos visualizam chamados por prioridade, iniciam atendimentos e registram as soluções aplicadas.",
  },
  {
    icon: LayoutDashboard,
    color: "text-emerald-400",
    bg: "bg-emerald-500/20 ring-emerald-500/30",
    label: "Painel Administrativo",
    desc: "Administradores monitoram o parque de equipamentos, acompanham métricas e gerenciam o inventário.",
  },
];

const roles = [
  {
    icon: Users,
    color: "text-cyan-400",
    bg: "bg-cyan-500/20",
    title: "Cliente",
    items: ["Abre chamados de TI", "Acompanha status em tempo real", "Visualiza histórico de atendimentos"],
  },
  {
    icon: Wrench,
    color: "text-violet-400",
    bg: "bg-violet-500/20",
    title: "Técnico",
    items: ["Visualiza chamados por prioridade", "Inicia e conclui atendimentos", "Registra soluções aplicadas"],
  },
  {
    icon: Shield,
    color: "text-emerald-400",
    bg: "bg-emerald-500/20",
    title: "Administrador",
    items: ["Gerencia inventário de equipamentos", "Acessa métricas e resumos", "Controla acesso de usuários"],
  },
];

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero */}
      <section className="mx-auto flex min-h-[calc(100vh-72px)] max-w-5xl flex-col items-center justify-center px-6 py-20 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-1.5 text-xs font-medium text-cyan-300 uppercase tracking-widest">
          <Activity className="h-3 w-3" />
          Sistema de Chamados e Manutenção TI
        </div>

        <h1 className="mt-4 text-5xl font-bold tracking-tight text-white sm:text-6xl leading-tight">
          Gerencie chamados de TI{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">
            com clareza
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
          TechRent centraliza o relato de problemas, o atendimento técnico e o controle de equipamentos em uma plataforma simples e eficiente.
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button asChild size="lg" className="gap-2 px-8">
            <Link href="/login">
              Entrar no Sistema
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2 px-8">
            <Link href="/cadastro">
              <Users className="h-4 w-4" />
              Criar Conta
            </Link>
          </Button>
        </div>

        <div className="mt-16 flex items-center gap-6 text-sm text-slate-400">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-green-400" />
            Gratuito para usar
          </span>
          <Separator orientation="vertical" className="h-4 bg-slate-700" />
          <span className="flex items-center gap-1.5">
            <Zap className="h-4 w-4 text-yellow-400" />
            Rápido e intuitivo
          </span>
          <Separator orientation="vertical" className="h-4 bg-slate-700" />
          <span className="flex items-center gap-1.5">
            <Shield className="h-4 w-4 text-cyan-400" />
            Controle por perfil
          </span>
        </div>
      </section>

      <Separator className="bg-white/5 max-w-5xl mx-auto" />

      {/* Features */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white">Tudo que sua equipe precisa</h2>
          <p className="text-slate-400 mt-3 max-w-xl mx-auto">
            Uma plataforma completa para gerenciar o ciclo de vida dos chamados de TI, do relato à resolução.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.label}
              className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-sm hover:bg-slate-900/80 transition-colors"
            >
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ring-1 ${f.bg} mb-4`}>
                <f.icon className={`h-5 w-5 ${f.color}`} />
              </div>
              <h3 className="font-semibold text-white mb-2">{f.label}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Separator className="bg-white/5 max-w-5xl mx-auto" />

      {/* Roles */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white">Perfis de acesso</h2>
          <p className="text-slate-400 mt-3 max-w-xl mx-auto">
            Cada usuário tem uma visão personalizada de acordo com seu papel na equipe.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {roles.map((r) => (
            <div
              key={r.title}
              className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-sm"
            >
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${r.bg} mb-4`}>
                <r.icon className={`h-5 w-5 ${r.color}`} />
              </div>
              <h3 className="font-semibold text-white mb-3">{r.title}</h3>
              <ul className="space-y-2">
                {r.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-slate-400">
                    <CheckCircle2 className="h-3.5 w-3.5 text-slate-500 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Final */}
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <div className="rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-violet-500/10 p-10 text-center">
          <MonitorSmartphone className="h-10 w-10 text-cyan-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-3">Pronto para começar?</h2>
          <p className="text-slate-400 mb-6 max-w-md mx-auto">
            Acesse o sistema agora e comece a organizar os chamados da sua equipe de TI.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg">
              <Link href="/login">
                <ArrowRight className="h-4 w-4 mr-2" />
                Entrar no Sistema
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/cadastro">Criar Conta Grátis</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
