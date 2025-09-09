"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ArrowLeft, Edit, TrendingUp, TrendingDown, Package, DollarSign, Calendar, User } from 'lucide-react';

interface CorDetalhes {
  id: string;
  nome: string;
  codigoHex: string;
  codigoRgb: string;
  categoria: string;
  skusRelacionados: Array<{
    id: string;
    nome: string;
    estoque: number;
    valorUnitario: number;
    vendasMes: number;
  }>;
  estoqueTotal: number;
  valorTotal: number;
  status: string;
  dataCadastro: string;
  fornecedor: string;
  descricao: string;
  historicoEstoque: Array<{
    data: string;
    tipo: 'Entrada' | 'Saída';
    quantidade: number;
    motivo: string;
  }>;
  vendasMensais: Array<{
    mes: string;
    quantidade: number;
    valor: number;
  }>;
}

export default function DetalhesCor() {
  const params = useParams();
  const router = useRouter();
  const [cor, setCor] = useState<CorDetalhes | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCorDetalhes = async () => {
      try {
        const response = await fetch(`/api/executivo/cores/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setCor(data);
        } else {
          // Se não encontrar a cor, redirecionar para a lista
          router.push('/executivo/cores');
        }
      } catch (error) {
        console.error('Erro ao buscar detalhes da cor:', error);
        router.push('/executivo/cores');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchCorDetalhes();
    }
  }, [params.id, router]);

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando detalhes da cor...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!cor) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Cor não encontrada</h2>
            <Link
              href="/executivo/cores"
              className="text-indigo-600 hover:text-indigo-500"
            >
              Voltar para lista de cores
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo':
        return 'bg-green-100 text-green-800';
      case 'Baixo Estoque':
        return 'bg-yellow-100 text-yellow-800';
      case 'Fora de Estoque':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link
                  href="/executivo/cores"
                  className="flex items-center text-indigo-200 hover:text-white transition-colors"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Voltar
                </Link>
                <div>
                  <h1 className="text-3xl font-bold">{cor.nome}</h1>
                  <p className="text-indigo-200">{cor.id}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(cor.status)}`}>
                  {cor.status}
                </span>
                <button className="bg-white text-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-50 transition-colors flex items-center">
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Informações Principais */}
            <div className="lg:col-span-2 space-y-6">
              {/* Amostra da Cor e Informações Básicas */}
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  {/* Amostra da Cor */}
                  <div
                    className="h-64 md:h-auto relative"
                    style={{ backgroundColor: cor.codigoHex }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black bg-opacity-30 px-6 py-3 rounded-lg text-white text-center">
                        <div className="text-2xl font-bold mb-2">{cor.nome}</div>
                        <div className="text-sm opacity-90">{cor.categoria}</div>
                      </div>
                    </div>
                  </div>

                  {/* Informações */}
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Informações da Cor</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Código HEX:</span>
                        <span className="font-mono text-gray-900">{cor.codigoHex}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Código RGB:</span>
                        <span className="font-mono text-gray-900">{cor.codigoRgb}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Categoria:</span>
                        <span className="text-gray-900">{cor.categoria}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Fornecedor:</span>
                        <span className="text-gray-900">{cor.fornecedor}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Data Cadastro:</span>
                        <span className="text-gray-900">
                          {new Date(cor.dataCadastro).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                    {cor.descricao && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600">{cor.descricao}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* SKUs Relacionados */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">SKUs Relacionados</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cor.skusRelacionados.map((sku) => (
                    <div key={sku.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900">{sku.nome}</h4>
                          <p className="text-sm text-gray-500">{sku.id}</p>
                        </div>
                        <span className="text-sm font-medium text-indigo-600">
                          {sku.estoque} metros
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Valor unitário:</span>
                        <span className="font-medium">
                          R$ {sku.valorUnitario.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-gray-500">Vendas/mês:</span>
                        <span className="font-medium">{sku.vendasMes} metros</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Histórico de Estoque */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Histórico de Estoque</h3>
                <div className="space-y-3">
                  {cor.historicoEstoque.map((movimento, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          movimento.tipo === 'Entrada' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {movimento.tipo === 'Entrada' ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{movimento.motivo}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(movimento.data).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <span className={`text-sm font-medium ${
                        movimento.tipo === 'Entrada' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {movimento.tipo === 'Entrada' ? '+' : '-'}{movimento.quantidade} metros
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar com Métricas */}
            <div className="space-y-6">
              {/* Métricas de Estoque */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Métricas de Estoque</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Package className="h-8 w-8 text-indigo-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Estoque Atual</p>
                      <p className="text-2xl font-bold text-gray-900">{cor.estoqueTotal} metros</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-8 w-8 text-green-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Valor Total</p>
                      <p className="text-2xl font-bold text-gray-900">
                        R$ {cor.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-8 w-8 text-blue-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">SKUs Ativos</p>
                      <p className="text-2xl font-bold text-gray-900">{cor.skusRelacionados.length}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vendas Mensais */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Vendas dos Últimos 6 Meses</h3>
                <div className="space-y-3">
                  {cor.vendasMensais.map((mes) => (
                    <div key={mes.mes} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{mes.mes}</span>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{mes.quantidade} metros</p>
                        <p className="text-xs text-gray-500">
                          R$ {mes.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ações Rápidas */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Ações Rápidas</h3>
                <div className="space-y-3">
                  <button className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                    Registrar Entrada
                  </button>
                  <button className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors">
                    Registrar Saída
                  </button>
                  <button className="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors">
                    Gerar Relatório
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
