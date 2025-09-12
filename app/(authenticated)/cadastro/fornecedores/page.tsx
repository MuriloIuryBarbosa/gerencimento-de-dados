"use client";

import { Suspense, useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Upload, Search, Edit, Eye, Building2, Phone, Mail, MapPin } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "../../../components/LanguageContext";

interface Fornecedor {
  id: number;
  nome: string;
  cnpj: string | null;
  endereco: string | null;
  telefone: string | null;
  email: string | null;
  contatoPrincipal: string | null;
  ativo: boolean;
  createdAt: string;
}

interface FornecedoresStats {
  total: number;
  ativos: number;
  inativos: number;
  comProdutos: number;
}

function FornecedoresStats() {
  const [stats, setStats] = useState<FornecedoresStats>({
    total: 0,
    ativos: 0,
    inativos: 0,
    comProdutos: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/fornecedores/stats');
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
      <Card className="hover:shadow-lg hover:scale-105 transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Fornecedores</CardTitle>
          <Building2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-xs text-muted-foreground">
            Fornecedores cadastrados
          </p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg hover:scale-105 transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Fornecedores Ativos</CardTitle>
          <div className="h-4 w-4 rounded-full bg-green-500"></div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.ativos}</div>
          <p className="text-xs text-muted-foreground">
            {stats.total > 0 ? Math.round((stats.ativos / stats.total) * 100) : 0}% do total
          </p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg hover:scale-105 transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Fornecedores Inativos</CardTitle>
          <div className="h-4 w-4 rounded-full bg-red-500"></div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{stats.inativos}</div>
          <p className="text-xs text-muted-foreground">
            {stats.total > 0 ? Math.round((stats.inativos / stats.total) * 100) : 0}% do total
          </p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg hover:scale-105 transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Com Produtos</CardTitle>
          <div className="h-4 w-4 rounded-full bg-blue-500"></div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{stats.comProdutos}</div>
          <p className="text-xs text-muted-foreground">
            Fornecedores com produtos associados
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function FornecedoresTable() {
  const { t } = useLanguage();
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchFornecedores();
  }, []);

  const fetchFornecedores = async () => {
    try {
      const response = await fetch('/api/fornecedores');
      if (response.ok) {
        const data = await response.json();
        setFornecedores(data);
      }
    } catch (error) {
      console.error('Erro ao buscar fornecedores:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFornecedores = fornecedores.filter(fornecedor =>
    fornecedor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fornecedor.cnpj?.includes(searchTerm) ||
    fornecedor.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div>Carregando fornecedores...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Buscar fornecedores por nome, CNPJ ou email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredFornecedores.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum fornecedor encontrado
            </h3>
            <p className="text-gray-500 text-center mb-4">
              {searchTerm ? 'Tente ajustar sua busca' : 'Comece criando seu primeiro fornecedor'}
            </p>
            {!searchTerm && (
              <Link href="/cadastro/fornecedores/novo">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Fornecedor
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredFornecedores.map((fornecedor) => (
            <Card key={fornecedor.id} className="hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer border-l-4 border-l-green-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{fornecedor.nome}</h3>
                      <Badge variant={fornecedor.ativo ? 'default' : 'secondary'}>
                        {fornecedor.ativo ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      CNPJ: {fornecedor.cnpj || 'Não informado'}
                    </p>
                    {fornecedor.contatoPrincipal && (
                      <p className="text-sm text-gray-700 mb-2">
                        Contato: {fornecedor.contatoPrincipal}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      {fornecedor.telefone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          <span>{fornecedor.telefone}</span>
                        </div>
                      )}
                      {fornecedor.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          <span>{fornecedor.email}</span>
                        </div>
                      )}
                      {fornecedor.endereco && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{fornecedor.endereco}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/cadastro/fornecedores/${fornecedor.id}`}>
                      <Button variant="outline" size="sm" className="hover:bg-green-50 hover:border-green-300 transition-colors duration-200">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/cadastro/fornecedores/${fornecedor.id}/editar`}>
                      <Button variant="outline" size="sm" className="hover:bg-green-50 hover:border-green-300 transition-colors duration-200">
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

export default function Fornecedores() {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Building2 className="h-8 w-8" />
              Fornecedores
            </h1>
            <p className="text-green-100 mt-2">
              Gerencie os fornecedores do seu sistema
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/cadastro/fornecedores/novo">
              <Button className="bg-white text-green-600 hover:bg-green-50 hover:scale-105 transition-all duration-200 shadow-lg">
                <Plus className="h-4 w-4 mr-2" />
                Novo Fornecedor
              </Button>
            </Link>
            <Link href="/cadastro/fornecedores/upload">
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Upload className="h-4 w-4 mr-2" />
                Upload CSV
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <Suspense fallback={<div>Carregando estatísticas...</div>}>
        <FornecedoresStats />
      </Suspense>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Fornecedores Cadastrados</CardTitle>
          <CardDescription>
            Lista completa de todos os fornecedores do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Carregando fornecedores...</div>}>
            <FornecedoresTable />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
