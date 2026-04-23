"use client";

import { useState, useEffect } from "react";
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
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/StatusBadge";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import {
  Plus, Pencil, Trash2, Loader2, ArrowLeft, MonitorSmartphone,
  CheckCircle2, AlertCircle, XCircle,
} from "lucide-react";

const API = "http://localhost:3001";

const EMPTY_FORM = {
  nome: "",
  categoria: "",
  patrimonio: "",
  status: "operacional",
  descricao: "",
};

function StatCard({ icon: Icon, label, value, colorClass }) {
  return (
    <Card className="border border-white/10 bg-slate-900/60">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-400 mb-1">{label}</p>
            <p className="text-3xl font-bold text-white">{value}</p>
          </div>
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colorClass}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function EquipamentosPage() {
  const auth = useAuth();
  const { user, token, mounted } = auth || {};
  const [equipamentos, setEquipamentos] = useState([]);

  if (!mounted) return null;
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null, nome: "" });
  const [notification, setNotification] = useState({ type: "", message: "" });

  useEffect(() => {
    if (!user || !token || user.nivel_acesso !== "admin") {
      window.location.href = "/dashboard";
      return;
    }
    carregarEquipamentos();
  }, [user, token]);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification({ type: "", message: "" }), 4000);
  };

  const carregarEquipamentos = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/equipamentos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEquipamentos(res.data);
    } catch (err) {
      showNotification("error", "Não foi possível carregar equipamentos.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setShowForm(true);
  };

  const handleOpenEdit = (eq) => {
    setEditingId(eq.id);
    setFormData({
      nome: eq.nome || "",
      categoria: eq.categoria || "",
      patrimonio: eq.patrimonio || "",
      status: eq.status || "operacional",
      descricao: eq.descricao || "",
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nome || !formData.patrimonio) {
      showNotification("error", "Nome e patrimônio são obrigatórios.");
      return;
    }
    try {
      setSubmitting(true);
      if (editingId) {
        await axios.put(`${API}/equipamentos/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showNotification("success", "Equipamento atualizado com sucesso!");
      } else {
        await axios.post(`${API}/equipamentos`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showNotification("success", "Equipamento criado com sucesso!");
      }
      setShowForm(false);
      setEditingId(null);
      setFormData(EMPTY_FORM);
      carregarEquipamentos();
    } catch (err) {
      showNotification("error", err.response?.data?.mensagem || "Erro ao salvar equipamento.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`${API}/equipamentos/${deleteDialog.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showNotification("success", "Equipamento removido com sucesso!");
      setDeleteDialog({ open: false, id: null, nome: "" });
      carregarEquipamentos();
    } catch (err) {
      showNotification("error", "Erro ao remover equipamento.");
      setDeleteDialog({ open: false, id: null, nome: "" });
    }
  };

  const operacionais = equipamentos.filter(e => e.status === "operacional").length;
  const emManutencao = equipamentos.filter(e => e.status === "em_manutencao").length;
  const desativados = equipamentos.filter(e => e.status === "desativado").length;

  if (loading) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-8 w-48 bg-slate-800 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[1, 2, 3].map(i => <div key={i} className="h-24 bg-slate-800 rounded-xl animate-pulse" />)}
        </div>
        <div className="h-64 bg-slate-800 rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <MonitorSmartphone className="h-6 w-6 text-cyan-400" />
            Gerenciar Equipamentos
          </h1>
          <p className="text-slate-400 mt-0.5 text-sm">Inventário de máquinas e dispositivos</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleOpenCreate} size="sm">
            <Plus className="h-4 w-4 mr-1.5" />
            Novo Equipamento
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              Dashboard
            </Link>
          </Button>
        </div>
      </div>

      {/* Notificação */}
      {notification.message && (
        <div
          className={`mb-6 flex items-center gap-2 rounded-lg px-4 py-3 text-sm ring-1 ${
            notification.type === "success"
              ? "bg-green-500/10 text-green-400 ring-green-500/20"
              : "bg-red-500/10 text-red-400 ring-red-500/20"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0" />
          )}
          {notification.message}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard icon={CheckCircle2} label="Operacionais" value={operacionais} colorClass="bg-green-500/20 text-green-400" />
        <StatCard icon={AlertCircle} label="Em Manutenção" value={emManutencao} colorClass="bg-yellow-500/20 text-yellow-400" />
        <StatCard icon={XCircle} label="Desativados" value={desativados} colorClass="bg-slate-500/20 text-slate-400" />
      </div>

      {/* Formulário de criação/edição */}
      {showForm && (
        <Card className="mb-8 border border-white/10 bg-slate-900/90">
          <CardHeader className="pb-4">
            <CardTitle className="text-base">
              {editingId ? "Editar Equipamento" : "Novo Equipamento"}
            </CardTitle>
            <CardDescription>
              {editingId ? "Atualize as informações do equipamento" : "Preencha os dados para adicionar ao inventário"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
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
                <div className="space-y-1.5">
                  <Label htmlFor="patrimonio">Patrimônio *</Label>
                  <Input
                    id="patrimonio"
                    name="patrimonio"
                    value={formData.patrimonio}
                    onChange={handleInputChange}
                    placeholder="Ex: PAT-12345"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="categoria">Categoria</Label>
                  <Input
                    id="categoria"
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleInputChange}
                    placeholder="Ex: Notebook, Impressora, Servidor"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(v) => handleSelectChange("status", v)}
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-slate-100">
                      <SelectItem value="operacional">Operacional</SelectItem>
                      <SelectItem value="em_manutencao">Em Manutenção</SelectItem>
                      <SelectItem value="desativado">Desativado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleInputChange}
                  placeholder="Informações adicionais sobre o equipamento"
                  className="min-h-20 bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <Button type="submit" disabled={submitting} className="flex-1 sm:flex-none">
                  {submitting ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Salvando...</>
                  ) : editingId ? (
                    <><Pencil className="h-4 w-4 mr-2" /> Salvar Alterações</>
                  ) : (
                    <><Plus className="h-4 w-4 mr-2" /> Criar Equipamento</>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => { setShowForm(false); setEditingId(null); setFormData(EMPTY_FORM); }}
                  disabled={submitting}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Tabela de Equipamentos */}
      <Card className="border border-white/10 bg-slate-900/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Equipamentos Cadastrados</CardTitle>
          <CardDescription>{equipamentos.length} equipamento{equipamentos.length !== 1 ? "s" : ""} no inventário</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {equipamentos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-4">
              <MonitorSmartphone className="h-10 w-10 text-slate-600 mb-3" />
              <p className="text-slate-400 font-medium">Nenhum equipamento cadastrado.</p>
              <p className="text-sm text-slate-500 mt-1">Clique em "Novo Equipamento" para começar.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-slate-400">Nome</TableHead>
                  <TableHead className="text-slate-400">Patrimônio</TableHead>
                  <TableHead className="text-slate-400 hidden sm:table-cell">Categoria</TableHead>
                  <TableHead className="text-slate-400">Status</TableHead>
                  <TableHead className="text-slate-400 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {equipamentos.map((eq) => (
                  <TableRow key={eq.id} className="border-white/5 hover:bg-white/5">
                    <TableCell className="font-medium text-white">
                      {eq.nome}
                      {eq.descricao && (
                        <p className="text-xs text-slate-500 font-normal mt-0.5 line-clamp-1">{eq.descricao}</p>
                      )}
                    </TableCell>
                    <TableCell className="text-slate-400 font-mono text-sm">{eq.patrimonio}</TableCell>
                    <TableCell className="text-slate-400 hidden sm:table-cell">{eq.categoria || "—"}</TableCell>
                    <TableCell>
                      <StatusBadge status={eq.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10"
                          onClick={() => handleOpenEdit(eq)}
                          title="Editar"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                          onClick={() => setDeleteDialog({ open: true, id: eq.id, nome: eq.nome })}
                          title="Remover"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialog de confirmação de exclusão */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog(prev => ({ ...prev, open }))}>
        <DialogContent className="bg-slate-900 border border-white/10 text-white max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-400">
              <Trash2 className="h-5 w-5" />
              Remover Equipamento
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Tem certeza que deseja remover <strong className="text-slate-200">{deleteDialog.nome}</strong>? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setDeleteDialog({ open: false, id: null, nome: "" })}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              <Trash2 className="h-4 w-4 mr-1.5" />
              Remover
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
