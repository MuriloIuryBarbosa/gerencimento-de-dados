"use client";

import Link from "next/link";
import { useLanguage } from "../../components/LanguageContext";
import { ShoppingCart, FileText, ClipboardList, Package, Truck, BarChart3, Calendar, TrendingUp, AlertCircle } from 'lucide-react';

export default function Planejamento() {
  const { t } = useLanguage();

  const modulos = [
    {
      nome: t('orders'),
      href: '/ordem-compra',
      descricao: 'Gerenciar ordens de compra e aprovações',
      icone: ShoppingCart,
      cor: 'from-blue-500 to-blue-600',
      stats: { total: 156, pendentes: 23, aprovadas: 133 }
    },
    {
      nome: t('proformas'),
      href: '/proforma',
      descricao: 'Gerenciar proformas e cotações',
      icone: FileText,
      cor: 'from-green-500 to-green-600',
      stats: { total: 89, ativas: 67, expiradas: 22 }
    },
    {
      nome: t('requisitions'),
      href: '/requisicoes',
      descricao: 'Gerenciar requisições de materiais',
      icone: ClipboardList,
      cor: 'from-purple-500 to-purple-600',
      stats: { total: 234, pendentes: 45, aprovadas: 189 }
    },
    {
      nome: t('containers'),
      href: '/conteineres',
      descricao: 'Gerenciar programação de containers',
      icone: Package,
      cor: 'from-orange-500 to-orange-600',
      stats: { total: 78, programados: 56, emTransito: 22 }
    },
    {
      nome: t('followUp'),
      href: '/followup',
      descricao: 'Acompanhar logística e entregas',
      icone: Truck,
      cor: 'from-red-500 to-red-600',
      stats: { total: 145, noPrazo: 128, atrasadas: 17 }
    }
  ];

  // Estatísticas gerais do módulo planejamento
  const estatisticasGerais = {
    ordensPendentes: 23 + 5, // OCs pendentes de aprovação (23) + OCs com prazo estourado (5)
    containersSemana: 12,
    entregasAtrasadas: 17,
    eficienciaLogistica: 88.5,
    custoMedioContainer: 2850,
    tempoMedioEntrega: 28
  };

  return (
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
        {/* Estatísticas Gerais */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Indicadores de Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ordens Pendentes</p>
                  <p className="text-3xl font-bold text-gray-900">{estatisticasGerais.ordensPendentes}</p>
                </div>
                <ShoppingCart className="h-8 w-8 text-blue-500" />
              </div>
              <div className="mt-4 flex items-center text-sm">
                <AlertCircle className="h-4 w-4 text-orange-500 mr-1" />
                <span className="text-orange-600">Requer atenção</span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Eficiência Logística</p>
                  <p className="text-3xl font-bold text-gray-900">{estatisticasGerais.eficienciaLogistica}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-600">+5.2% vs mês anterior</span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Entregas Atrasadas</p>
                  <p className="text-3xl font-bold text-gray-900">{estatisticasGerais.entregasAtrasadas}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
              <div className="mt-4 flex items-center text-sm">
                <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
                <span className="text-red-600">Ação necessária</span>
              </div>
            </div>
          </div>
        </div>

        {/* Alertas e Próximas Ações */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Próximas Ações e Alertas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <Calendar className="h-6 w-6 text-blue-500 mr-3" />
                <h3 className="text-lg font-semibold text-blue-800">Containers da Semana</h3>
              </div>
              <p className="text-blue-700 mb-4">
                {estatisticasGerais.containersSemana} containers programados para esta semana.
              </p>
              <Link
                href="/conteineres"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Ver Programação
              </Link>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <AlertCircle className="h-6 w-6 text-orange-500 mr-3" />
                <h3 className="text-lg font-semibold text-orange-800">Ordens Pendentes</h3>
              </div>
              <p className="text-orange-700 mb-4">
                {estatisticasGerais.ordensPendentes} ordens de compra aguardando aprovação.
              </p>
              <Link
                href="/ordem-compra"
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Revisar Ordens
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
  );
}
