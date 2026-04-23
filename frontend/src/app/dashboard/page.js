"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { StatusBadge, PrioridadeBadge } from "@/components/StatusBadge";
import { DashboardSkeleton } from "@/components/LoadingSkeleton";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import {
  TicketPlus, Wrench, AlertCircle, CheckCircle2, Clock, XCircle,
  MonitorSmartphone, Activity, TrendingUp, Users, ChevronRight, Loader2
} from "lucide-react";

const API = "http://localhost:3001";

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric",
  });
}

function StatCard({ icon: Icon, label, value, colorClass }) {
  return (
    <Card className="border border-white/10 bg-slate-900/60 backdrop-blur-sm">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-400 mb-1">{label}</p>
            <p className="text-3xl font-bold text-white">{value ?? 0}</p>
          </div>
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colorClass}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Vista do Cliente ────────────────────────────────────────────────────────

function ClienteDashboard({ chamados }) {
  const abertos = chamados.filter(c => c.status === "aberto").length;
  const emAtendimento = chamados.filter(c => c.status === "em_atendimento").length;
  const resolvidos = chamados.filter(c => c.status === "resolvido").length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={AlertCircle} label="Abertos" value={abertos} colorClass="bg-blue-500/20 text-blue-400" />
        <StatCard icon={Clock} label="Em Atendimento" value={emAtendimento} colorClass="bg-yellow-500/20 text-yellow-400" />
        <StatCard icon={CheckCircle2} label="Resolvidos" value={resolvidos} colorClass="bg-green-500/20 text-green-400" />
      </div>

      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Seus Chamados</h2>
        {chamados.length === 0 ? (
          <Card className="border border-white/10 bg-slate-900/50">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <TicketPlus className="h-10 w-10 text-slate-600 mb-3" />
              <p className="text-slate-400 font-medium">Nenhum chamado aberto ainda.</p>
              <p className="text-sm text-slate-500 mt-1">Clique em "Novo Chamado" para relatar um problema.</p>
              <Button asChild className="mt-4" size="sm">
                <Link href="/chamados/novo">Abrir Chamado</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
            {chamados.map((chamado) => (
              <Card key={chamado.id} className="border border-white/10 bg-slate-900/50 hover:bg-slate-900/80 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-semibold text-white truncate">{chamado.titulo}</h3>
                        <PrioridadeBadge prioridade={chamado.prioridade} />
                      </div>
                      <p className="text-sm text-slate-400 mb-2">
                        <MonitorSmartphone className="inline h-3.5 w-3.5 mr-1 text-slate-500" />
                        {chamado.equipamento_nome}
                      </p>
                      {chamado.descricao && (
                        <p className="text-sm text-slate-400 line-clamp-2">{chamado.descricao}</p>
                      )}
                      <p className="text-xs text-slate-500 mt-2">
                        Aberto em {formatDate(chamado.aberto_em)}
                        {chamado.tecnico_nome && ` · Técnico: ${chamado.tecnico_nome}`}
                      </p>
                    </div>
                    <StatusBadge status={chamado.status} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Vista do Admin ──────────────────────────────────────────────────────────

function AdminDashboard({ data }) {
  const resumoChamados = data?.resumoChamados || [];
  const resumoEquipamentos = data?.resumoEquipamentos || [];

  const totalChamados = resumoChamados.reduce((s, i) => s + (i.total || 0), 0);
  const totalEquipamentos = resumoEquipamentos.reduce((s, i) => s + (i.total || 0), 0);
  const chamadosAbertos = resumoChamados.find(c => c.status === "aberto")?.total || 0;
  const equipamentosOperacionais = resumoEquipamentos.find(e => e.status === "operacional")?.total || 0;

  const statusChamadoLabel = {
    aberto: "Abertos",
    em_atendimento: "Em Atendimento",
    resolvido: "Resolvidos",
    cancelado: "Cancelados",
  };
  const statusEquipLabel = {
    operacional: "Operacionais",
    em_manutencao: "Em Manutenção",
    desativado: "Desativados",
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard icon={Activity} label="Total Chamados" value={totalChamados} colorClass="bg-cyan-500/20 text-cyan-400" />
        <StatCard icon={AlertCircle} label="Chamados Abertos" value={chamadosAbertos} colorClass="bg-blue-500/20 text-blue-400" />
        <StatCard icon={MonitorSmartphone} label="Equipamentos" value={totalEquipamentos} colorClass="bg-violet-500/20 text-violet-400" />
        <StatCard icon={TrendingUp} label="Operacionais" value={equipamentosOperacionais} colorClass="bg-green-500/20 text-green-400" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border border-white/10 bg-slate-900/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-4 w-4 text-cyan-400" />
              Chamados por Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {resumoChamados.length === 0 ? (
              <p className="text-sm text-slate-500">Nenhum chamado registrado.</p>
            ) : (
              <div className="space-y-3">
                {resumoChamados.map((item) => (
                  <div key={item.status} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={item.status} />
                      <span className="text-sm text-slate-300">
                        {statusChamadoLabel[item.status] || item.status}
                      </span>
                    </div>
                    <span className="text-lg font-bold text-white">{item.total}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter className="pt-0">
            <Button asChild variant="ghost" size="sm" className="text-slate-400 hover:text-white w-full justify-between">
              <Link href="/chamados">
                Ver todos os chamados
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="border border-white/10 bg-slate-900/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <MonitorSmartphone className="h-4 w-4 text-violet-400" />
              Equipamentos por Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {resumoEquipamentos.length === 0 ? (
              <p className="text-sm text-slate-500">Nenhum equipamento cadastrado.</p>
            ) : (
              <div className="space-y-3">
                {resumoEquipamentos.map((item) => (
                  <div key={item.status} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={item.status} />
                      <span className="text-sm text-slate-300">
                        {statusEquipLabel[item.status] || item.status}
                      </span>
                    </div>
                    <span className="text-lg font-bold text-white">{item.total}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter className="pt-0">
            <Button asChild variant="ghost" size="sm" className="text-slate-400 hover:text-white w-full justify-between">
              <Link href="/equipamentos">
                Gerenciar equipamentos
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

// ─── Vista do Técnico ────────────────────────────────────────────────────────

function TecnicoDashboard({ chamados, onRefresh }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedChamado, setSelectedChamado] = useState(null);
  const [descricao, setDescricao] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const auth = useAuth();
  const { token } = auth || {};

  const abertos = chamados.filter(c => c.status === "aberto").length;
  const emAtendimento = chamados.filter(c => c.status === "em_atendimento").length;

  const handleIniciarAtendimento = async (chamado) => {
    try {
      await axios.put(
        `${API}/chamados/${chamado.chamado_id}/status`,
        { status: "em_atendimento" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onRefresh();
    } catch (err) {
      console.error("Erro ao iniciar atendimento:", err);
    }
  };

  const handleAbrirResolucao = (chamado) => {
    setSelectedChamado(chamado);
    setDescricao("");
    setError("");
    setDialogOpen(true);
  };

  const handleRegistrarManutencao = async () => {
    if (!descricao.trim()) {
      setError("Descreva o que foi feito para resolver o problema.");
      return;
    }
    try {
      setSubmitting(true);
      await axios.post(
        `${API}/manutencao`,
        { chamado_id: selectedChamado.chamado_id, descricao },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDialogOpen(false);
      onRefresh();
    } catch (err) {
      setError(err.response?.data?.mensagem || "Erro ao registrar manutenção.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard icon={AlertCircle} label="Chamados Abertos" value={abertos} colorClass="bg-blue-500/20 text-blue-400" />
        <StatCard icon={Clock} label="Em Atendimento" value={emAtendimento} colorClass="bg-yellow-500/20 text-yellow-400" />
      </div>

      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Chamados para Atender</h2>
        {chamados.length === 0 ? (
          <Card className="border border-white/10 bg-slate-900/50">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle2 className="h-10 w-10 text-green-500/50 mb-3" />
              <p className="text-slate-400 font-medium">Nenhum chamado pendente.</p>
              <p className="text-sm text-slate-500 mt-1">Todos os chamados foram atendidos.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
            {chamados.map((chamado) => (
              <Card key={chamado.chamado_id} className="border border-white/10 bg-slate-900/50 hover:bg-slate-900/80 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-semibold text-white">{chamado.titulo}</h3>
                        <PrioridadeBadge prioridade={chamado.prioridade} />
                      </div>
                      <p className="text-sm text-slate-400">
                        <MonitorSmartphone className="inline h-3.5 w-3.5 mr-1 text-slate-500" />
                        {chamado.equipamento}
                        {chamado.patrimonio && <span className="text-slate-500"> · Patrimônio: {chamado.patrimonio}</span>}
                      </p>
                      <p className="text-sm text-slate-400 mt-0.5">
                        <Users className="inline h-3.5 w-3.5 mr-1 text-slate-500" />
                        Solicitante: {chamado.solicitante}
                      </p>
                      <p className="text-xs text-slate-500 mt-1.5">
                        Aberto em {formatDate(chamado.aberto_em)}
                        {chamado.tecnico_responsavel && ` · Técnico: ${chamado.tecnico_responsavel}`}
                      </p>
                    </div>
                    <StatusBadge status={chamado.status} />
                  </div>

                  <Separator className="bg-white/5 mb-3" />

                  <div className="flex gap-2 flex-wrap">
                    {chamado.status === "aberto" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/10 hover:border-yellow-500/50"
                        onClick={() => handleIniciarAtendimento(chamado)}
                      >
                        <Clock className="h-3.5 w-3.5 mr-1.5" />
                        Iniciar Atendimento
                      </Button>
                    )}
                    {chamado.status === "em_atendimento" && (
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleAbrirResolucao(chamado)}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                        Registrar Resolução
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-slate-900 border border-white/10 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
              Registrar Resolução
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              {selectedChamado && (
                <>Chamado: <strong className="text-slate-200">{selectedChamado.titulo}</strong></>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {error && (
              <div className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400 ring-1 ring-red-500/20">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="descricao-manutencao">O que foi feito? *</Label>
              <Textarea
                id="descricao-manutencao"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descreva detalhadamente o que foi realizado para resolver o problema..."
                className="min-h-28 bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500 focus:border-cyan-500"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setDialogOpen(false)} disabled={submitting}>
              Cancelar
            </Button>
            <Button
              onClick={handleRegistrarManutencao}
              disabled={submitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {submitting ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Salvando...</>
              ) : (
                <><CheckCircle2 className="h-4 w-4 mr-2" /> Confirmar Resolução</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Página Principal ────────────────────────────────────────────────────────

export default function DashboardPage() {
  const router = useRouter();
  const auth = useAuth();
  const { user, token, mounted } = auth || {};
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  if (!mounted) return null;

  const fetchDashboard = async () => {
    if (!user || !token) return;
    try {
      setLoading(true);
      let endpoint = "";
      if (user.nivel_acesso === "admin") {
        endpoint = `${API}/dashboard/admin`;
      } else if (user.nivel_acesso === "tecnico") {
        endpoint = `${API}/dashboard/tecnico`;
      } else {
        endpoint = `${API}/chamados`;
      }
      const res = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(res.data);
    } catch (error) {
      console.error("Erro ao carregar dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || !token) {
      router.push("/login");
      return;
    }
    fetchDashboard();
  }, [user, token]);

  if (loading) return <DashboardSkeleton />;

  const roleLabel = {
    admin: "Administrador",
    tecnico: "Técnico",
    cliente: "Cliente",
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Olá, {user?.nome?.split(" ")[0]}! 👋
          </h1>
          <p className="text-slate-400 mt-0.5 text-sm">
            {roleLabel[user?.nivel_acesso] || user?.nivel_acesso} · {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          {user?.nivel_acesso === "cliente" && (
            <Button asChild size="sm">
              <Link href="/chamados/novo">
                <TicketPlus className="h-4 w-4 mr-1.5" />
                Novo Chamado
              </Link>
            </Button>
          )}
          {user?.nivel_acesso === "admin" && (
            <Button asChild variant="outline" size="sm">
              <Link href="/equipamentos">
                <Wrench className="h-4 w-4 mr-1.5" />
                Equipamentos
              </Link>
            </Button>
          )}
          {(user?.nivel_acesso === "admin" || user?.nivel_acesso === "tecnico") && (
            <Button asChild variant="outline" size="sm">
              <Link href="/chamados">
                <Activity className="h-4 w-4 mr-1.5" />
                Todos os Chamados
              </Link>
            </Button>
          )}
        </div>
      </div>

      {user?.nivel_acesso === "cliente" && (
        <ClienteDashboard chamados={Array.isArray(data) ? data : []} />
      )}
      {user?.nivel_acesso === "admin" && (
        <AdminDashboard data={data} />
      )}
      {user?.nivel_acesso === "tecnico" && (
        <TecnicoDashboard
          chamados={Array.isArray(data) ? data : []}
          onRefresh={fetchDashboard}
        />
      )}
    </div>
  );
}
