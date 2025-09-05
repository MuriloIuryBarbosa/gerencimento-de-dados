"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

// Dados mockados conectados ao fluxo
const mockConteinerDetalhes = {
  "CNT-2025-001": {
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
    navio: "MSC Isabella",
    bookingNumber: "MSC-BK-2025-001",
    observacoes: "Conteiner com materiais têxteis",
    itens: [
      { id: 1, descricao: "Tecido algodão cru", quantidade: 500, unidade: "metros", valorUnitario: 12.50, valorTotal: 6250.00 },
      { id: 2, descricao: "Fio de poliéster", quantidade: 200, unidade: "bobinas", valorUnitario: 32.375, valorTotal: 6475.00 }
    ],
    documentos: [
      { tipo: "Booking Confirmation", numero: "BK-001", data: "2025-01-16", status: "Recebido" },
      { tipo: "Commercial Invoice", numero: "CI-001", data: "2025-01-16", status: "Pendente" },
      { tipo: "Packing List", numero: "PL-001", data: "2025-01-16", status: "Recebido" }
    ]
  },
  "CNT-2025-002": {
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
    navio: "Maersk Eindhoven",
    bookingNumber: "MSK-BK-2025-002",
    observacoes: "Conteiner adicional para completar a carga",
    itens: [
      { id: 1, descricao: "Tecido sintético misto", quantidade: 800, unidade: "metros", valorUnitario: 15.90625, valorTotal: 12725.00 }
    ],
    documentos: [
      { tipo: "Booking Confirmation", numero: "BK-002", data: "2025-01-16", status: "Recebido" }
    ]
  }
};

