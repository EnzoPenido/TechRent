"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { StatusBadge, PrioridadeBadge } from "@/components/StatusBadge";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import {
  Activity, ArrowLeft, Search, Filter, Loader2, TicketCheck,
  MonitorSmartphone, Users, Calendar,
} from "lucide-react";

const API = "http://localhost:3001";

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric",
  });
}

export default function ChamadosPage() {
  const auth = useAuth();
  const { user, token, mounted } = auth || {};
  const router = useRouter();
  const [chamados, setChamados] = useState([]);

  if (!mounted) return null;
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [filterPrioridade, setFilterPrioridade] = useState("todos");

  useEffect(() => {
    if (!user || !token) {
      router.push("/login");
      return;
    }
    if (user.nivel_acesso === "cliente") {
      router.push("/dashboard");
      return;
    }
    fetchChamados();
  }, [user, token]);

  const fetchChamados = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/chamados`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setChamados(res.data);
    } catch (err) {
      console.error("Erro ao carregar chamados:", err);
    } finally {
      setLoading(false);
    }
  };

  const chamadosFiltrados = chamados.filter((c) => {
    const matchSearch =
      !search ||
      c.titulo?.toLowerCase().includes(search.toLowerCase()) ||
      c.cliente_nome?.toLowerCase().includes(search.toLowerCase()) ||
      c.equipamento_nome?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "todos" || c.status === filterStatus;
    const matchPrioridade = filterPrioridade === "todos" || c.prioridade === filterPrioridade;
    return matchSearch && matchStatus && matchPrioridade;
  });

  const totalAbertos = chamados.filter(c => c.status === "aberto").length;
  const totalEmAtendimento = chamados.filter(c => c.status === "em_atendimento").length;
  const totalResolvidos = chamados.filter(c => c.status === "resolvido").length;

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-96px)] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
          <p className="text-sm">Carregando chamados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Activity className="h-6 w-6 text-cyan-400" />
            Todos os Chamados
          </h1>
          <p className="text-slate-400 mt-0.5 text-sm">
            {chamados.length} chamado{chamados.length !== 1 ? "s" : ""} no total
          </p>
        </div>
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Dashboard
          </Link>
        </Button>
      </div>

      {/* Stats rápidos */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="border border-white/10 bg-slate-900/60">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-400">{totalAbertos}</p>
            <p className="text-xs text-slate-400 mt-0.5">Abertos</p>
          </CardContent>
        </Card>
        <Card className="border border-white/10 bg-slate-900/60">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-yellow-400">{totalEmAtendimento}</p>
            <p className="text-xs text-slate-400 mt-0.5">Em Atendimento</p>
          </CardContent>
        </Card>
        <Card className="border border-white/10 bg-slate-900/60">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-400">{totalResolvidos}</p>
            <p className="text-xs text-slate-400 mt-0.5">Resolvidos</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="border border-white/10 bg-slate-900/60 mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Buscar por título, cliente ou equipamento..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-44 bg-slate-800 border-slate-700 text-slate-100">
                <Filter className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-slate-100">
                <SelectItem value="todos">Todos os status</SelectItem>
                <SelectItem value="aberto">Aberto</SelectItem>
                <SelectItem value="em_atendimento">Em Atendimento</SelectItem>
                <SelectItem value="resolvido">Resolvido</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPrioridade} onValueChange={setFilterPrioridade}>
              <SelectTrigger className="w-full sm:w-44 bg-slate-800 border-slate-700 text-slate-100">
                <SelectValue placeholder="Prioridade" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-slate-100">
                <SelectItem value="todos">Todas as prioridades</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
                <SelectItem value="media">Média</SelectItem>
                <SelectItem value="baixa">Baixa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card className="border border-white/10 bg-slate-900/60">
        <CardContent className="p-0">
          {chamadosFiltrados.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-4">
              <TicketCheck className="h-10 w-10 text-slate-600 mb-3" />
              <p className="text-slate-400 font-medium">Nenhum chamado encontrado.</p>
              <p className="text-sm text-slate-500 mt-1">Tente ajustar os filtros de busca.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-slate-400">#</TableHead>
                  <TableHead className="text-slate-400">Título</TableHead>
                  <TableHead className="text-slate-400 hidden md:table-cell">Equipamento</TableHead>
                  <TableHead className="text-slate-400 hidden lg:table-cell">Cliente</TableHead>
                  <TableHead className="text-slate-400">Prioridade</TableHead>
                  <TableHead className="text-slate-400">Status</TableHead>
                  <TableHead className="text-slate-400 hidden sm:table-cell">Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {chamadosFiltrados.map((chamado) => (
                  <TableRow key={chamado.id} className="border-white/5 hover:bg-white/5">
                    <TableCell className="text-slate-500 font-mono text-xs">#{chamado.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-white text-sm">{chamado.titulo}</p>
                        {chamado.tecnico_nome && (
                          <p className="text-xs text-slate-500 mt-0.5">Técnico: {chamado.tecnico_nome}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-400 text-sm hidden md:table-cell">
                      <div className="flex items-center gap-1.5">
                        <MonitorSmartphone className="h-3.5 w-3.5 text-slate-500" />
                        {chamado.equipamento_nome}
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-400 text-sm hidden lg:table-cell">
                      <div className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-slate-500" />
                        {chamado.cliente_nome}
                      </div>
                    </TableCell>
                    <TableCell>
                      <PrioridadeBadge prioridade={chamado.prioridade} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={chamado.status} />
                    </TableCell>
                    <TableCell className="text-slate-500 text-xs hidden sm:table-cell">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(chamado.aberto_em)}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
