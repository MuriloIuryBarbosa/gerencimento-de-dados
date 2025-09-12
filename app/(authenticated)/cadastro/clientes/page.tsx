"use client";

import { Suspense, useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Eye, Users, Building, Phone, Mail, Upload } from "lucide-react";
import Link from "next/link";

interface Cliente {
  id: number;
  nome: string;
  razaoSocial: string | null;
  cnpj: string | null;
  endereco: string | null;
  telefone: string | null;
  email: string | null;
  contato: string | null;
  ativo: boolean;
  createdAt: string;
}

interface ClientesStats {
  total: number;
  ativos: number;
  inativos: number;
  comRepresentante: number;
}

function ClientesStats() {
  const [stats, setStats] = useState<ClientesStats>({
    total: 0,
    ativos: 0,
    inativos: 0,
    comRepresentante: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/clientes/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-xs text-muted-foreground">
            Clientes cadastrados
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
          <div className="h-4 w-4 rounded-full bg-green-500"></div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.ativos}</div>
          <p className="text-xs text-muted-foreground">
            {stats.total > 0 ? Math.round((stats.ativos / stats.total) * 100) : 0}% do total
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Clientes Inativos</CardTitle>
          <div className="h-4 w-4 rounded-full bg-red-500"></div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{stats.inativos}</div>
          <p className="text-xs text-muted-foreground">
            {stats.total > 0 ? Math.round((stats.inativos / stats.total) * 100) : 0}% do total
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Com Representante</CardTitle>
          <div className="h-4 w-4 rounded-full bg-blue-500"></div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{stats.comRepresentante}</div>
          <p className="text-xs text-muted-foreground">
            Funcionalidade em desenvolvimento
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function ClientesTable() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      const response = await fetch('/api/clientes');
      if (response.ok) {
        const data = await response.json();
        setClientes(data);
      }
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredClientes = clientes.filter(cliente =>
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.razaoSocial?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.cnpj?.includes(searchTerm) ||
    cliente.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div>Carregando clientes...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Buscar clientes por nome, razão social, CNPJ ou email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredClientes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum cliente encontrado
            </h3>
            <p className="text-gray-500 text-center mb-4">
              {searchTerm ? 'Tente ajustar sua busca' : 'Comece criando seu primeiro cliente'}
            </p>
            {!searchTerm && (
              <div className="flex gap-2">
                <Link href="/cadastro/clientes/novo">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Primeiro Cliente
                  </Button>
                </Link>
                <Link href="/cadastro/clientes/upload">
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload CSV
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredClientes.map((cliente) => (
            <Card key={cliente.id} className="hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer border-l-4 border-l-indigo-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{cliente.nome}</h3>
                      <Badge variant={cliente.ativo ? 'default' : 'secondary'}>
                        {cliente.ativo ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                    {cliente.razaoSocial && (
                      <p className="text-sm text-gray-600 mb-2">
                        Razão Social: {cliente.razaoSocial}
                      </p>
                    )}
                    {cliente.cnpj && (
                      <p className="text-sm text-gray-600 mb-2">
                        CNPJ: {cliente.cnpj}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      {cliente.telefone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          <span>{cliente.telefone}</span>
                        </div>
                      )}
                      {cliente.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          <span>{cliente.email}</span>
                        </div>
                      )}
                      {cliente.contato && (
                        <div className="flex items-center gap-1">
                          <Building className="h-4 w-4" />
                          <span>{cliente.contato}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/cadastro/clientes/${cliente.id}`}>
                      <Button variant="outline" size="sm" className="hover:bg-indigo-50 hover:border-indigo-300 transition-colors duration-200">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/cadastro/clientes/${cliente.id}/editar`}>
                      <Button variant="outline" size="sm" className="hover:bg-indigo-50 hover:border-indigo-300 transition-colors duration-200">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Clientes() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Users className="h-8 w-8" />
              Clientes
            </h1>
            <p className="text-indigo-100 mt-2">
              Gerencie os clientes do seu sistema
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/cadastro/clientes/upload">
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Upload className="h-4 w-4 mr-2" />
                Upload CSV
              </Button>
            </Link>
            <Link href="/cadastro/clientes/novo">
              <Button className="bg-white text-indigo-600 hover:bg-indigo-50 hover:scale-105 transition-all duration-200 shadow-lg">
                <Plus className="h-4 w-4 mr-2" />
                Novo Cliente
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <Suspense fallback={<div>Carregando estatísticas...</div>}>
        <ClientesStats />
      </Suspense>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Clientes Cadastrados</CardTitle>
          <CardDescription>
            Lista completa de todos os clientes do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Carregando clientes...</div>}>
            <ClientesTable />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
