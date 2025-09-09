"use client";

import Link from "next/link";
import { useState } from "react";

// Dados mockados para simulação
const mockProformas = [
  {
    id: "PF-2025-001",
    cliente: "Cliente ABC Ltda",
    dataEmissao: "2025-01-15",
    valorTotal: 25450.00,
    status: "Aprovada",
    validade: "2025-02-15",
    prioridade: "Alta",
    ordemCompra: "OC-2025-001"
  },
  {
    id: "PF-2025-002",
    cliente: "Empresa XYZ S.A.",
    dataEmissao: "2025-01-10",
    valorTotal: 18750.00,
    status: "Pendente",
    validade: "2025-01-30",
    prioridade: "Média",
    ordemCompra: "OC-2025-002"
  },
  {
    id: "PF-2025-003",
    cliente: "Comércio Geral Ltda",
    dataEmissao: "2025-01-08",
    valorTotal: 32300.00,
    status: "Expirada",
    validade: "2025-01-08",
    prioridade: "Baixa",
    ordemCompra: null
  },
  {
    id: "PF-2025-004",
    cliente: "Indústria Tec Ltda",
    dataEmissao: "2024-12-20",
    valorTotal: 55600.00,
    status: "Aprovada",
    validade: "2025-01-20",
    prioridade: "Alta",
    ordemCompra: "OC-2025-004"
  }
];

const metricas = [
  {
    titulo: "Total de Proformas",
    valor: "18",
    cor: "bg-purple-500",
    icone: "📄",
    descricao: "Todas as proformas no sistema"
  },
  {
    titulo: "Aprovadas",
    valor: "12",
    cor: "bg-green-500",
    icone: "✅",
    descricao: "PO→PI + PI→Importação"
  },
  {
    titulo: "Pendentes",
    valor: "4",
    cor: "bg-yellow-500",
    icone: "⏳",
    descricao: "Aguardando aprovação"
  },
  {
    titulo: "Expiradas",
    valor: "2",
    cor: "bg-red-500",
    icone: "⏰",
    descricao: "Lead time excedido"
  }
];

export default function ProformaControl() {
  const [proformas] = useState(mockProformas);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aprovada":
        return "bg-green-100 text-green-800";
      case "Pendente":
        return "bg-yellow-100 text-yellow-800";
      case "Expirada":
        return "bg-red-100 text-red-800";
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
              <h1 className="text-3xl font-bold text-gray-900">Proforma Control</h1>
              <p className="mt-1 text-sm text-gray-500">
                Gerencie todas as proformas do sistema
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

          {/* Botão Criar Nova Proforma */}
          <div className="flex justify-end">
            <Link
              href="/proforma/nova"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <svg className="-ml-1 mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Nova Proforma
            </Link>
          </div>
        </div>

        {/* Tabela de Proformas */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Lista de Proformas
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Visualize e gerencie todas as proformas registradas
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Proforma
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
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
                    Ordem Compra
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {proformas.map((proforma) => (
                  <tr key={proforma.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {proforma.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {proforma.cliente}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(proforma.dataEmissao).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      R$ {proforma.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(proforma.status)}`}>
                        {proforma.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {proforma.ordemCompra || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        href={`/proforma/${proforma.id}`}
                        className="text-purple-600 hover:text-purple-900 mr-4"
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
                <span className="font-medium">18</span> resultados
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
