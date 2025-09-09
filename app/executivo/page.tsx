"use client";

import Link from "next/link";
import { useLanguage } from "../../components/LanguageContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useEffect, useState } from "react";
import { Package, DollarSign, Archive, Palette, BarChart3, TrendingUp, AlertTriangle, CheckCircle, Target } from 'lucide-react';

interface ExecutivoData {
  estatisticasGerais: {
    totalProdutos: number;
    produtosAtivos: number;
    margemMedia: number;
    estoqueTotal: number;
    produtosBaixoEstoque: number;
    precosDesatualizados: number;
  };
  modulos: {
    skus: { total: number; ativos: number; inativos: number };
    cores: { total: number; ativas: number; descontinuadas: number };
    precos: { total: number; atualizados: number; pendentes: number };
    estoque: { total: number; disponivel: number; reservado: number };
  };
  alertas: {
    produtosBaixoEstoque: number;
    precosDesatualizados: number;
  };
}

export default function Executivo() {
  const { t } = useLanguage();
  const [executivoData, setExecutivoData] = useState<ExecutivoData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExecutivoData = async () => {
      try {
        const response = await fetch('/api/executivo');
        if (response.ok) {
          const data = await response.json();
          setExecutivoData(data);
        }
      } catch (error) {
        console.error('Erro ao buscar dados do executivo:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExecutivoData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando dados executivos...</p>
        </div>
      </div>
    );
  }

  const modulos = [
    {
      nome: t('skus'),
      href: '/executivo/skus',
      descricao: 'Gerenciar SKUs do sistema',
      icone: Package,
      cor: 'from-blue-500 to-blue-600',
      stats: executivoData?.modulos.skus || { total: 0, ativos: 0, inativos: 0 },
      labels: { positive: 'Ativos', negative: 'Inativos' }
    },
    {
      nome: t('prices'),
      href: '/executivo/precos',
      descricao: 'Controlar preços e margens',
      icone: DollarSign,
      cor: 'from-green-500 to-green-600',
      stats: executivoData?.modulos.precos || { total: 0, atualizados: 0, pendentes: 0 },
      labels: { positive: 'Atualizados', negative: 'Pendentes' }
    },
    {
      nome: t('stock'),
      href: '/executivo/estoque',
      descricao: 'Gerenciar controle de estoque',
      icone: Archive,
      cor: 'from-orange-500 to-orange-600',
      stats: executivoData?.modulos.estoque || { total: 0, disponivel: 0, reservado: 0 },
      labels: { positive: 'Disponível', negative: 'Reservado' }
    },
    {
      nome: t('colors'),
      href: '/executivo/cores',
      descricao: 'Gerenciar paleta de cores',
      icone: Palette,
      cor: 'from-purple-500 to-purple-600',
      stats: executivoData?.modulos.cores || { total: 0, ativas: 0, descontinuadas: 0 },
      labels: { positive: 'Ativas', negative: 'Descontinuadas' }
    },
    {
      nome: 'Metas',
      href: '/executivo/metas',
      descricao: 'Gerenciar metas de compra e venda',
      icone: Target,
      cor: 'from-red-500 to-red-600',
      stats: { total: 0, ativas: 0, pendentes: 0 },
      labels: { positive: 'Ativas', negative: 'Pendentes' }
    }
  ];

  // Estatísticas gerais do módulo executivo
  const estatisticasGerais = executivoData?.estatisticasGerais || {
    totalProdutos: 0,
    produtosAtivos: 0,
    margemMedia: 0,
    estoqueTotal: 0,
    produtosBaixoEstoque: 0,
    precosDesatualizados: 0
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-full">
                <BarChart3 size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">{t('executive')}</h1>
                <p className="mt-1 text-blue-100">
                  Dashboard executivo com visão geral dos produtos e operações
                </p>
              </div>
            </div>
            <nav className="flex space-x-4">
              <Link
                href="/"
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full transition-colors duration-200"
              >
                ← Voltar ao Dashboard
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        {/* Estatísticas Gerais */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Visão Geral</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Produtos</p>
                  <p className="text-3xl font-bold text-gray-900">{estatisticasGerais.totalProdutos}</p>
                </div>
                <Package className="h-8 w-8 text-blue-500" />
              </div>
              <div className="mt-4 flex items-center text-sm">
                <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-600">{estatisticasGerais.produtosAtivos} ativos</span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Margem Média</p>
                  <p className="text-3xl font-bold text-gray-900">{estatisticasGerais.margemMedia}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-600">+2.3% vs mês anterior</span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Estoque Total</p>
                  <p className="text-3xl font-bold text-gray-900">{estatisticasGerais.estoqueTotal}</p>
                </div>
                <Archive className="h-8 w-8 text-orange-500" />
              </div>
              <div className="mt-4 flex items-center text-sm">
                <AlertTriangle className="h-4 w-4 text-red-500 mr-1" />
                <span className="text-red-600">{estatisticasGerais.produtosBaixoEstoque} com baixo estoque</span>
              </div>
            </div>
          </div>
        </div>

        {/* Alertas */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Alertas e Ações Necessárias</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <AlertTriangle className="h-6 w-6 text-red-500 mr-3" />
                <h3 className="text-lg font-semibold text-red-800">Produtos com Baixo Estoque</h3>
              </div>
              <p className="text-red-700 mb-4">
                {estatisticasGerais.produtosBaixoEstoque} produtos estão com estoque abaixo do mínimo recomendado.
              </p>
              <Link
                href="/executivo/estoque"
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Ver Estoque
              </Link>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <AlertTriangle className="h-6 w-6 text-yellow-500 mr-3" />
                <h3 className="text-lg font-semibold text-yellow-800">Preços Desatualizados</h3>
              </div>
              <p className="text-yellow-700 mb-4">
                {estatisticasGerais.precosDesatualizados} produtos têm preços que não são atualizados há mais de 30 dias.
              </p>
              <Link
                href="/executivo/precos"
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Atualizar Preços
              </Link>
            </div>
          </div>
        </div>

        {/* Módulos */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Módulos Executivos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {modulos.map((modulo, index) => {
              const Icon = modulo.icone;
              return (
                <Link
                  key={index}
                  href={modulo.href}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  <div className={`bg-gradient-to-r ${modulo.cor} p-6 text-white`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Icon size={24} className="mr-3" />
                        <h3 className="text-xl font-bold">{modulo.nome}</h3>
                      </div>
                      <div className="opacity-75 group-hover:opacity-100 transition-opacity">
                        →
                      </div>
                    </div>
                    <p className="mt-2 text-white/90">{modulo.descricao}</p>
                  </div>

                  <div className="p-6">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{modulo.stats.total}</p>
                        <p className="text-sm text-gray-600">Total</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-green-600">
                          {(modulo.stats as any).ativos ||
                           (modulo.stats as any).atualizados ||
                           (modulo.stats as any).disponivel ||
                           (modulo.stats as any).ativas || 0}
                        </p>
                        <p className="text-sm text-gray-600">{modulo.labels.positive}</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-orange-600">
                          {(modulo.stats as any).inativos ||
                           (modulo.stats as any).pendentes ||
                           (modulo.stats as any).reservado ||
                           (modulo.stats as any).descontinuadas || 0}
                        </p>
                        <p className="text-sm text-gray-600">{modulo.labels.negative}</p>
                      </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
    </div>
    </ProtectedRoute>
  );
}
