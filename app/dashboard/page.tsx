"use client";

import { useLanguage } from "../../components/LanguageContext";
import { useEffect, useState } from "react";

interface DashboardData {
  ordensCompra: {
    total: number;
    valorTotal: number;
    porStatus: Array<{ status: string; _count: { id: number } }>;
  };
  requisicoes: {
    total: number;
    porStatus: Array<{ status: string; _count: { id: number } }>;
  };
  inventario: {
    totalSkus: number;
    totalFornecedores: number;
  };
}

export default function Dashboard() {
  const { t } = useLanguage();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/dashboard');
        if (response.ok) {
          const data = await response.json();
          setDashboardData(data);
        }
      } catch (error) {
        console.error('Erro ao buscar dados do dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">{t('dashboard')}</h1>
            <p className="text-sm text-gray-500">{t('generalOverview')}</p>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded"></div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{t('purchaseOrders')}</dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {dashboardData?.ordensCompra.total || 0}
                      </dd>
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
                      <dt className="text-sm font-medium text-gray-500 truncate">{t('requests')}</dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {dashboardData?.requisicoes.total || 0}
                      </dd>
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
                      <dt className="text-sm font-medium text-gray-500 truncate">{t('skus')}</dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {dashboardData?.inventario.totalSkus || 0}
                      </dd>
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
                      <dt className="text-sm font-medium text-gray-500 truncate">{t('suppliers')}</dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {dashboardData?.inventario.totalFornecedores || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Resumo financeiro */}
          <div className="mt-8">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  {t('financialSummary')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {t('totalPurchaseOrdersValue')}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      R$ {dashboardData?.ordensCompra.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {t('averageOrderValue')}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      R$ {dashboardData?.ordensCompra.total ?
                        (dashboardData.ordensCompra.valorTotal / dashboardData.ordensCompra.total).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) :
                        '0,00'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
