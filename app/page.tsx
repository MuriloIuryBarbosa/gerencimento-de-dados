"use client";

import { useLanguage } from "../components/LanguageContext";

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">{t('dashboard')}</h1>
            <p className="text-sm text-gray-500">{t('generalOverview')}</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Métricas Gerais */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded"></div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{t('totalSkus')}</dt>
                    <dd className="text-lg font-medium text-gray-900">247</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded"></div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{t('activeOrders')}</dt>
                    <dd className="text-lg font-medium text-gray-900">32</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded"></div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{t('pendingRequests')}</dt>
                    <dd className="text-lg font-medium text-gray-900">12</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded"></div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{t('stockValue')}</dt>
                    <dd className="text-lg font-medium text-gray-900">R$ 1.2M</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Módulos do Sistema */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Módulos do Sistema</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Módulo Planejamento */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-2xl">
                    📊
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Planejamento</h3>
                  <p className="text-sm text-gray-500">Gestão de ordens, proformas e logística</p>
                </div>
              </div>
              <div className="space-y-2">
                <a href="/ordem-compra" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                  📋 Ordens de Compra
                </a>
                <a href="/proforma" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                  📄 Proformas
                </a>
                <a href="/requisicoes" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                  📝 Requisições
                </a>
                <a href="/conteineres" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                  📦 Conteineres
                </a>
                <a href="/follow-up" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                  🚛 Follow Up
                </a>
              </div>
            </div>

            {/* Módulo Executivo */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-2xl">
                    💼
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Executivo</h3>
                  <p className="text-sm text-gray-500">Gestão de produtos, preços e operações</p>
                </div>
              </div>
              <div className="space-y-2">
                <a href="/executivo/skus" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                  🏷️ Gestão de SKUs
                </a>
                <a href="/executivo/precos" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                  💰 Gestão de Preços
                </a>
                <a href="/executivo/estoque" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                  📦 Controle de Estoque
                </a>
                <a href="/executivo/cores" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                  🎨 Controle de Cores
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Atividades Recentes */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Atividades Recentes</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  📋
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">Nova ordem de compra criada - OC-2025-001</p>
                <p className="text-xs text-gray-500">Há 2 horas</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  ✅
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">Requisição aprovada - REQ-2025-001</p>
                <p className="text-xs text-gray-500">Há 4 horas</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  ⚠️
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">Alerta: Estoque baixo em 3 produtos</p>
                <p className="text-xs text-gray-500">Há 6 horas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dicas do Sistema */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">💡 Dicas do Sistema</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>• Use o menu lateral para navegar entre os módulos</p>
                <p>• O módulo Planejamento contém todas as funcionalidades de gestão de pedidos</p>
                <p>• O módulo Executivo oferece controle sobre produtos e operações</p>
                <p>• Configure suas preferências no módulo Configurações</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
