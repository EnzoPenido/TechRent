"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

export default function NovoChamadoPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [equipamentos, setEquipamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    equipamento_id: "",
    titulo: "",
    descricao: "",
    prioridade: "media"
  });

  useEffect(() => {
    if (!user || !token) {
      router.push("/login");
      return;
    }

    const fetchEquipamentos = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:3001/equipamentos", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        // Filtrar apenas equipamentos operacionais
        const operacionais = res.data.filter((eq) => eq.status === "operacional");
        setEquipamentos(operacionais);
      } catch (error) {
        console.error("Erro ao carregar equipamentos:", error);
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
      await axios.post("http://localhost:3001/chamados", form, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      router.push("/dashboard");
    } catch (error) {
      console.error("Erro ao criar chamado:", error);
      setError(error.response?.data?.mensagem || "Erro ao criar chamado.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-96px)] items-center justify-center">
        <p className="text-slate-400">Carregando equipamentos...</p>
      </div>
    );
  }

  if (equipamentos.length === 0) {
    return (
      <div className="flex min-h-[calc(100vh-96px)] items-center justify-center px-6">
        <Card className="w-full max-w-md border border-white/10 bg-slate-900/90 text-center">
          <CardContent className="pt-6">
            <p className="text-slate-300 mb-4">
              ❌ Não há equipamentos operacionais para abrir chamado.
            </p>
            <p className="text-sm text-slate-400 mb-6">
              Peça ao administrador para cadastrar máquinas no sistema.
            </p>
            <Link href="/dashboard">
              <Button className="w-full">Voltar ao Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-96px)] items-center justify-center px-6 py-10">
      <Card className="w-full max-w-2xl border border-white/10 bg-slate-900/90 shadow-2xl shadow-slate-950/40">
        <CardHeader>
          <CardTitle>Novo Chamado</CardTitle>
          <CardDescription>Relatar um problema de TI e solicitar atendimento</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-lg bg-red-100 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
                {error}
              </div>
            )}

            <div>
              <Label htmlFor="equipamento_id">Equipamento *</Label>
              <select 
                id="equipamento_id" 
                name="equipamento_id"
                value={form.equipamento_id}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                required
              >
                <option value="">Selecione a máquina com problema...</option>
                {equipamentos.map((eq) => (
                  <option key={eq.id} value={eq.id}>
                    {eq.nome} (Patrimônio: {eq.patrimonio})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="titulo">Título do Problema *</Label>
              <Input 
                id="titulo" 
                name="titulo"
                value={form.titulo}
                onChange={handleChange}
                placeholder="Ex: Tela não liga, Teclado com problemas, Lentidão..." 
                required
              />
            </div>

            <div>
              <Label htmlFor="descricao">Descrição Detalhada</Label>
              <textarea 
                id="descricao" 
                name="descricao"
                value={form.descricao}
                onChange={handleChange}
                placeholder="Descreva o problema, quando começou, o que você já tentou..."
                className="flex min-h-24 w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>

            <div>
              <Label htmlFor="prioridade">Prioridade</Label>
              <select 
                id="prioridade" 
                name="prioridade"
                value={form.prioridade}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              >
                <option value="baixa">🟢 Baixa</option>
                <option value="media">🟡 Média</option>
                <option value="alta">🔴 Alta</option>
              </select>
            </div>

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Criando chamado..." : "Abrir Chamado"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-700">
            <Link href="/dashboard">
              <Button variant="ghost" className="w-full">
                Cancelar
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}