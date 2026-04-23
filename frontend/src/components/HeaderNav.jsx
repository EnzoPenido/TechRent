"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { LogOut, LayoutDashboard, Wrench, MonitorSmartphone, TicketPlus, History } from "lucide-react";

export function HeaderNav() {
  const auth = useAuth();
  const router = useRouter();
  const { user, logout, mounted } = auth || {};

  if (!mounted) {
    return (
      <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <Link href="/" className="text-lg font-bold tracking-tight text-white">TechRent</Link>
        </div>
      </header>
    );
  }

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 ring-1 ring-cyan-500/30 group-hover:bg-cyan-500/30 transition-colors">
              <MonitorSmartphone className="h-4 w-4 text-cyan-400" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white">TechRent</span>
            </div>
          </Link>

          {user && (
            <>
              <Separator orientation="vertical" className="h-6 bg-white/10 mx-1" />
              <nav className="flex items-center gap-1">
                <Button asChild variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                  <Link href="/dashboard">
                    <LayoutDashboard className="h-4 w-4 mr-1.5" />
                    Dashboard
                  </Link>
                </Button>

                {user.nivel_acesso === "cliente" && (
                  <Button asChild variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                    <Link href="/chamados/novo">
                      <TicketPlus className="h-4 w-4 mr-1.5" />
                      Novo Chamado
                    </Link>
                  </Button>
                )}

                {user.nivel_acesso === "admin" && (
                  <Button asChild variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                    <Link href="/equipamentos">
                      <Wrench className="h-4 w-4 mr-1.5" />
                      Equipamentos
                    </Link>
                  </Button>
                )}

                {(user.nivel_acesso === "admin" || user.nivel_acesso === "tecnico") && (
                  <Button asChild variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                    <Link href="/manutencao">
                      <History className="h-4 w-4 mr-1.5" />
                      Histórico
                    </Link>
                  </Button>
                )}
              </nav>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-medium text-white">{user.nome}</span>
                <span className="text-xs text-slate-400 capitalize">{user.nivel_acesso}</span>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/20 ring-1 ring-cyan-500/30">
                <span className="text-xs font-bold text-cyan-400">
                  {user.nome?.charAt(0).toUpperCase()}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-slate-400 hover:text-red-400 hover:bg-red-500/10"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline ml-1.5">Sair</span>
              </Button>
            </div>
          ) : (
            <nav className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm" className="text-slate-300">
                <Link href="/">Home</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild variant="secondary" size="sm">
                <Link href="/cadastro">Cadastro</Link>
              </Button>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
