"use client";

import Link from "next/link";
import { useState } from "react";

// Dados mockados para simulação
const mockOrdens = [
  {
    id: "OC-2025-001",
    fornecedor: "Fornecedor ABC Ltda",
    dataEmissao: "2025-01-15",
    valorTotal: 15450.00,
    status: "Pendente Aprovação",
    prazoEntrega: "2025-02-15",
    prioridade: "Alta"
  },
  {
    id: "OC-2025-002",
    fornecedor: "Empresa XYZ S.A.",
    dataEmissao: "2025-01-10",
    valorTotal: 8750.00,
    status: "Aprovada",
    prazoEntrega: "2025-01-30",
    prioridade: "Média"
  },
  {
    id: "OC-2025-003",
    fornecedor: "Comércio Geral Ltda",
    dataEmissao: "2025-01-08",
    valorTotal: 22300.00,
    status: "Pendente Informações",
    prazoEntrega: "2025-02-08",
    prioridade: "Baixa"
  },
  {
    id: "OC-2025-004",
    fornecedor: "Indústria Tec Ltda",
    dataEmissao: "2024-12-20",
    valorTotal: 45600.00,
    status: "Prazo Estourado",
    prazoEntrega: "2025-01-20",
    prioridade: "Alta"
  }
];

const metricas = [
  {
    titulo: "Total de Ordens",
    valor: "24",
    cor: "bg-blue-500",
    icone: "📋"
  },
  {
    titulo: "Pendentes Aprovação",
    valor: "8",
    cor: "bg-yellow-500",
    icone: "⏳"
  },
  {
    titulo: "Pendentes Informações",
    valor: "3",
    cor: "bg-orange-500",
    icone: "📝"
  },
  {
    titulo: "Prazo Estourado",
    valor: "2",
    cor: "bg-red-500",
    icone: "⚠️"
  }
];

export default function OrdemCompra() {
  const [ordens] = useState(mockOrdens);

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
              <h1 className="text-3xl font-bold text-gray-900">Ordens de Compra</h1>
              <p className="mt-1 text-sm text-gray-500">
                Gerencie todas as ordens de compra da empresa
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
              <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className={`w-12 h-12 ${metrica.cor} rounded-lg flex items-center justify-center text-2xl`}>
                        {metrica.icone}
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          {metrica.titulo}
                        </dt>
                        <dd className="text-3xl font-semibold text-gray-900">
                          {metrica.valor}
                        </dd>
                      </dl>
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
              Nova Ordem de Compra
            </Link>
          </div>
        </div>

        {/* Tabela de Ordens */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Lista de Ordens de Compra
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Visualize e gerencie todas as ordens de compra registradas
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ordem
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fornecedor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data Emissão
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prioridade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
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
                        Ver Detalhes
                      </Link>
                      <button className="text-gray-600 hover:text-gray-900">
                        Editar
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
                <span className="font-medium">24</span> resultados
              </div>
              <div className="flex space-x-2">
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  Anterior
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  Próximo
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
