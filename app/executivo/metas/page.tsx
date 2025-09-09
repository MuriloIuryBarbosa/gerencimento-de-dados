"use client";

import { useLanguage } from "../../../components/LanguageContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Target, TrendingUp, Users, DollarSign, Ruler, BarChart3, AlertCircle, CheckCircle } from 'lucide-react';

interface MetasData {
  representantes: Array<{
    id: number;
    nome: string;
  }>;
  metasCompra: Array<{
    representanteId: number;
    representanteNome: string;
    metaValor: number;
    metaMetragem: number;
    realizadoValor: number;
    realizadoMetragem: number;
    percentualValor: number;
    percentualMetragem: number;
  }>;
  metasVenda: Array<{
    representanteId: number;
    representanteNome: string;
    metaValor: number;
    metaMetragem: number;
    realizadoValor: number;
    realizadoMetragem: number;
    percentualValor: number;
    percentualMetragem: number;
  }>;
  totais: {
    metaCompraValor: number;
    realizadoCompraValor: number;
    metaCompraMetragem: number;
    realizadoCompraMetragem: number;
    metaVendaValor: number;
    realizadoVendaValor: number;
    metaVendaMetragem: number;
    realizadoVendaMetragem: number;
    percentualCompraValor: number;
    percentualCompraMetragem: number;
    percentualVendaValor: number;
    percentualVendaMetragem: number;
  };
  resumo: {
    totalRepresentantes: number;
    metasAtivas: number;
    metasPendentes: number;
  };
}

export default function Metas() {
  const { t } = useLanguage();
  const [metasData, setMetasData] = useState<MetasData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetasData = async () => {
      try {
        const response = await fetch('/api/executivo/metas');
        if (response.ok) {
          const data = await response.json();
          setMetasData(data);
        }
      } catch (error) {
        console.error('Erro ao buscar dados de metas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetasData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando dados de metas...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header */}
        <header className="bg-gradient-to-r from-red-600 to-red-700 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 p-3 rounded-full">
                  <Target size={32} className="text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">Metas</h1>
                  <p className="mt-1 text-red-100">
                    Dashboard de metas de compra e venda por representante
                  </p>
                </div>
              </div>
              <nav className="flex space-x-4">
                <Link
                  href="/executivo"
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full transition-colors duration-200"
                >
                  ← Voltar ao Executivo
                </Link>
              </nav>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
          {/* Cards de Resumo */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Resumo Geral</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-100">Total de Representantes</p>
                    <p className="text-3xl font-bold">{metasData?.resumo.totalRepresentantes || 0}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-200" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-100">Metas Ativas</p>
                    <p className="text-3xl font-bold">{metasData?.resumo.metasAtivas || 0}</p>
                  </div>
                  <Target className="h-8 w-8 text-green-200" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-100">Metas Pendentes</p>
                    <p className="text-3xl font-bold">{metasData?.resumo.metasPendentes || 0}</p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-yellow-200" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-100">Performance Geral</p>
                    <p className="text-3xl font-bold">0%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-200" />
                </div>
              </div>
            </div>
          </div>

          {/* Metas de Compra */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Metas de Compra</h2>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Performance por Representante</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Representante
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Meta Valor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Realizado Valor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        % Valor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Meta Metragem
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Realizado Metragem
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        % Metragem
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {metasData?.metasCompra.map((meta, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {meta.representanteNome}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          R$ {meta.metaValor.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          R$ {meta.realizadoValor.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            meta.percentualValor >= 100 ? 'bg-green-100 text-green-800' :
                            meta.percentualValor >= 80 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {meta.percentualValor}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {meta.metaMetragem} m
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {meta.realizadoMetragem} m
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            meta.percentualMetragem >= 100 ? 'bg-green-100 text-green-800' :
                            meta.percentualMetragem >= 80 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {meta.percentualMetragem}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Metas de Venda */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Metas de Venda</h2>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Performance por Representante</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Representante
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Meta Valor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Realizado Valor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        % Valor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Meta Metragem
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Realizado Metragem
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        % Metragem
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {metasData?.metasVenda.map((meta, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {meta.representanteNome}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          R$ {meta.metaValor.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          R$ {meta.realizadoValor.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            meta.percentualValor >= 100 ? 'bg-green-100 text-green-800' :
                            meta.percentualValor >= 80 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {meta.percentualValor}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {meta.metaMetragem} m
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {meta.realizadoMetragem} m
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            meta.percentualMetragem >= 100 ? 'bg-green-100 text-green-800' :
                            meta.percentualMetragem >= 80 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {meta.percentualMetragem}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Totais Consolidados */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Totais Consolidados</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <DollarSign className="h-6 w-6 text-green-500 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">Metas de Compra</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Meta Valor:</span>
                    <span className="text-sm font-medium">R$ {metasData?.totais.metaCompraValor.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Realizado Valor:</span>
                    <span className="text-sm font-medium">R$ {metasData?.totais.realizadoCompraValor.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Percentual Valor:</span>
                    <span className="text-sm font-medium text-green-600">{metasData?.totais.percentualCompraValor || 0}%</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <Ruler className="h-6 w-6 text-blue-500 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">Metas de Venda</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Meta Valor:</span>
                    <span className="text-sm font-medium">R$ {metasData?.totais.metaVendaValor.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Realizado Valor:</span>
                    <span className="text-sm font-medium">R$ {metasData?.totais.realizadoVendaValor.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Percentual Valor:</span>
                    <span className="text-sm font-medium text-blue-600">{metasData?.totais.percentualVendaValor || 0}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
