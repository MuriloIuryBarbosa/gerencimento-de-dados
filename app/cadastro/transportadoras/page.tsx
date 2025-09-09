"use client";

import { Suspense, useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Eye, Truck, Phone, Mail, MapPin, Clock, DollarSign } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "../../../components/LanguageContext";

interface Transportadora {
  id: number;
  nome: string;
  cnpj: string | null;
  endereco: string | null;
  telefone: string | null;
  email: string | null;
  contato: string | null;
  prazoEntrega: number | null;
  valorFrete: number | null;
  ativo: boolean;
  createdAt: string;
}

interface TransportadorasStats {
  total: number;
  ativos: number;
  inativos: number;
  comPedidos: number;
}

function TransportadorasStats() {
  const [stats, setStats] = useState<TransportadorasStats>({
    total: 0,
    ativos: 0,
    inativos: 0,
    comPedidos: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/transportadoras/stats');
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
          <CardTitle className="text-sm font-medium">Total de Transportadoras</CardTitle>
          <Truck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-xs text-muted-foreground">
            Transportadoras cadastradas
          </p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg hover:scale-105 transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Transportadoras Ativas</CardTitle>
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
          <CardTitle className="text-sm font-medium">Transportadoras Inativas</CardTitle>
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
          <CardTitle className="text-sm font-medium">Com Pedidos</CardTitle>
          <div className="h-4 w-4 rounded-full bg-blue-500"></div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{stats.comPedidos}</div>
          <p className="text-xs text-muted-foreground">
            Transportadoras com pedidos associados
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function TransportadorasTable() {
  const { t } = useLanguage();
  const [transportadoras, setTransportadoras] = useState<Transportadora[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchTransportadoras();
  }, []);

  const fetchTransportadoras = async () => {
    try {
      const response = await fetch('/api/transportadoras');
      if (response.ok) {
        const data = await response.json();
        setTransportadoras(data);
      }
    } catch (error) {
      console.error('Erro ao buscar transportadoras:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransportadoras = transportadoras.filter(transportadora =>
    transportadora.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transportadora.cnpj?.includes(searchTerm) ||
    transportadora.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div>Carregando transportadoras...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Buscar transportadoras por nome, CNPJ ou email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredTransportadoras.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Truck className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma transportadora encontrada
            </h3>
            <p className="text-gray-500 text-center mb-4">
              {searchTerm ? 'Tente ajustar sua busca' : 'Comece criando sua primeira transportadora'}
            </p>
            {!searchTerm && (
              <Link href="/cadastro/transportadoras/novo">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeira Transportadora
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredTransportadoras.map((transportadora) => (
            <Card key={transportadora.id} className="hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer border-l-4 border-l-orange-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{transportadora.nome}</h3>
                      <Badge variant={transportadora.ativo ? 'default' : 'secondary'}>
                        {transportadora.ativo ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      CNPJ: {transportadora.cnpj || 'Não informado'}
                    </p>
                    {transportadora.contato && (
                      <p className="text-sm text-gray-700 mb-2">
                        Contato: {transportadora.contato}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      {transportadora.telefone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          <span>{transportadora.telefone}</span>
                        </div>
                      )}
                      {transportadora.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          <span>{transportadora.email}</span>
                        </div>
                      )}
                      {transportadora.endereco && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{transportadora.endereco}</span>
                        </div>
                      )}
                      {transportadora.prazoEntrega && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{transportadora.prazoEntrega} dias</span>
                        </div>
                      )}
                      {transportadora.valorFrete && (
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          <span>R$ {transportadora.valorFrete.toFixed(2)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/cadastro/transportadoras/${transportadora.id}`}>
                      <Button variant="outline" size="sm" className="hover:bg-orange-50 hover:border-orange-300 transition-colors duration-200">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/cadastro/transportadoras/${transportadora.id}/editar`}>
                      <Button variant="outline" size="sm" className="hover:bg-orange-50 hover:border-orange-300 transition-colors duration-200">
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

export default function Transportadoras() {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Truck className="h-8 w-8" />
              Transportadoras
            </h1>
            <p className="text-orange-100 mt-2">
              Gerencie as transportadoras do seu sistema
            </p>
          </div>
          <Link href="/cadastro/transportadoras/novo">
            <Button className="bg-white text-orange-600 hover:bg-orange-50 hover:scale-105 transition-all duration-200 shadow-lg">
              <Plus className="h-4 w-4 mr-2" />
              Nova Transportadora
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <Suspense fallback={<div>Carregando estatísticas...</div>}>
        <TransportadorasStats />
      </Suspense>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Transportadoras Cadastradas</CardTitle>
          <CardDescription>
            Lista completa de todas as transportadoras do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Carregando transportadoras...</div>}>
            <TransportadorasTable />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
