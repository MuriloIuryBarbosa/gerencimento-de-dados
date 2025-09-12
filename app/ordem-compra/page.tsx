"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useLanguage } from "@/components/LanguageContext";

interface OrdemCompra {
  id: string;
  fornecedor: string;
  dataEmissao: string;
  valorTotal: number;
  status: string;
  prazoEntrega: string | null;
  prioridade: string;
  fornecedorRel?: {
    nome: string;
  };
}

const metricas = [
  {
    titulo: "Total de Ordens",
    valor: "24",
    cor: "bg-blue-500",
    icone: "📋",
    descricao: "Todas as ordens no sistema"
  },
  {
    titulo: "Pendentes Aprovação",
    valor: "8",
    cor: "bg-yellow-500",
    icone: "⏳",
    descricao: "OCs aguardando aprovação"
  },
  {
    titulo: "Pendentes Informações",
    valor: "3",
    cor: "bg-orange-500",
    icone: "📝",
    descricao: "OCs em rascunho"
  },
  {
    titulo: "Prazo Estourado",
    valor: "2",
    cor: "bg-red-500",
    icone: "⚠️",
    descricao: "OCs com prazo vencido"
  }
];

export default function OrdemCompra() {
  const { t } = useLanguage();
  const [ordens, setOrdens] = useState<OrdemCompra[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrdens = async () => {
      try {
        const response = await fetch('/api/ordens-compra');
        if (response.ok) {
          const data = await response.json();
          setOrdens(data);
        }
      } catch (error) {
        console.error('Erro ao buscar ordens de compra:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrdens();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aprovada":
        return "bg-green-100 text-green-800";
      case "Pendente Aprovação":
        return "bg-yellow-100 text-yellow-800";
      case "Pendente Informações":
        return "bg-orange-100 text-orange-800";
      case "Prazo Estourado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case "Alta":
        return "bg-red-100 text-red-800";
      case "Média":
        return "bg-yellow-100 text-yellow-800";
      case "Baixa":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t('orders')}</h1>
              <p className="mt-1 text-sm text-gray-500">
                {t('manageOrders')}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Métricas */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {metricas.map((metrica, index) => (
              <div key={index} className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-3">
                        <div className={`w-12 h-12 ${metrica.cor} rounded-xl flex items-center justify-center text-2xl shadow-lg`}>
                          {metrica.icone}
                        </div>
                        <div className="ml-4">
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            {metrica.titulo}
                          </dt>
                          <dd className="text-3xl font-bold text-gray-900 mt-1">
                            {metrica.valor}
                          </dd>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">
                        {metrica.descricao}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Botão Criar Nova Ordem */}
          <div className="flex justify-end">
            <Link
              href="/ordem-compra/nova"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="-ml-1 mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              {t('newPurchaseOrder')}
            </Link>
          </div>
        </div>

        {/* Tabela de Ordens */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {t('listOfOrders')}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {t('viewManageOrders')}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('order')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('supplier')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('issueDate')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('totalValue')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('status')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('priority')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ordens.map((ordem) => (
                  <tr key={ordem.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {ordem.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {ordem.fornecedor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(ordem.dataEmissao).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      R$ {ordem.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ordem.status)}`}>
                        {ordem.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPrioridadeColor(ordem.prioridade)}`}>
                        {ordem.prioridade}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        href={`/ordem-compra/${ordem.id}`}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        {t('viewDetails')}
                      </Link>
                      <button className="text-gray-600 hover:text-gray-900">
                        {t('edit')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Mostrando <span className="font-medium">1</span> a <span className="font-medium">4</span> de{' '}
                <span className="font-medium">24</span> {t('results')}
              </div>
              <div className="flex space-x-2">
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  {t('previous')}
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  {t('next')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
