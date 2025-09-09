"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/components/LanguageContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Package, AlertTriangle, TrendingUp, CheckCircle, XCircle, MapPin, BarChart3 } from 'lucide-react';

interface EstoqueItem {
  id: string;
  sku: string;
  nomeProduto: string;
  categoria: string;
  fornecedor: string;
  estoqueAtual: number;
  estoqueMinimo: number;
  estoqueMaximo: number;
  unidade: string;
  localizacao: string;
  ultimoMovimento: string;
  status: string;
  valorUnitario: number;
  valorTotal: number;
}

interface Deposito {
  id: number;
  nome: string;
  quantidade: number;
  unidade: string;
  ocupacaoPercentual: number;
}

interface Metrics {
  totalEstoque: number;
  produtosOK: number;
  baixoEstoque: number;
  foraEstoque: number;
  totalProdutos: number;
}

export default function ControleEstoque() {
  const { t } = useLanguage();
  const [metrics, setMetrics] = useState<Metrics>({
    totalEstoque: 0,
    produtosOK: 0,
    baixoEstoque: 0,
    foraEstoque: 0,
    totalProdutos: 0
  });
  const [itens, setItens] = useState<EstoqueItem[]>([]);
  const [depositos, setDepositos] = useState<Deposito[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEstoqueData();
  }, []);

  const fetchEstoqueData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/estoque/dashboard');
      if (!response.ok) {
        throw new Error('Erro ao buscar dados de estoque');
      }
      const data = await response.json();

      setMetrics(data.metrics);
      setItens(data.itens);
      setDepositos(data.mapaDepositos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Erro ao buscar dados de estoque:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Normal":
        return "bg-green-100 text-green-800";
      case "Baixo Estoque":
        return "bg-yellow-100 text-yellow-800";
      case "Fora de Estoque":
        return "bg-red-100 text-red-800";
      case "Excesso":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getEstoquePercentual = (atual: number, maximo: number) => {
    if (maximo === 0) return 0;
    return Math.min((atual / maximo) * 100, 100);
  };

  const stats = [
    {
      title: "Total em Estoque",
      value: `${metrics.totalEstoque.toLocaleString('pt-BR')}m`,
      change: "+5.2%",
      changeType: "positive",
      icon: Package,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Produtos OK",
      value: metrics.produtosOK.toString(),
      change: "+2.1%",
      changeType: "positive",
      icon: CheckCircle,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Baixo Estoque",
      value: metrics.baixoEstoque.toString(),
      change: "-1.3%",
      changeType: "negative",
      icon: AlertTriangle,
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      title: "Fora de Estoque",
      value: metrics.foraEstoque.toString(),
      change: "-0.8%",
      changeType: "negative",
      icon: XCircle,
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50"
    }
  ];

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando dados de estoque...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto" />
            <p className="mt-4 text-red-600">Erro ao carregar dados: {error}</p>
            <button
              onClick={fetchEstoqueData}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header com gradiente */}
        <header className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-8">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">Controle de Estoque</h1>
                <p className="text-blue-100 text-lg">Monitoramento e gestão de inventário</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white">
                  <div className="flex items-center space-x-2">
                    <BarChart3 size={24} />
                    <div>
                      <p className="text-sm opacity-90">Total de Produtos</p>
                      <p className="text-2xl font-bold">{metrics.totalProdutos}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
          {/* Cards de Métricas */}
          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className={`${stat.bgColor} overflow-hidden shadow-lg rounded-xl border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                        <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                        <div className="flex items-center">
                          <span className={`text-sm font-medium ${
                            stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {stat.change}
                          </span>
                          <span className="text-sm text-gray-500 ml-2">vs mês anterior</span>
                        </div>
                      </div>
                      <div className={`p-3 rounded-full bg-gradient-to-r ${stat.color} shadow-lg`}>
                        <IconComponent size={24} className="text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tabela de Estoque */}
          <div className="bg-white shadow-lg rounded-xl border border-gray-200 overflow-hidden mb-8">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Inventário de Produtos
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Controle detalhado de estoques e localizações
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estoque Atual
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Localização
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {itens.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {item.nomeProduto}
                          </div>
                          <div className="text-sm text-gray-500">
                            {item.sku} • {item.categoria}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="flex-1">
                            <div className="text-sm text-gray-900">
                              {item.estoqueAtual} {item.unidade}
                            </div>
                            <div className="text-xs text-gray-500">
                              Mín: {item.estoqueMinimo} • Máx: {item.estoqueMaximo}
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                              <div
                                className={`h-2 rounded-full ${
                                  item.status === 'Fora de Estoque' ? 'bg-red-500' :
                                  item.status === 'Baixo Estoque' ? 'bg-yellow-500' :
                                  item.status === 'Excesso' ? 'bg-blue-500' : 'bg-green-500'
                                }`}
                                style={{ width: `${getEstoquePercentual(item.estoqueAtual, item.estoqueMaximo)}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {item.localizacao}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        R$ {item.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button className="text-indigo-600 hover:text-indigo-900 transition-colors">
                          Movimentar
                        </button>
                        <button className="text-blue-600 hover:text-blue-900 transition-colors">
                          Detalhes
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mapa de Depósito */}
          <div className="bg-white shadow-lg rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Mapa do Depósito
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {depositos.map((deposito) => (
                <div key={deposito.id} className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <h4 className="font-medium text-gray-900 mb-2">{deposito.nome}</h4>
                  <p className="text-sm text-gray-500 mb-3">
                    {deposito.quantidade.toLocaleString('pt-BR')} {deposito.unidade}
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${deposito.ocupacaoPercentual}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {deposito.ocupacaoPercentual.toFixed(1)}% ocupado
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Alertas */}
          <div className="mt-8 bg-white shadow-lg rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
              Alertas de Estoque
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center">
                  <XCircle className="h-5 w-5 text-red-500 mr-3" />
                  <span className="text-sm text-red-800">{metrics.foraEstoque} produtos fora de estoque</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3" />
                  <span className="text-sm text-yellow-800">{metrics.baixoEstoque} produtos com baixo estoque</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-sm text-green-800">{metrics.produtosOK} produtos em situação normal</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
