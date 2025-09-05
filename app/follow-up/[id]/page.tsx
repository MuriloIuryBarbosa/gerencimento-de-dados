"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

// Dados mockados conectados aos conteineres
const mockFollowUpDetalhes = {
  "FU-2025-001": {
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
    rota: [
      { local: "Porto de Xangai, China", data: "2025-01-25", status: "Concluído", tipo: "Embarque" },
      { local: "Canal de Suez, Egito", data: "2025-02-02", status: "Pendente", tipo: "Transito" },
      { local: "Porto de Roterdã, Holanda", data: "2025-02-08", status: "Atual", tipo: "Escala" },
      { local: "Porto de Santos, Brasil", data: "2025-02-15", status: "Pendente", tipo: "Destino" }
    ],
    proximasEtapas: [
      { etapa: "Passagem pelo Canal de Suez", dataPrevista: "2025-02-02", status: "Pendente" },
      { etapa: "Chegada em Roterdã", dataPrevista: "2025-02-08", status: "Pendente" },
      { etapa: "Chegada em Santos", dataPrevista: "2025-02-15", status: "Pendente" },
      { etapa: "Desembaraço aduaneiro", dataPrevista: "2025-02-18", status: "Pendente" }
    ],
    alertas: [
      { tipo: "info", mensagem: "Navio Madrid Express atrasado em 2 dias", data: "2025-01-18", prioridade: "Média" },
      { tipo: "warning", mensagem: "Possível congestionamento no Canal de Suez", data: "2025-01-16", prioridade: "Alta" }
    ],
    documentos: [
      { tipo: "BL (Bill of Lading)", numero: "HLCU-BL-2025-001", status: "Recebido", data: "2025-01-25" },
      { tipo: "Commercial Invoice", numero: "CI-004", status: "Recebido", data: "2025-01-20" },
      { tipo: "Packing List", numero: "PL-004", status: "Recebido", data: "2025-01-20" },
      { tipo: "Certificado de Origem", numero: "CO-004", status: "Pendente", data: null }
    ],
    historico: [
      { data: "2025-01-28", evento: "Conteiner embarcado no navio Madrid Express", local: "Xangai, China", tipo: "Embarque" },
      { data: "2025-01-25", evento: "Booking confirmado", local: "Xangai, China", tipo: "Documentação" },
      { data: "2025-01-20", evento: "Documentos comerciais preparados", local: "São Paulo, Brasil", tipo: "Documentação" },
      { data: "2025-01-18", evento: "Follow Up iniciado", local: "São Paulo, Brasil", tipo: "Sistema" }
    ]
  },
  "FU-2025-002": {
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
    rota: [
      { local: "Porto de Xangai, China", data: "2025-02-01", status: "Pendente", tipo: "Embarque" },
      { local: "Porto de Santos, Brasil", data: "2025-02-20", status: "Pendente", tipo: "Destino" }
    ],
    proximasEtapas: [
      { etapa: "Embarque no navio MSC Isabella", dataPrevista: "2025-02-01", status: "Pendente" },
      { etapa: "Chegada em Santos", dataPrevista: "2025-02-20", status: "Pendente" }
    ],
    alertas: [],
    documentos: [
      { tipo: "BL (Bill of Lading)", numero: "MSC-BL-2025-001", status: "Pendente", data: null },
      { tipo: "Commercial Invoice", numero: "CI-001", status: "Recebido", data: "2025-01-16" },
      { tipo: "Packing List", numero: "PL-001", status: "Recebido", data: "2025-01-16" }
    ],
    historico: [
      { data: "2025-01-17", evento: "Documentos enviados para transportadora", local: "São Paulo, Brasil", tipo: "Documentação" },
      { data: "2025-01-16", evento: "Follow Up iniciado", local: "São Paulo, Brasil", tipo: "Sistema" }
    ]
  }
};

