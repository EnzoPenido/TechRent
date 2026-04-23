"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import {
  TicketPlus, MonitorSmartphone, AlertCircle, ArrowLeft, Loader2, CheckCircle2,
} from "lucide-react";

const API = "http://localhost:3001";

export default function NovoChamadoPage() {
  const auth = useAuth();
  const { user, token, mounted } = auth || {};
  const router = useRouter();
  const [equipamentos, setEquipamentos] = useState([]);

  if (!mounted) return null;
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    equipamento_id: "",
    titulo: "",
    descricao: "",
    prioridade: "media",
  });

  useEffect(() => {
    if (!user || !token) {
      router.push("/login");
      return;
    }

    const fetchEquipamentos = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API}/equipamentos`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const operacionais = res.data.filter((eq) => eq.status === "operacional");
        setEquipamentos(operacionais);
      } catch (error) {
        setError("Não foi possível carregar os equipamentos.");
      } finally {
        setLoading(false);
      }
    };
    fetchEquipamentos();
  }, [user, token, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.titulo || !form.equipamento_id) {
      setError("Título e equipamento são obrigatórios.");
      return;
    }

    try {
      setSubmitting(true);
      await axios.post(`${API}/chamados`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (error) {
      setError(error.response?.data?.mensagem || "Erro ao criar chamado.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-96px)] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
          <p className="text-sm">Carregando equipamentos...</p>
        </div>
      </div>
    );
  }

  if (equipamentos.length === 0) {
    return (
      <div className="flex min-h-[calc(100vh-96px)] items-center justify-center px-6">
        <Card className="w-full max-w-md border border-white/10 bg-slate-900/90 text-center">
          <CardContent className="pt-8 pb-6 px-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-800 mx-auto mb-4">
              <MonitorSmartphone className="h-7 w-7 text-slate-500" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Nenhum equipamento disponível</h3>
            <p className="text-sm text-slate-400 mb-6">
              Não há equipamentos operacionais para abrir um chamado. Solicite ao administrador que cadastre máquinas no sistema.
            </p>
            <Button asChild className="w-full">
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-1.5" />
                Voltar ao Dashboard
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex min-h-[calc(100vh-96px)] items-center justify-center px-6">
        <Card className="w-full max-w-md border border-green-500/20 bg-slate-900/90 text-center">
          <CardContent className="pt-8 pb-6 px-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500/20 mx-auto mb-4">
              <CheckCircle2 className="h-7 w-7 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Chamado criado com sucesso!</h3>
            <p className="text-sm text-slate-400">Redirecionando para o dashboard...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-96px)] items-center justify-center px-6 py-10">
      <Card className="w-full max-w-2xl border border-white/10 bg-slate-900/90 shadow-2xl shadow-slate-950/40">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 ring-1 ring-cyan-500/30">
              <TicketPlus className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <CardTitle>Abrir Chamado</CardTitle>
              <CardDescription>Relate um problema de TI para atendimento</CardDescription>
            </div>
          </div>
        </CardHeader>

        <Separator className="bg-white/5" />

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400 ring-1 ring-red-500/20">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="equipamento_id">
                Equipamento com problema <span className="text-red-400">*</span>
              </Label>
              <Select
                value={form.equipamento_id}
                onValueChange={(v) => handleSelectChange("equipamento_id", v)}
                required
              >
                <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-100">
                  <SelectValue placeholder="Selecione a máquina com problema..." />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-slate-100">
                  {equipamentos.map((eq) => (
                    <SelectItem key={eq.id} value={String(eq.id)}>
                      <div className="flex items-center gap-2">
                        <MonitorSmartphone className="h-3.5 w-3.5 text-slate-400" />
                        <span>{eq.nome}</span>
                        {eq.patrimonio && (
                          <span className="text-slate-500 text-xs">· {eq.patrimonio}</span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="titulo">
                Título do Problema <span className="text-red-400">*</span>
              </Label>
              <Input
                id="titulo"
                name="titulo"
                value={form.titulo}
                onChange={handleChange}
                placeholder="Ex: Tela não liga, Teclado com problemas, Lentidão..."
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="descricao">Descrição Detalhada</Label>
              <Textarea
                id="descricao"
                name="descricao"
                value={form.descricao}
                onChange={handleChange}
                placeholder="Descreva o problema, quando começou, o que você já tentou..."
                className="min-h-28 bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="prioridade">Prioridade</Label>
              <Select
                value={form.prioridade}
                onValueChange={(v) => handleSelectChange("prioridade", v)}
              >
                <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-slate-100">
                  <SelectItem value="baixa">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-green-400 inline-block" />
                      Baixa
                    </span>
                  </SelectItem>
                  <SelectItem value="media">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-yellow-400 inline-block" />
                      Média
                    </span>
                  </SelectItem>
                  <SelectItem value="alta">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-red-400 inline-block" />
                      Alta
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-2 space-y-2">
              <Button type="submit" className="w-full" disabled={submitting} size="lg">
                {submitting ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Abrindo chamado...</>
                ) : (
                  <><TicketPlus className="h-4 w-4 mr-2" /> Abrir Chamado</>
                )}
              </Button>
              <Button asChild variant="ghost" className="w-full">
                <Link href="/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-1.5" />
                  Cancelar
                </Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
