"use client";

import { Suspense, useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Eye, User, Phone, Mail, Building, Percent } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "../../../components/LanguageContext";

interface Representante {
  id: number;
  nome: string;
  email: string | null;
  telefone: string | null;
  empresa: string | null;
  comissao: number | null;
  ativo: boolean;
  createdAt: string;
}

interface RepresentantesStats {
  total: number;
  ativos: number;
  inativos: number;
  comClientes: number;
}

function RepresentantesStats() {
  const [stats, setStats] = useState<RepresentantesStats>({
    total: 0,
    ativos: 0,
    inativos: 0,
    comClientes: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/representantes/stats');
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
          <CardTitle className="text-sm font-medium">Total de Representantes</CardTitle>
          <User className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-xs text-muted-foreground">
            Representantes cadastrados
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Representantes Ativos</CardTitle>
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
          <CardTitle className="text-sm font-medium">Representantes Inativos</CardTitle>
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
          <CardTitle className="text-sm font-medium">Com Clientes</CardTitle>
          <div className="h-4 w-4 rounded-full bg-blue-500"></div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{stats.comClientes}</div>
          <p className="text-xs text-muted-foreground">
            Funcionalidade em desenvolvimento
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function RepresentantesTable() {
  const { t } = useLanguage();
  const [representantes, setRepresentantes] = useState<Representante[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchRepresentantes();
  }, []);

  const fetchRepresentantes = async () => {
    try {
      const response = await fetch('/api/representantes');
      if (response.ok) {
        const data = await response.json();
        setRepresentantes(data);
      }
    } catch (error) {
      console.error('Erro ao buscar representantes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRepresentantes = representantes.filter(representante =>
    representante.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    representante.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    representante.empresa?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div>Carregando representantes...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Buscar representantes por nome, email ou empresa..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredRepresentantes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <User className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum representante encontrado
            </h3>
            <p className="text-gray-500 text-center mb-4">
              {searchTerm ? 'Tente ajustar sua busca' : 'Comece criando seu primeiro representante'}
            </p>
            {!searchTerm && (
              <Link href="/cadastro/representantes/novo">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Representante
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredRepresentantes.map((representante) => (
            <Card key={representante.id} className="hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer border-l-4 border-l-purple-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{representante.nome}</h3>
                      <Badge variant={representante.ativo ? 'default' : 'secondary'}>
                        {representante.ativo ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                    {representante.empresa && (
                      <p className="text-sm text-gray-600 mb-2">
                        Empresa: {representante.empresa}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      {representante.telefone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          <span>{representante.telefone}</span>
                        </div>
                      )}
                      {representante.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          <span>{representante.email}</span>
                        </div>
                      )}
                      {representante.comissao && (
                        <div className="flex items-center gap-1">
                          <Percent className="h-4 w-4" />
                          <span>{representante.comissao}% de comissão</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/cadastro/representantes/${representante.id}`}>
                      <Button variant="outline" size="sm" className="hover:bg-purple-50 hover:border-purple-300 transition-colors duration-200">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/cadastro/representantes/${representante.id}/editar`}>
                      <Button variant="outline" size="sm" className="hover:bg-purple-50 hover:border-purple-300 transition-colors duration-200">
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

export default function Representantes() {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <User className="h-8 w-8" />
              Representantes
            </h1>
            <p className="text-purple-100 mt-2">
              Gerencie os representantes do seu sistema
            </p>
          </div>
          <Link href="/cadastro/representantes/novo">
            <Button className="bg-white text-purple-600 hover:bg-purple-50 hover:scale-105 transition-all duration-200 shadow-lg">
              <Plus className="h-4 w-4 mr-2" />
              Novo Representante
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <Suspense fallback={<div>Carregando estatísticas...</div>}>
        <RepresentantesStats />
      </Suspense>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Representantes Cadastrados</CardTitle>
          <CardDescription>
            Lista completa de todos os representantes do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Carregando representantes...</div>}>
            <RepresentantesTable />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
