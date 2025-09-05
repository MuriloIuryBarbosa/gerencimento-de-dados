"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

// Dados mockados conectados ao fluxo
const mockRequisicaoDetalhes = {
  "REQ-2025-001": {
    id: "REQ-2025-001",
    titulo: "Requisição de Materiais para Produção",
    solicitante: "João Silva",
    departamento: "Produção",
    dataSolicitacao: "2025-01-16",
    valorEstimado: 2650.00,
    status: "Aguardando Aprovação",
    prioridade: "Alta",
    ordemCompra: "OC-2025-001",
    proforma: null,
    descricao: "Materiais necessários para reposição de estoque crítico",
    itens: [
      { id: 1, descricao: "Tecido algodão cru", quantidade: 50, unidade: "metros", valorUnitario: 25.00, valorTotal: 1250.00 },
      { id: 2, descricao: "Fio de poliéster", quantidade: 30, unidade: "bobinas", valorUnitario: 46.67, valorTotal: 1400.00 }
    ],
    observacoes: "Materiais críticos para manter a produção em andamento",
    justificativa: "Estoque atual está abaixo do nível mínimo de segurança"
  },
  "REQ-2025-002": {
    id: "REQ-2025-002",
    titulo: "Compra de Equipamentos",
    solicitante: "Maria Santos",
    departamento: "Manutenção",
    dataSolicitacao: "2025-01-14",
    valorEstimado: 18750.00,
    status: "Pendente Proforma",
    prioridade: "Média",
    ordemCompra: "OC-2025-002",
    proforma: "PF-2025-002",
    descricao: "Equipamentos para manutenção preventiva",
    itens: [
      { id: 1, descricao: "Compressor de ar industrial", quantidade: 1, unidade: "unidade", valorUnitario: 12500.00, valorTotal: 12500.00 },
      { id: 2, descricao: "Kit de ferramentas elétricas", quantidade: 1, unidade: "kit", valorUnitario: 6250.00, valorTotal: 6250.00 }
    ],
    observacoes: "Equipamentos necessários para manutenção preventiva mensal",
    justificativa: "Reduzir tempo de parada para manutenção"
  }
};

export default function DetalhesRequisicao() {
  const params = useParams();
  const id = params.id as string;

  const [requisicao] = useState(mockRequisicaoDetalhes[id as keyof typeof mockRequisicaoDetalhes]);

  if (!requisicao) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Requisição não encontrada</h1>
          <Link
            href="/requisicoes"
            className="text-blue-600 hover:text-blue-800"
          >
            Voltar para Requisições
          </Link>
        </div>
      </div>
    );
  }

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

  const podeAprovar = () => {
    return requisicao.proforma !== null;
  };

  const calcularTotal = () => {
    return requisicao.itens.reduce((total, item) => total + item.valorTotal, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Detalhes da Requisição</h1>
              <p className="mt-1 text-sm text-gray-500">
                {requisicao.id} - {requisicao.titulo}
              </p>
            </div>
            <nav className="flex space-x-4">
              <Link
                href="/requisicoes"
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
                    Informações da Requisição
                  </h3>
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(requisicao.status)}`}>
                    {requisicao.status}
                  </span>
                </div>
              </div>
              <div className="px-6 py-4">
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Solicitante</dt>
                    <dd className="mt-1 text-sm text-gray-900">{requisicao.solicitante}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Departamento</dt>
                    <dd className="mt-1 text-sm text-gray-900">{requisicao.departamento}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Data da Solicitação</dt>
                    <dd className="mt-1 text-sm text-gray-900">{requisicao.dataSolicitacao}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Prioridade</dt>
                    <dd className="mt-1 text-sm text-gray-900">{requisicao.prioridade}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Valor Estimado</dt>
                    <dd className="mt-1 text-sm text-gray-900 font-semibold">
                      R$ {requisicao.valorEstimado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Ordem de Compra</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {requisicao.ordemCompra ? (
                        <Link
                          href={`/ordem-compra/${requisicao.ordemCompra}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          {requisicao.ordemCompra}
                        </Link>
                      ) : (
                        <span className="text-gray-500">Não vinculada</span>
                      )}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Descrição */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Descrição</h3>
              </div>
              <div className="px-6 py-4">
                <p className="text-sm text-gray-700">{requisicao.descricao}</p>
              </div>
            </div>

            {/* Itens da Requisição */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Itens Solicitados</h3>
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
                    {requisicao.itens.map((item) => (
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

            {/* Observações e Justificativa */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Observações e Justificativa</h3>
              </div>
              <div className="px-6 py-4 space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Observações</h4>
                  <p className="mt-1 text-sm text-gray-700">{requisicao.observacoes}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Justificativa</h4>
                  <p className="mt-1 text-sm text-gray-700">{requisicao.justificativa}</p>
                </div>
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
                {podeAprovar() && requisicao.status !== "Aprovada" && (
                  <button className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                    <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Aprovar Requisição
                  </button>
                )}
                {requisicao.status === "Aguardando Aprovação" && (
                  <button className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                    <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Rejeitar Requisição
                  </button>
                )}
                <button className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Exportar PDF
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
                  <dt className="text-sm font-medium text-gray-500">Ordem de Compra</dt>
                  <dd className="mt-1">
                    {requisicao.ordemCompra ? (
                      <Link
                        href={`/ordem-compra/${requisicao.ordemCompra}`}
                        className="text-blue-600 hover:text-blue-900 text-sm"
                      >
                        {requisicao.ordemCompra}
                      </Link>
                    ) : (
                      <span className="text-gray-500 text-sm">Não vinculada</span>
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Proforma</dt>
                  <dd className="mt-1">
                    {requisicao.proforma ? (
                      <Link
                        href={`/proforma/${requisicao.proforma}`}
                        className="text-purple-600 hover:text-purple-900 text-sm"
                      >
                        {requisicao.proforma}
                      </Link>
                    ) : (
                      <span className="text-gray-500 text-sm">Não vinculada</span>
                    )}
                  </dd>
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
                      <p className="text-sm font-medium text-gray-900">Ordem de Compra</p>
                      <p className="text-xs text-gray-500">Criada e aprovada</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        requisicao.proforma ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        <svg className={`w-4 h-4 ${
                          requisicao.proforma ? 'text-green-600' : 'text-gray-400'
                        }`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Proforma</p>
                      <p className="text-xs text-gray-500">
                        {requisicao.proforma ? 'Vinculada' : 'Pendente'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        requisicao.status === 'Aprovada' ? 'bg-green-100' :
                        requisicao.status === 'Rejeitada' ? 'bg-red-100' : 'bg-yellow-100'
                      }`}>
                        <svg className={`w-4 h-4 ${
                          requisicao.status === 'Aprovada' ? 'text-green-600' :
                          requisicao.status === 'Rejeitada' ? 'text-red-600' : 'text-yellow-600'
                        }`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Aprovação</p>
                      <p className="text-xs text-gray-500">{requisicao.status}</p>
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
