"use client";

import Link from "next/link";
import { useState } from "react";

// Dados mockados conectados às proformas
const mockConteineres = [
  {
    id: "CNT-2025-001",
    numeroConteiner: "MSCU1234567",
    tipo: "20ft Standard",
    proforma: "PF-2025-001",
    cliente: "Cliente ABC Ltda",
    status: "Aprovado",
    dataCriacao: "2025-01-16",
    valorTotal: 12725.00,
    pesoBruto: 18500,
    volume: 28.5,
    origem: "China",
    destino: "Brasil",
    dataEmbarquePrevista: "2025-02-01",
    dataChegadaPrevista: "2025-02-20",
    transportadora: "MSC",
    observacoes: "Conteiner com materiais têxteis"
  },
  {
    id: "CNT-2025-002",
    numeroConteiner: "MAEU2345678",
    tipo: "40ft High Cube",
    proforma: "PF-2025-001",
    cliente: "Cliente ABC Ltda",
    status: "Pendente Aprovação",
    dataCriacao: "2025-01-16",
    valorTotal: 12725.00,
    pesoBruto: 24500,
    volume: 65.2,
    origem: "China",
    destino: "Brasil",
    dataEmbarquePrevista: "2025-02-05",
    dataChegadaPrevista: "2025-02-25",
    transportadora: "Maersk",
    observacoes: "Conteiner adicional para completar a carga"
  },
  {
    id: "CNT-2025-003",
    numeroConteiner: "COSU3456789",
    tipo: "20ft Standard",
    proforma: "PF-2025-004",
    cliente: "Indústria Tec Ltda",
    status: "Aprovado",
    dataCriacao: "2025-01-12",
    valorTotal: 27800.00,
    pesoBruto: 19200,
    volume: 32.1,
    origem: "Alemanha",
    destino: "Brasil",
    dataEmbarquePrevista: "2025-01-25",
    dataChegadaPrevista: "2025-02-10",
    transportadora: "COSCO",
    observacoes: "Equipamentos industriais"
  },
  {
    id: "CNT-2025-004",
    numeroConteiner: "HLCU4567890",
    tipo: "40ft Standard",
    proforma: "PF-2025-004",
    cliente: "Indústria Tec Ltda",
    status: "Em Follow Up",
    dataCriacao: "2025-01-12",
    valorTotal: 27800.00,
    pesoBruto: 26800,
    volume: 58.7,
    origem: "Alemanha",
    destino: "Brasil",
    dataEmbarquePrevista: "2025-01-28",
    dataChegadaPrevista: "2025-02-15",
    transportadora: "Hapag-Lloyd",
    observacoes: "Peças de reposição e acessórios"
  },
  {
    id: "CNT-2025-005",
    numeroConteiner: "ONEU5678901",
    tipo: "20ft Standard",
    proforma: "PF-2025-002",
    cliente: "Empresa XYZ S.A.",
    status: "Rejeitado",
    dataCriacao: "2025-01-14",
    valorTotal: 9375.00,
    pesoBruto: 15800,
    volume: 26.8,
    origem: "Estados Unidos",
    destino: "Brasil",
    dataEmbarquePrevista: "2025-02-10",
    dataChegadaPrevista: "2025-02-28",
    transportadora: "ONE",
    observacoes: "Rejeitado por incompatibilidade de carga"
  }
];

const metricas = [
  {
    titulo: "Total de Conteineres",
    valor: "24",
    cor: "bg-blue-500",
    icone: "🚢"
  },
  {
    titulo: "Aprovados",
    valor: "18",
    cor: "bg-green-500",
    icone: "✅"
  },
  {
    titulo: "Pendente Aprovação",
    valor: "4",
    cor: "bg-yellow-500",
    icone: "⏳"
  },
  {
    titulo: "Em Follow Up",
    valor: "2",
    cor: "bg-purple-500",
    icone: "📦"
  }
];

export default function Conteineres() {
  const [conteineres] = useState(mockConteineres);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aprovado":
        return "bg-green-100 text-green-800";
      case "Pendente Aprovação":
        return "bg-yellow-100 text-yellow-800";
      case "Em Follow Up":
        return "bg-purple-100 text-purple-800";
      case "Rejeitado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case "20ft Standard":
        return "bg-blue-100 text-blue-800";
      case "40ft Standard":
        return "bg-indigo-100 text-indigo-800";
      case "40ft High Cube":
        return "bg-cyan-100 text-cyan-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const podeAprovar = (status: string) => {
    return status === "Pendente Aprovação";
  };

  const podeRejeitar = (status: string) => {
    return status === "Pendente Aprovação";
  };

  const podeEnviarFollowUp = (status: string) => {
    return status === "Aprovado";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Conteineres</h1>
              <p className="mt-1 text-sm text-gray-500">
                Gerencie todos os conteineres do sistema
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

          {/* Botão Criar Novo Conteiner */}
          <div className="flex justify-end">
            <Link
              href="/conteineres/novo"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="-ml-1 mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Novo Conteiner
            </Link>
          </div>
        </div>

        {/* Tabela de Conteineres */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Lista de Conteineres
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Visualize e gerencie todos os conteineres registrados
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Conteiner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Proforma
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Embarque
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {conteineres.map((conteiner) => (
                  <tr key={conteiner.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {conteiner.numeroConteiner}
                        </div>
                        <div className="text-sm text-gray-500">
                          {conteiner.id}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTipoColor(conteiner.tipo)}`}>
                        {conteiner.tipo}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Link
                        href={`/proforma/${conteiner.proforma}`}
                        className="text-purple-600 hover:text-purple-900"
                      >
                        {conteiner.proforma}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {conteiner.cliente}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(conteiner.status)}`}>
                        {conteiner.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(conteiner.dataEmbarquePrevista).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Link
                        href={`/conteineres/${conteiner.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Ver Detalhes
                      </Link>
                      {podeAprovar(conteiner.status) && (
                        <button className="text-green-600 hover:text-green-900">
                          Aprovar
                        </button>
                      )}
                      {podeRejeitar(conteiner.status) && (
                        <button className="text-red-600 hover:text-red-900">
                          Rejeitar
                        </button>
                      )}
                      {podeEnviarFollowUp(conteiner.status) && (
                        <button className="text-purple-600 hover:text-purple-900">
                          Enviar p/ Follow Up
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
                Mostrando <span className="font-medium">1</span> a <span className="font-medium">5</span> de{' '}
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
                Fluxo de Gestão de Conteineres
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  <strong>Regra:</strong> Cada proforma pode ter múltiplos conteineres. Após aprovação no gerenciamento de conteineres,
                  eles são enviados automaticamente para o Follow Up para rastreamento logístico.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
