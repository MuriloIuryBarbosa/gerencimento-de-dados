"use client";

import Link from "next/link";
import { useState } from "react";

// Dados mockados conectados aos conteineres aprovados
const mockFollowUps = [
  {
    id: "FU-2025-001",
    conteiner: "CNT-2025-004",
    numeroConteiner: "HLCU4567890",
    cliente: "Indústria Tec Ltda",
    status: "Em Trânsito",
    localizacaoAtual: "Porto de Roterdã, Holanda",
    dataUltimaAtualizacao: "2025-01-18",
    dataEmbarque: "2025-01-28",
    dataChegadaPrevista: "2025-02-15",
    transportadora: "Hapag-Lloyd",
    navio: "Madrid Express",
    progresso: 35,
    proximasEtapas: [
      { etapa: "Embarque no navio", dataPrevista: "2025-01-28", status: "Pendente" },
      { etapa: "Chegada em Santos", dataPrevista: "2025-02-15", status: "Pendente" },
      { etapa: "Desembaraço aduaneiro", dataPrevista: "2025-02-18", status: "Pendente" }
    ],
    alertas: [
      { tipo: "info", mensagem: "Navio atrasado em 2 dias", data: "2025-01-18" }
    ]
  },
  {
    id: "FU-2025-002",
    conteiner: "CNT-2025-001",
    numeroConteiner: "MSCU1234567",
    cliente: "Cliente ABC Ltda",
    status: "Aguardando Embarque",
    localizacaoAtual: "Porto de Xangai, China",
    dataUltimaAtualizacao: "2025-01-17",
    dataEmbarque: "2025-02-01",
    dataChegadaPrevista: "2025-02-20",
    transportadora: "MSC",
    navio: "MSC Isabella",
    progresso: 15,
    proximasEtapas: [
      { etapa: "Embarque no navio", dataPrevista: "2025-02-01", status: "Pendente" },
      { etapa: "Chegada em Santos", dataPrevista: "2025-02-20", status: "Pendente" }
    ],
    alertas: []
  },
  {
    id: "FU-2025-003",
    conteiner: "CNT-2025-003",
    numeroConteiner: "COSU3456789",
    cliente: "Indústria Tec Ltda",
    status: "Desembaraçado",
    localizacaoAtual: "Porto de Santos, Brasil",
    dataUltimaAtualizacao: "2025-01-15",
    dataEmbarque: "2025-01-25",
    dataChegadaPrevista: "2025-02-10",
    dataChegadaReal: "2025-02-08",
    transportadora: "COSCO",
    navio: "COSCO Shipping Taurus",
    progresso: 100,
    proximasEtapas: [
      { etapa: "Em trânsito para cliente", dataPrevista: "2025-02-12", status: "Pendente" }
    ],
    alertas: [
      { tipo: "success", mensagem: "Conteiner chegou 2 dias adiantado", data: "2025-02-08" }
    ]
  },
  {
    id: "FU-2025-004",
    conteiner: "CNT-2025-005",
    numeroConteiner: "ONEU5678901",
    cliente: "Empresa XYZ S.A.",
    status: "Cancelado",
    localizacaoAtual: "N/A",
    dataUltimaAtualizacao: "2025-01-14",
    dataEmbarque: null,
    dataChegadaPrevista: null,
    transportadora: "ONE",
    navio: null,
    progresso: 0,
    proximasEtapas: [],
    alertas: [
      { tipo: "error", mensagem: "Follow up cancelado - conteiner rejeitado", data: "2025-01-14" }
    ]
  }
];

const metricas = [
  {
    titulo: "Total em Follow Up",
    valor: "12",
    cor: "bg-purple-500",
    icone: "📦"
  },
  {
    titulo: "Em Trânsito",
    valor: "8",
    cor: "bg-blue-500",
    icone: "🚢"
  },
  {
    titulo: "Aguardando Embarque",
    valor: "3",
    cor: "bg-yellow-500",
    icone: "⏳"
  },
  {
    titulo: "Desembaraçados",
    valor: "1",
    cor: "bg-green-500",
    icone: "✅"
  }
];

export default function FollowUp() {
  const [followUps] = useState(mockFollowUps);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Em Trânsito":
        return "bg-blue-100 text-blue-800";
      case "Aguardando Embarque":
        return "bg-yellow-100 text-yellow-800";
      case "Desembaraçado":
        return "bg-green-100 text-green-800";
      case "Cancelado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAlertaColor = (tipo: string) => {
    switch (tipo) {
      case "success":
        return "bg-green-100 text-green-800";
      case "error":
        return "bg-red-100 text-red-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "info":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getProgressColor = (progresso: number) => {
    if (progresso >= 80) return "bg-green-500";
    if (progresso >= 50) return "bg-blue-500";
    if (progresso >= 25) return "bg-yellow-500";
    return "bg-gray-500";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Follow Up</h1>
              <p className="mt-1 text-sm text-gray-500">
                Acompanhe o transporte e logística dos conteineres
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
        </div>

        {/* Tabela de Follow Up */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Lista de Follow Up
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Acompanhe o status logístico de todos os conteineres
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
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Localização
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progresso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Chegada Prevista
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {followUps.map((followUp) => (
                  <tr key={followUp.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {followUp.numeroConteiner}
                        </div>
                        <div className="text-sm text-gray-500">
                          {followUp.id}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {followUp.cliente}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(followUp.status)}`}>
                        {followUp.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {followUp.localizacaoAtual}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className={`h-2 rounded-full ${getProgressColor(followUp.progresso)}`}
                            style={{ width: `${followUp.progresso}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-500">{followUp.progresso}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {followUp.dataChegadaPrevista || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Link
                        href={`/follow-up/${followUp.id}`}
                        className="text-purple-600 hover:text-purple-900"
                      >
                        Ver Detalhes
                      </Link>
                      {followUp.alertas.length > 0 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          {followUp.alertas.length} alerta{followUp.alertas.length > 1 ? 's' : ''}
                        </span>
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
                <span className="font-medium">12</span> resultados
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

        {/* Alertas Recentes */}
        <div className="mt-6 bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Alertas Recentes</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {followUps
              .filter(fu => fu.alertas.length > 0)
              .map(fu =>
                fu.alertas.map((alerta, index) => (
                  <div key={`${fu.id}-${index}`} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAlertaColor(alerta.tipo)} mr-3`}>
                          {alerta.tipo.toUpperCase()}
                        </span>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {fu.numeroConteiner} - {fu.cliente}
                          </p>
                          <p className="text-sm text-gray-500">{alerta.mensagem}</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">{alerta.data}</span>
                    </div>
                  </div>
                ))
              )}
            {followUps.every(fu => fu.alertas.length === 0) && (
              <div className="px-6 py-4 text-center text-gray-500">
                Nenhum alerta recente
              </div>
            )}
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
                Fluxo de Follow Up
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  <strong>Regra:</strong> O Follow Up é iniciado automaticamente após a aprovação do conteiner no gerenciamento de conteineres.
                  Aqui acompanhamos todo o transporte internacional até o desembaraço aduaneiro.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
