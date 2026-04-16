"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

export default function EquipamentosPage() {
  const { user, token, logout } = useAuth();
  const [equipamentos, setEquipamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    categoria: "",
    patrimonio: "",
    status: "operacional",
    descricao: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!user || !token || user.nivel_acesso !== "admin") {
      window.location.href = "/dashboard";
      return;
    }
    carregarEquipamentos();
  }, [user, token]);

  const carregarEquipamentos = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3001/equipamentos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEquipamentos(res.data);
    } catch (err) {
      console.error("Erro ao carregar equipamentos:", err);
      setError("Não foi possível carregar equipamentos.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.nome || !formData.patrimonio) {
      setError("Nome e patrimônio são obrigatórios.");
      return;
    }

    try {
      await axios.post("http://localhost:3001/equipamentos", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Equipamento criado com sucesso!");
      setFormData({
        nome: "",
        categoria: "",
        patrimonio: "",
        status: "operacional",
        descricao: "",
      });
      setShowForm(false);
      carregarEquipamentos();
    } catch (err) {
      console.error("Erro ao criar equipamento:", err);
      setError(
        err.response?.data?.mensagem || "Erro ao criar equipamento."
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Deseja remover este equipamento?")) return;

    try {
      await axios.delete(`http://localhost:3001/equipamentos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Equipamento removido com sucesso!");
      carregarEquipamentos();
    } catch (err) {
      console.error("Erro ao remover equipamento:", err);
      setError("Erro ao remover equipamento.");
    }
  };

  if (loading) {
    return <div className="container mx-auto p-6">Carregando...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Gerenciar Equipamentos</h1>
          <p className="text-slate-400 mt-1">Cadastre e administre máquinas do inventário</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowForm(!showForm)} size="lg">
            {showForm ? "Cancelar" : "Novo Equipamento"}
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              logout();
              window.location.href = "/login";
            }}
          >
            Logout
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-100 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-6 rounded-lg bg-green-100 px-4 py-3 text-sm text-green-700 ring-1 ring-green-200">
          {success}
        </div>
      )}

      {showForm && (
        <Card className="mb-8 border border-white/10 bg-slate-900/90">
          <CardHeader>
            <CardTitle>Novo Equipamento</CardTitle>
            <CardDescription>Adicione uma máquina ao inventário</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="nome">Nome *</Label>
                  <Input
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    placeholder="Ex: Notebook Dell Latitude"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="patrimonio">Patrimônio *</Label>
                  <Input
                    id="patrimonio"
                    name="patrimonio"
                    value={formData.patrimonio}
                    onChange={handleInputChange}
                    placeholder="Ex: 12345"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="categoria">Categoria</Label>
                  <Input
                    id="categoria"
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleInputChange}
                    placeholder="Ex: Computador, Impressora, etc"
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  >
                    <option value="operacional">Operacional</option>
                    <option value="em_manutencao">Em Manutenção</option>
                    <option value="desativado">Desativado</option>
                  </select>
                </div>
              </div>
              <div>
                <Label htmlFor="descricao">Descrição</Label>
                <textarea
                  id="descricao"
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleInputChange}
                  placeholder="Informações adicionais sobre o equipamento"
                  className="flex min-h-20 w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
              <Button type="submit" className="w-full">
                Criar Equipamento
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <h2 className="text-2xl font-bold mb-4">Equipamentos Cadastrados</h2>
      {equipamentos.length === 0 ? (
        <p className="text-slate-400">Nenhum equipamento cadastrado.</p>
      ) : (
        <div className="grid gap-4">
          {equipamentos.map((eq) => (
            <Card key={eq.id} className="border border-white/10 bg-slate-900/50">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{eq.nome}</CardTitle>
                    <CardDescription>Patrimônio: {eq.patrimonio}</CardDescription>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      eq.status === "operacional"
                        ? "bg-green-100 text-green-800"
                        : eq.status === "em_manutencao"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {eq.status === "operacional"
                      ? "✓ Operacional"
                      : eq.status === "em_manutencao"
                      ? "⚠ Em Manutenção"
                      : "✗ Desativado"}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {eq.categoria && <p><strong>Categoria:</strong> {eq.categoria}</p>}
                  {eq.descricao && <p><strong>Descrição:</strong> {eq.descricao}</p>}
                </div>
                <div className="mt-4 flex gap-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(eq.id)}
                  >
                    Remover
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-8">
        <Link href="/dashboard">
          <Button variant="ghost">← Voltar ao Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
