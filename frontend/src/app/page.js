import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      <div className="mx-auto flex min-h-[calc(100vh-96px)] max-w-6xl flex-col items-center justify-center px-6 py-20 text-center">
        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-cyan-300">
          Sistema de Chamados e Atendimento TI
        </p>
        <h1 className="text-5xl font-semibold tracking-tight text-white sm:text-6xl">
          Organize seus chamados com clareza e agilidade
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
          TechRent ajuda sua equipe a controlar solicitações, acompanhar status e entregar soluções de TI de forma rápida.
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link href="/login">
            <Button size="lg">Entrar no Sistema</Button>
          </Link>
          <Link href="/cadastro">
            <Button variant="secondary" size="lg">Criar Conta</Button>
          </Link>
        </div>

        <div className="mt-16 grid w-full gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-left shadow-xl shadow-slate-950/20 backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Fácil de usar</p>
            <h2 className="mt-4 text-xl font-semibold text-white">Interface amigável</h2>
            <p className="mt-2 text-sm text-slate-300">Acesse seus chamados rapidamente e acompanhe cada etapa do processo.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-left shadow-xl shadow-slate-950/20 backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.2em] text-violet-300">Visão clara</p>
            <h2 className="mt-4 text-xl font-semibold text-white">Painel centralizado</h2>
            <p className="mt-2 text-sm text-slate-300">Veja chamados, equipamentos e status em um só lugar.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-left shadow-xl shadow-slate-950/20 backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.2em] text-emerald-300">Rápido</p>
            <h2 className="mt-4 text-xl font-semibold text-white">Agilidade diária</h2>
            <p className="mt-2 text-sm text-slate-300">Ganhe tempo com navegação fluida e botões claros entre páginas.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