export default function DetalhesFollowUp() {
  const params = useParams();
  const id = params.id as string;

  const [followUp] = useState(mockFollowUpDetalhes[id as keyof typeof mockFollowUpDetalhes]);

  if (!followUp) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Follow Up não encontrado</h1>
          <Link
            href="/follow-up"
            className="text-blue-600 hover:text-blue-800"
          >
            Voltar para Follow Up
          </Link>
        </div>
      </div>
    );
  }

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

  const getRotaStatusColor = (status: string) => {
    switch (status) {
      case "Concluído":
        return "bg-green-500";
      case "Atual":
        return "bg-blue-500";
      case "Pendente":
        return "bg-gray-300";
      default:
        return "bg-gray-300";
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
              <h1 className="text-3xl font-bold text-gray-900">Detalhes do Follow Up</h1>
              <p className="mt-1 text-sm text-gray-500">
                {followUp.numeroConteiner} - {followUp.id}
              </p>
            </div>
            <nav className="flex space-x-4">
              <Link
                href="/follow-up"
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
                    Informações do Follow Up
                  </h3>
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(followUp.status)}`}>
                    {followUp.status}
                  </span>
                </div>
              </div>
              <div className="px-6 py-4">
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Número do Conteiner</dt>
                    <dd className="mt-1 text-sm text-gray-900 font-mono">{followUp.numeroConteiner}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Cliente</dt>
                    <dd className="mt-1 text-sm text-gray-900">{followUp.cliente}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Transportadora</dt>
                    <dd className="mt-1 text-sm text-gray-900">{followUp.transportadora}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Navio</dt>
                    <dd className="mt-1 text-sm text-gray-900">{followUp.navio}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Localização Atual</dt>
                    <dd className="mt-1 text-sm text-gray-900">{followUp.localizacaoAtual}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Última Atualização</dt>
                    <dd className="mt-1 text-sm text-gray-900">{followUp.dataUltimaAtualizacao}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Data de Embarque</dt>
                    <dd className="mt-1 text-sm text-gray-900">{followUp.dataEmbarque}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Chegada Prevista</dt>
                    <dd className="mt-1 text-sm text-gray-900">{followUp.dataChegadaPrevista}</dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Progresso da Rota */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Progresso da Rota</h3>
                  <span className="text-sm text-gray-500">{followUp.progresso}% concluído</span>
                </div>
              </div>
              <div className="px-6 py-4">
                <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                  <div
                    className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${followUp.progresso}%` }}
                  ></div>
                </div>
                <div className="space-y-3">
                  {followUp.rota.map((ponto, index) => (
                    <div key={index} className="flex items-center">
                      <div className={`w-4 h-4 rounded-full ${getRotaStatusColor(ponto.status)} mr-3 flex-shrink-0`}></div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-900">{ponto.local}</span>
                          <span className="text-sm text-gray-500">{ponto.data}</span>
                        </div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ponto.status)} mt-1`}>
                          {ponto.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Próximas Etapas */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Próximas Etapas</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {followUp.proximasEtapas.map((etapa, index) => (
                  <div key={index} className="px-6 py-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{etapa.etapa}</h4>
                        <p className="text-sm text-gray-500">Previsto: {etapa.dataPrevista}</p>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(etapa.status)}`}>
                        {etapa.status}
                      </span>
                    </div>
                  </div>
                ))}
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
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {followUp.documentos.map((doc, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {doc.tipo}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                          {doc.numero}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDocumentoStatusColor(doc.status)}`}>
                            {doc.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {doc.data || "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Histórico */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Histórico de Eventos</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {followUp.historico.map((evento, index) => (
                  <div key={index} className="px-6 py-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{evento.evento}</p>
                        <p className="text-sm text-gray-500">{evento.local}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-900">{evento.data}</p>
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                          {evento.tipo}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar com Alertas e Vinculações */}
          <div className="space-y-6">
            {/* Alertas */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Alertas</h3>
              </div>
              <div className="px-6 py-4">
                {followUp.alertas.length > 0 ? (
                  <div className="space-y-3">
                    {followUp.alertas.map((alerta, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex items-start">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAlertaColor(alerta.tipo)} mr-3`}>
                            {alerta.tipo.toUpperCase()}
                          </span>
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">{alerta.mensagem}</p>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-xs text-gray-500">{alerta.data}</span>
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPrioridadeColor(alerta.prioridade)}`}>
                                {alerta.prioridade}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center">Nenhum alerta ativo</p>
                )}
              </div>
            </div>

            {/* Vinculações */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Vinculações</h3>
              </div>
              <div className="px-6 py-4 space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Conteiner</dt>
                  <dd className="mt-1">
                    <Link
                      href={`/conteineres/${followUp.conteiner}`}
                      className="text-blue-600 hover:text-blue-900 text-sm"
                    >
                      {followUp.numeroConteiner}
                    </Link>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Cliente</dt>
                  <dd className="mt-1 text-sm text-gray-900">{followUp.cliente}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Transportadora</dt>
                  <dd className="mt-1 text-sm text-gray-900">{followUp.transportadora}</dd>
                </div>
              </div>
            </div>

            {/* Ações */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Ações</h3>
              </div>
              <div className="px-6 py-4 space-y-3">
                <button className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Atualizar Status
                </button>
                <button className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Enviar Notificação
                </button>
                <button className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Exportar Relatório
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
