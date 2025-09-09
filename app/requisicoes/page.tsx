"use client";

import Link from "next/link";
import { useState } from "react";

// Dados mockados conectados ao fluxo
const mockRequisicoes = [
  {
    id: "REQ-2025-001",
    titulo: "Requisição de Materiais para Produção",
    solicitante: "João Silva",
    departamento: "Produção",
    dataSolicitacao: "2025-01-16",
    valorEstimado: 2650.00,
    status: "Aguardando Aprovação",
    prioridade: "Alta",
    ordemCompra: "OC-2025-001",
    proforma: null, // Sem proforma vinculada
    descricao: "Materiais necessários para reposição de estoque crítico"
  },
  {
    id: "REQ-2025-002",
    titulo: "Compra de Equipamentos",
    solicitante: "Maria Santos",
    departamento: "Manutenção",
    dataSolicitacao: "2025-01-14",
    valorEstimado: 18750.00,
    status: "Pendente Proforma",
    prioridade: "Média",
    ordemCompra: "OC-2025-002",
    proforma: "PF-2025-002", // Proforma vinculada
    descricao: "Equipamentos para manutenção preventiva"
  },
  {
    id: "REQ-2025-003",
    titulo: "Materiais de Escritório",
    solicitante: "Pedro Costa",
    departamento: "Administrativo",
    dataSolicitacao: "2025-01-12",
    valorEstimado: 1250.00,
    status: "Aprovada",
    prioridade: "Baixa",
    ordemCompra: null,
    proforma: "PF-2025-003",
    descricao: "Material de consumo para escritório"
  },
  {
    id: "REQ-2025-004",
    titulo: "Peças de Reposição",
    solicitante: "Ana Oliveira",
    departamento: "Produção",
    dataSolicitacao: "2025-01-10",
    valorEstimado: 8900.00,
    status: "Rejeitada",
    prioridade: "Alta",
    ordemCompra: "OC-2025-004",
    proforma: null,
    descricao: "Peças críticas para linha de produção"
  }
];

const metricas = [
  {
    titulo: "Total de Requisições",
    valor: "32",
    cor: "bg-indigo-500",
    icone: "📋",
    descricao: "Documentos aguardando aprovação"
  },
  {
    titulo: "OC Pendente",
    valor: "12",
    cor: "bg-yellow-500",
    icone: "⏳",
    descricao: "Ordens de compra pendentes"
  },
  {
    titulo: "PO Pendente",
    valor: "8",
    cor: "bg-orange-500",
    icone: "📄",
    descricao: "Proformas aguardando dados"
  }
];

export default function Requisicoes() {
  const [requisicoes] = useState(mockRequisicoes);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aprovada":
        return "bg-green-100 text-green-800";
      case "Aguardando Aprovação":
        return "bg-yellow-100 text-yellow-800";
      case "Pendente Proforma":
        return "bg-orange-100 text-orange-800";
      case "Rejeitada":
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

  const podeAprovar = (requisicao: any) => {
    // Só pode aprovar se tiver proforma vinculada
    return requisicao.proforma !== null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Requisições</h1>
              <p className="mt-1 text-sm text-gray-500">
                Gerencie todas as requisições de compra da empresa
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Métricas */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
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

          {/* Botão Criar Nova Requisição */}
          <div className="flex justify-end">
            <Link
              href="/requisicoes/nova"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg className="-ml-1 mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Nova Requisição
            </Link>
          </div>
        </div>

        {/* Tabela de Requisições */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Lista de Requisições
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Visualize e gerencie todas as requisições de compra
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Requisição
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Solicitante
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Departamento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor Estimado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Proforma
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requisicoes.map((requisicao) => (
                  <tr key={requisicao.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {requisicao.id}
                        </div>
                        <div className="text-sm text-gray-500">
                          {requisicao.titulo}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {requisicao.solicitante}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {requisicao.departamento}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      R$ {requisicao.valorEstimado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(requisicao.status)}`}>
                        {requisicao.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {requisicao.proforma ? (
                        <Link
                          href={`/proforma/${requisicao.proforma}`}
                          className="text-purple-600 hover:text-purple-900"
                        >
                          {requisicao.proforma}
                        </Link>
                      ) : (
                        <span className="text-gray-400">Não vinculada</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Link
                        href={`/requisicoes/${requisicao.id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Ver Detalhes
                      </Link>
                      {podeAprovar(requisicao) && requisicao.status !== "Aprovada" && (
                        <button className="text-green-600 hover:text-green-900">
                          Aprovar
                        </button>
                      )}
                      {requisicao.status === "Aguardando Aprovação" && (
                        <button className="text-red-600 hover:text-red-900">
                          Rejeitar
                        </button>
                      )}
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
                <span className="font-medium">32</span> resultados
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

        {/* Informações sobre o fluxo */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Fluxo de Aprovação
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  <strong>Regra:</strong> Uma requisição só pode ser aprovada se estiver vinculada a uma proforma válida.
                  Ordens de compra aprovadas geram requisições que aguardam aprovação do gestor.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