export default function DetalhesConteiner() {
  const params = useParams();
  const id = params.id as string;

  const [conteiner] = useState(mockConteinerDetalhes[id as keyof typeof mockConteinerDetalhes]);

  if (!conteiner) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Conteiner não encontrado</h1>
          <Link
            href="/conteineres"
            className="text-blue-600 hover:text-blue-800"
          >
            Voltar para Conteineres
          </Link>
        </div>
      </div>
    );
  }

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

  const getDocumentoStatusColor = (status: string) => {
    switch (status) {
      case "Recebido":
        return "bg-green-100 text-green-800";
      case "Pendente":
        return "bg-yellow-100 text-yellow-800";
      case "Em Análise":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const podeAprovar = () => {
    return conteiner.status === "Pendente Aprovação";
  };

  const podeRejeitar = () => {
    return conteiner.status === "Pendente Aprovação";
  };

  const podeEnviarFollowUp = () => {
    return conteiner.status === "Aprovado";
  };

  const calcularTotal = () => {
    return conteiner.itens.reduce((total, item) => total + item.valorTotal, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Detalhes do Conteiner</h1>
              <p className="mt-1 text-sm text-gray-500">
                {conteiner.numeroConteiner} - {conteiner.id}
              </p>
            </div>
            <nav className="flex space-x-4">
              <Link
                href="/conteineres"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                ← Voltar
              </Link>
              <Link
                href="/dashboard"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Dashboard
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informações Principais */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status e Informações Básicas */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">
                    Informações do Conteiner
                  </h3>
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(conteiner.status)}`}>
                    {conteiner.status}
                  </span>
                </div>
              </div>
              <div className="px-6 py-4">
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Número do Conteiner</dt>
                    <dd className="mt-1 text-sm text-gray-900 font-mono">{conteiner.numeroConteiner}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Tipo</dt>
                    <dd className="mt-1 text-sm text-gray-900">{conteiner.tipo}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Cliente</dt>
                    <dd className="mt-1 text-sm text-gray-900">{conteiner.cliente}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Proforma</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      <Link
                        href={`/proforma/${conteiner.proforma}`}
                        className="text-purple-600 hover:text-purple-900"
                      >
                        {conteiner.proforma}
                      </Link>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Valor Total</dt>
                    <dd className="mt-1 text-sm text-gray-900 font-semibold">
                      R$ {conteiner.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Peso Bruto</dt>
                    <dd className="mt-1 text-sm text-gray-900">{conteiner.pesoBruto.toLocaleString('pt-BR')} kg</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Volume</dt>
                    <dd className="mt-1 text-sm text-gray-900">{conteiner.volume.toLocaleString('pt-BR')} m³</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Data de Criação</dt>
                    <dd className="mt-1 text-sm text-gray-900">{conteiner.dataCriacao}</dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Informações de Transporte */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Informações de Transporte</h3>
              </div>
              <div className="px-6 py-4">
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Transportadora</dt>
                    <dd className="mt-1 text-sm text-gray-900">{conteiner.transportadora}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Navio</dt>
                    <dd className="mt-1 text-sm text-gray-900">{conteiner.navio}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Booking Number</dt>
                    <dd className="mt-1 text-sm text-gray-900 font-mono">{conteiner.bookingNumber}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Origem → Destino</dt>
                    <dd className="mt-1 text-sm text-gray-900">{conteiner.origem} → {conteiner.destino}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Embarque Previsto</dt>
                    <dd className="mt-1 text-sm text-gray-900">{conteiner.dataEmbarquePrevista}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Chegada Prevista</dt>
                    <dd className="mt-1 text-sm text-gray-900">{conteiner.dataChegadaPrevista}</dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Itens do Conteiner */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Itens do Conteiner</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Descrição
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Qtd
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Valor Unit.
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Valor Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {conteiner.itens.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.descricao}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.quantidade} {item.unidade}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          R$ {item.valorUnitario.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                          R$ {item.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                        Total:
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                        R$ {calcularTotal().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Documentos */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Documentos</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Número
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {conteiner.documentos.map((doc, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {doc.tipo}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                          {doc.numero}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {doc.data}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDocumentoStatusColor(doc.status)}`}>
                            {doc.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Observações */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Observações</h3>
              </div>
              <div className="px-6 py-4">
                <p className="text-sm text-gray-700">{conteiner.observacoes}</p>
              </div>
            </div>
          </div>

          {/* Sidebar com Ações e Vinculações */}
          <div className="space-y-6">
            {/* Ações */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Ações</h3>
              </div>
              <div className="px-6 py-4 space-y-3">
                {podeAprovar() && (
                  <button className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                    <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Aprovar Conteiner
                  </button>
                )}
                {podeRejeitar() && (
                  <button className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                    <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Rejeitar Conteiner
                  </button>
                )}
                {podeEnviarFollowUp() && (
                  <button className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                    <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Enviar para Follow Up
                  </button>
                )}
                <button className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Exportar Documentos
                </button>
              </div>
            </div>

            {/* Vinculações */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Vinculações</h3>
              </div>
              <div className="px-6 py-4 space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Proforma</dt>
                  <dd className="mt-1">
                    <Link
                      href={`/proforma/${conteiner.proforma}`}
                      className="text-purple-600 hover:text-purple-900 text-sm"
                    >
                      {conteiner.proforma}
                    </Link>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Cliente</dt>
                  <dd className="mt-1 text-sm text-gray-900">{conteiner.cliente}</dd>
                </div>
              </div>
            </div>

            {/* Status do Fluxo */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Status do Fluxo</h3>
              </div>
              <div className="px-6 py-4">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Proforma</p>
                      <p className="text-xs text-gray-500">Aprovada</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        conteiner.status === 'Aprovado' ? 'bg-green-100' :
                        conteiner.status === 'Rejeitado' ? 'bg-red-100' : 'bg-yellow-100'
                      }`}>
                        <svg className={`w-4 h-4 ${
                          conteiner.status === 'Aprovado' ? 'text-green-600' :
                          conteiner.status === 'Rejeitado' ? 'text-red-600' : 'text-yellow-600'
                        }`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Gestão de Conteiner</p>
                      <p className="text-xs text-gray-500">{conteiner.status}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        conteiner.status === 'Em Follow Up' ? 'bg-purple-100' : 'bg-gray-100'
                      }`}>
                        <svg className={`w-4 h-4 ${
                          conteiner.status === 'Em Follow Up' ? 'text-purple-600' : 'text-gray-400'
                        }`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Follow Up</p>
                      <p className="text-xs text-gray-500">
                        {conteiner.status === 'Em Follow Up' ? 'Ativo' : 'Pendente'}
                      </p>
                    </div>
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
