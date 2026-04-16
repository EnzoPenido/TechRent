"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

export default function DashboardPage() {
  const router = useRouter();
  const { user, token, logout } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !token) {
      router.push("/login");
      return;
    }

    const fetchDashboard = async () => {
      try {
        setLoading(true);
        let endpoint = "";
        
        if (user.nivel_acesso === "admin") {
          endpoint = "http://localhost:3001/dashboard/admin";
        } else if (user.nivel_acesso === "tecnico") {
          endpoint = "http://localhost:3001/dashboard/tecnico";
        } else {
          endpoint = "http://localhost:3001/chamados";
        }
        
        const res = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setData(res.data);
      } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboard();
  }, [user, token, router]);

  if (loading) return <div className="container mx-auto p-6 text-slate-400">Carregando...</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-slate-400 mt-1">Bem-vindo, {user?.nome}!</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {user?.nivel_acesso === "cliente" && (
            <Link href="/chamados/novo">
              <Button>Novo Chamado</Button>
            </Link>
          )}
          {user?.nivel_acesso === "admin" && (
            <Link href="/equipamentos">
              <Button>Gerenciar Equipamentos</Button>
            </Link>
          )}
          <Button
            variant="ghost"
            onClick={() => {
              logout();
              router.push("/login");
            }}
          >
            Logout
          </Button>
        </div>
      </div>
      
      {user?.nivel_acesso === "cliente" && (
        <>
          <h2 className="text-2xl font-bold mb-4">Seus Chamados</h2>
          {Array.isArray(data) && data.length > 0 ? (
            <div className="grid gap-4">
              {data.map((chamado) => (
                <Card key={chamado.id} className="border border-white/10 bg-slate-900/50">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{chamado.titulo}</CardTitle>
                        <CardDescription>{chamado.equipamento_nome}</CardDescription>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          chamado.status === "aberto"
                            ? "bg-blue-100 text-blue-800"
                            : chamado.status === "em_atendimento"
                            ? "bg-yellow-100 text-yellow-800"
                            : chamado.status === "resolvido"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {chamado.status === "aberto"
                          ? "🔵 Aberto"
                          : chamado.status === "em_atendimento"
                          ? "⚠️ Atendimento"
                          : chamado.status === "resolvido"
                          ? "✅ Resolvido"
                          : "❌ Cancelado"}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      {chamado.descricao && <p className="text-slate-300">{chamado.descricao}</p>}
                      <p className="text-slate-400">
                        <strong>Prioridade:</strong>{" "}
                        {chamado.prioridade === "alta"
                          ? "🔴 Alta"
                          : chamado.prioridade === "media"
                          ? "🟡 Média"
                          : "🟢 Baixa"}
                      </p>
                      <p className="text-slate-400">
                        <strong>Aberto em:</strong> {new Date(chamado.aberto_em).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-slate-400">Nenhum chamado aberto.</p>
          )}
        </>
      )}
      
      {user?.nivel_acesso === "admin" && (
        <>
          <h2 className="text-2xl font-bold mb-4">Resumo</h2>
          {data && (
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Chamados</CardTitle>
                </CardHeader>
                <CardContent>
                  {data.resumoChamados && data.resumoChamados.length > 0 ? (
                    data.resumoChamados.map((item) => (
                      <div key={item.status}>
                        {item.status}: {item.total}
                      </div>
                    ))
                  ) : (
                    <p>Nenhum dado</p>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Equipamentos</CardTitle>
                </CardHeader>
                <CardContent>
                  {data.resumoEquipamentos && data.resumoEquipamentos.length > 0 ? (
                    data.resumoEquipamentos.map((item) => (
                      <div key={item.status}>
                        {item.status}: {item.total}
                      </div>
                    ))
                  ) : (
                    <p>Nenhum dado</p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}
      
      {user?.nivel_acesso === "tecnico" && (
        <>
          <h2 className="text-2xl font-bold mb-4">Chamados em Andamento</h2>
          {Array.isArray(data) && data.length > 0 ? (
            <div className="grid gap-4">
              {data.map((chamado) => (
                <Card key={chamado.chamado_id}>
                  <CardHeader>
                    <CardTitle>{chamado.titulo}</CardTitle>
                    <CardDescription>Prioridade: {chamado.prioridade}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Solicitante: {chamado.solicitante}</p>
                    <p>Equipamento: {chamado.equipamento}</p>
                    <p>Status: {chamado.status}</p>
                    <p>Aberto em: {new Date(chamado.aberto_em).toLocaleDateString()}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p>Nenhum chamado em aberto.</p>
          )}
        </>
      )}
    </div>
  );
}