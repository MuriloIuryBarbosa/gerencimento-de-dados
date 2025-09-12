"use client";

import { useLanguage } from "@/components/LanguageContext";
import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";
import { ShoppingCart, FileText, ClipboardList, Package, Truck, BarChart3, Calendar, TrendingUp, AlertCircle, CheckCircle, Clock, DollarSign } from 'lucide-react';

interface PlanejamentoData {
  ordensCompra: {
    total: number;
    valorTotal: number;
    porStatus: Array<{ status: string; _count: { id: number } }>;
    pendentes: number;
  };
  requisicoes: {
    total: number;
    porStatus: Array<{ status: string; _count: { id: number } }>;
    pendentes: number;
  };
  proformas: {
    total: number;
    valorTotal: number;
    porStatus: Array<{ status: string; _count: { id: number } }>;
  };
  followUps: {
    total: number;
    porPrioridade: Array<{ prioridade: string; _count: { id: number } }>;
    vencendo: number;
  };
  estoque: {
    totalProdutos: number;
    quantidadeTotal: number;
    valorTotal: number;
  };
  indicadores: {
    ordensPendentes: number;
    eficienciaLogistica: number;
    custoMedioContainer: number;
    tempoMedioEntrega: number;
    movimentacoesRecentes: number;
  };
}

