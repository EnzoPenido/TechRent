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
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import {
  History, ArrowLeft, Search, Loader2, Wrench, MonitorSmartphone,
  Users, Calendar, FileText,
} from "lucide-react";

const API = "http://localhost:3001";

function formatDateTime(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function ManutencaoPage() {
  const auth = useAuth();
  const { user, token, mounted } = auth || {};
  const router = useRouter();
  const [registros, setRegistros] = useState([]);

  if (!mounted) return null;
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!user || !token) {
      router.push("/login");
      return;
    }
    if (user.nivel_acesso === "cliente") {
      router.push("/dashboard");
      return;
    }
    fetchManutencao();
  }, [user, token]);

  const fetchManutencao = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/manutencao`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRegistros(res.data);
    } catch (err) {
      console.error("Erro ao carregar histórico:", err);
    } finally {
      setLoading(false);
    }
  };

  const registrosFiltrados = registros.filter((r) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      r.chamado_titulo?.toLowerCase().includes(q) ||
      r.equipamento?.toLowerCase().includes(q) ||
      r.tecnico_nome?.toLowerCase().includes(q) ||
      r.descricao?.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-96px)] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
          <p className="text-sm">Carregando histórico...</p>
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
            <History className="h-6 w-6 text-cyan-400" />
            Histórico de Manutenção
          </h1>
          <p className="text-slate-400 mt-0.5 text-sm">
            {registros.length} registro{registros.length !== 1 ? "s" : ""} de manutenção
          </p>
        </div>
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Dashboard
          </Link>
        </Button>
      </div>

      {/* Busca */}
      <Card className="border border-white/10 bg-slate-900/60 mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input
              placeholder="Buscar por chamado, equipamento, técnico ou descrição..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card className="border border-white/10 bg-slate-900/60">
        <CardContent className="p-0">
          {registrosFiltrados.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-4">
              <Wrench className="h-10 w-10 text-slate-600 mb-3" />
              <p className="text-slate-400 font-medium">
                {search ? "Nenhum registro encontrado." : "Nenhuma manutenção registrada ainda."}
              </p>
              <p className="text-sm text-slate-500 mt-1">
                {search ? "Tente ajustar os termos de busca." : "Os registros aparecerão aqui quando técnicos resolverem chamados."}
              </p>
            </div>
          ) : (
            <>
              {/* Versão mobile: cards */}
              <div className="block sm:hidden divide-y divide-white/5">
                {registrosFiltrados.map((r) => (
                  <div key={r.id} className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-white text-sm">{r.chamado_titulo}</p>
                        <p className="text-xs text-slate-500 mt-0.5">#{r.chamado_id}</p>
                      </div>
                      <span className="text-xs text-slate-500 shrink-0">{formatDateTime(r.registrado_em)}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <MonitorSmartphone className="h-3 w-3" />
                        {r.equipamento}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {r.tecnico_nome}
                      </span>
                    </div>
                    {r.descricao && (
                      <p className="text-xs text-slate-400 bg-slate-800/50 rounded p-2 line-clamp-3">
                        {r.descricao}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Versão desktop: tabela */}
              <div className="hidden sm:block">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-transparent">
                      <TableHead className="text-slate-400">#</TableHead>
                      <TableHead className="text-slate-400">Chamado</TableHead>
                      <TableHead className="text-slate-400">Equipamento</TableHead>
                      <TableHead className="text-slate-400">Técnico</TableHead>
                      <TableHead className="text-slate-400">O que foi feito</TableHead>
                      <TableHead className="text-slate-400">Data</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {registrosFiltrados.map((r) => (
                      <TableRow key={r.id} className="border-white/5 hover:bg-white/5">
                        <TableCell className="text-slate-500 font-mono text-xs">#{r.chamado_id}</TableCell>
                        <TableCell>
                          <p className="font-medium text-white text-sm">{r.chamado_titulo}</p>
                        </TableCell>
                        <TableCell className="text-slate-400 text-sm">
                          <div className="flex items-center gap-1.5">
                            <MonitorSmartphone className="h-3.5 w-3.5 text-slate-500" />
                            {r.equipamento}
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-400 text-sm">
                          <div className="flex items-center gap-1.5">
                            <Users className="h-3.5 w-3.5 text-slate-500" />
                            {r.tecnico_nome}
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-400 text-sm max-w-xs">
                          <p className="line-clamp-2">{r.descricao}</p>
                        </TableCell>
                        <TableCell className="text-slate-500 text-xs whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDateTime(r.registrado_em)}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