export default function Planejamento() {
  const { t } = useLanguage();
  const [planejamentoData, setPlanejamentoData] = useState<PlanejamentoData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlanejamentoData = async () => {
      try {
        const response = await fetch('/api/planejamento');
        if (response.ok) {
          const data = await response.json();
          setPlanejamentoData(data);
        }
      } catch (error) {
        console.error('Erro ao buscar dados do planejamento:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlanejamentoData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando dados do planejamento...</p>
        </div>
      </div>
    );
  }

  const modulos = [
    {
      nome: t('orders'),
      href: '/ordem-compra',
      descricao: 'Gerenciar ordens de compra e aprovações',
      icone: ShoppingCart,
      cor: 'from-blue-500 to-blue-600',
      stats: {
        total: planejamentoData?.ordensCompra.total || 0,
        pendentes: planejamentoData?.ordensCompra.pendentes || 0,
        aprovadas: planejamentoData?.ordensCompra.porStatus.find(s => s.status === 'Aprovada')?._count.id || 0
      }
    },
    {
      nome: t('proformas'),
      href: '/proforma',
      descricao: 'Gerenciar proformas e cotações',
      icone: FileText,
      cor: 'from-green-500 to-green-600',
      stats: {
        total: planejamentoData?.proformas.total || 0,
        ativas: planejamentoData?.proformas.porStatus.find(s => s.status === 'Ativa')?._count.id || 0,
        expiradas: planejamentoData?.proformas.porStatus.find(s => s.status === 'Expirada')?._count.id || 0
      }
    },
    {
      nome: t('requisitions'),
      href: '/requisicoes',
      descricao: 'Gerenciar requisições de materiais',
      icone: ClipboardList,
      cor: 'from-purple-500 to-purple-600',
      stats: {
        total: planejamentoData?.requisicoes.total || 0,
        pendentes: planejamentoData?.requisicoes.pendentes || 0,
        aprovadas: planejamentoData?.requisicoes.porStatus.find(s => s.status === 'Aprovada')?._count.id || 0
      }
    },
    {
      nome: t('containers'),
      href: '/conteineres',
      descricao: 'Gerenciar programação de containers',
      icone: Package,
      cor: 'from-orange-500 to-orange-600',
      stats: {
        total: planejamentoData?.indicadores.movimentacoesRecentes || 0,
        programados: Math.floor((planejamentoData?.indicadores.movimentacoesRecentes || 0) * 0.7),
        emTransito: Math.floor((planejamentoData?.indicadores.movimentacoesRecentes || 0) * 0.3)
      }
    },
    {
      nome: t('followUp'),
      href: '/followup',
      descricao: 'Acompanhar logística e entregas',
      icone: Truck,
      cor: 'from-red-500 to-red-600',
      stats: {
        total: planejamentoData?.followUps.total || 0,
        noPrazo: (planejamentoData?.followUps.total || 0) - (planejamentoData?.followUps.vencendo || 0),
        atrasadas: planejamentoData?.followUps.vencendo || 0
      }
    }
  ];

  // Estatísticas gerais do módulo planejamento
  const estatisticasGerais = {
    ordensPendentes: planejamentoData?.indicadores.ordensPendentes || 0,
    containersSemana: planejamentoData?.indicadores.movimentacoesRecentes || 0,
    entregasAtrasadas: planejamentoData?.followUps.vencendo || 0,
    eficienciaLogistica: planejamentoData?.indicadores.eficienciaLogistica || 0,
    custoMedioContainer: planejamentoData?.indicadores.custoMedioContainer || 0,
    tempoMedioEntrega: planejamentoData?.indicadores.tempoMedioEntrega || 0
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
                <h1 className="text-3xl font-bold text-white">Planejamento</h1>
                <p className="mt-1 text-blue-100">
                  Dashboard de planejamento com visão geral das operações
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
        {/* Cards de Métricas Principais */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Indicadores de Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-100">Ordens Pendentes</p>
                  <p className="text-3xl font-bold">{estatisticasGerais.ordensPendentes}</p>
                </div>
                <ShoppingCart className="h-8 w-8 text-blue-200" />
              </div>
              <div className="mt-4 flex items-center text-sm">
                <AlertCircle className="h-4 w-4 text-yellow-300 mr-1" />
                <span className="text-blue-100">Requer atenção</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-100">Eficiência Logística</p>
                  <p className="text-3xl font-bold">{estatisticasGerais.eficienciaLogistica}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-200" />
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-green-200 mr-1" />
                <span className="text-green-100">Performance</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-100">Produtos em Estoque</p>
                  <p className="text-3xl font-bold">{planejamentoData?.estoque.totalProdutos || 0}</p>
                </div>
                <Package className="h-8 w-8 text-purple-200" />
              </div>
              <div className="mt-4 flex items-center text-sm">
                <CheckCircle className="h-4 w-4 text-purple-200 mr-1" />
                <span className="text-purple-100">SKUs ativos</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-100">Valor Total Estoque</p>
                  <p className="text-2xl font-bold">R$ {(planejamentoData?.estoque.valorTotal || 0).toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-orange-200" />
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-orange-200 mr-1" />
                <span className="text-orange-100">Valor consolidado</span>
              </div>
            </div>
          </div>
        </div>

        {/* Alertas e Próximas Ações */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Alertas e Próximas Ações</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <Clock className="h-6 w-6 text-blue-500 mr-3" />
                <h3 className="text-lg font-semibold text-blue-800">Ordens Pendentes</h3>
              </div>
              <p className="text-blue-700 mb-4">
                {estatisticasGerais.ordensPendentes} ordens de compra aguardando aprovação.
              </p>
              <Link
                href="/ordem-compra"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors inline-flex items-center"
              >
                Revisar Ordens
                <AlertCircle className="h-4 w-4 ml-2" />
              </Link>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <AlertCircle className="h-6 w-6 text-orange-500 mr-3" />
                <h3 className="text-lg font-semibold text-orange-800">Follow-ups Vencendo</h3>
              </div>
              <p className="text-orange-700 mb-4">
                {planejamentoData?.followUps.vencendo || 0} follow-ups vencem nos próximos 7 dias.
              </p>
              <Link
                href="/followup"
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors inline-flex items-center"
              >
                Ver Follow-ups
                <Calendar className="h-4 w-4 ml-2" />
              </Link>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <TrendingUp className="h-6 w-6 text-green-500 mr-3" />
                <h3 className="text-lg font-semibold text-green-800">Movimentações Recentes</h3>
              </div>
              <p className="text-green-700 mb-4">
                {planejamentoData?.indicadores.movimentacoesRecentes || 0} movimentações de estoque nos últimos 30 dias.
              </p>
              <Link
                href="/executivo/estoque"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors inline-flex items-center"
              >
                Ver Estoque
                <Package className="h-4 w-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>

        {/* Métricas de Custo e Tempo */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Métricas Operacionais</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <TrendingUp className="h-6 w-6 text-green-500 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Custo Médio por Container</h3>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                R$ {estatisticasGerais.custoMedioContainer.toLocaleString()}
              </div>
              <p className="text-sm text-gray-600">Média dos últimos 30 dias</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <Calendar className="h-6 w-6 text-blue-500 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Tempo Médio de Entrega</h3>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {estatisticasGerais.tempoMedioEntrega} dias
              </div>
              <p className="text-sm text-gray-600">Da China ao Brasil</p>
            </div>
          </div>
        </div>

        {/* Módulos de Planejamento */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Módulos de Planejamento</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{modulo.stats.total}</p>
                        <p className="text-sm text-gray-600">Total</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-green-600">
                          {modulo.stats.pendentes || modulo.stats.ativas || modulo.stats.programados || modulo.stats.noPrazo}
                        </p>
                        <p className="text-sm text-gray-600">
                          {modulo.stats.pendentes ? 'Aprovadas' :
                           modulo.stats.ativas ? 'Ativas' :
                           modulo.stats.programados ? 'Programados' : 'No Prazo'}
                        </p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-orange-600">
                          {modulo.stats.aprovadas || modulo.stats.expiradas || modulo.stats.emTransito || modulo.stats.atrasadas}
                        </p>
                        <p className="text-sm text-gray-600">
                          {modulo.stats.aprovadas ? 'Pendentes' :
                           modulo.stats.expiradas ? 'Expiradas' :
                           modulo.stats.emTransito ? 'Em Trânsito' : 'Atrasadas'}
                        </p>
                      </div>
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
