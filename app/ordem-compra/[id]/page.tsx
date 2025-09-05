"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

// Dados mockados para simulação
const mockOrdemDetalhes = {
  id: "OC-2025-001",
  fornecedor: {
    nome: "Fornecedor ABC Ltda",
    cnpj: "12.345.678/0001-90",
    endereco: "Rua das Flores, 123 - Centro, São Paulo - SP",
    telefone: "(11) 3456-7890",
    email: "contato@fornecedorabc.com.br"
  },
  dataEmissao: "2025-01-15",
  condicaoPagamento: "30 dias",
  prazoEntrega: "2025-02-15",
  status: "Pendente Aprovação",
  observacoes: "Ordem prioritária para reposição de estoque crítico.",
  itens: [
    {
      id: 1,
      descricao: "Parafuso M8 x 50mm Inox",
      quantidade: 500,
      unidade: "un",
      valorUnitario: 2.50,
      valorTotal: 1250.00
    },
    {
      id: 2,
      descricao: "Arruela M8 Inox",
      quantidade: 1000,
      unidade: "un",
      valorUnitario: 0.80,
      valorTotal: 800.00
    },
    {
      id: 3,
      descricao: "Porca M8 Inox",
      quantidade: 500,
      unidade: "un",
      valorUnitario: 1.20,
      valorTotal: 600.00
    }
  ],
  valorTotal: 2650.00,
  criadoPor: "João Silva",
  dataCriacao: "2025-01-15T10:30:00Z"
};

export default function OrdemCompraDetalhes() {
  const params = useParams();
  const ordemId = params.id as string;

  // Simulação - em produção, buscar dados da API
  const ordem = mockOrdemDetalhes;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aprovada":
        return "bg-green-100 text-green-800";
      case "Pendente Aprovação":
        return "bg-yellow-100 text-yellow-800";
      case "Pendente Informações":
        return "bg-orange-100 text-orange-800";
      case "Rejeitada":
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
              <h1 className="text-3xl font-bold text-gray-900">Detalhes da Ordem de Compra</h1>
              <p className="mt-1 text-sm text-gray-500">
                Ordem: {ordem.id}
              </p>
            </div>
            <div className="flex space-x-4">
              <Link
                href="/ordem-compra"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                ← Voltar
              </Link>
              <button className="text-gray-600 hover:text-gray-900 font-medium">
                Imprimir
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Status e Ações */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(ordem.status)}`}>
                {ordem.status}
              </span>
              <span className="text-sm text-gray-500">
                Criado em {new Date(ordem.dataCriacao).toLocaleDateString('pt-BR')} por {ordem.criadoPor}
              </span>
            </div>
            <div className="flex space-x-2">
              <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                Editar
              </button>
              <button className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                Aprovar
              </button>
            </div>
          </div>
        </div>

        {/* Informações Gerais */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Dados da Ordem */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Informações da Ordem
              </h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Número da Ordem</dt>
                  <dd className="text-sm text-gray-900">{ordem.id}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Data de Emissão</dt>
                  <dd className="text-sm text-gray-900">{new Date(ordem.dataEmissao).toLocaleDateString('pt-BR')}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Condição de Pagamento</dt>
                  <dd className="text-sm text-gray-900">{ordem.condicaoPagamento}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Prazo de Entrega</dt>
                  <dd className="text-sm text-gray-900">{new Date(ordem.prazoEntrega).toLocaleDateString('pt-BR')}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Dados do Fornecedor */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Dados do Fornecedor
              </h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Nome</dt>
                  <dd className="text-sm text-gray-900">{ordem.fornecedor.nome}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">CNPJ</dt>
                  <dd className="text-sm text-gray-900">{ordem.fornecedor.cnpj}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Telefone</dt>
                  <dd className="text-sm text-gray-900">{ordem.fornecedor.telefone}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="text-sm text-gray-900">{ordem.fornecedor.email}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Endereço */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Endereço de Entrega
              </h3>
              <p className="text-sm text-gray-900">
                {ordem.fornecedor.endereco}
              </p>
            </div>
          </div>
        </div>

        {/* Itens da Ordem */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Itens da Ordem
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descrição
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Qtd
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Un
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
                  {ordem.itens.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.descricao}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.quantidade}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.unidade}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        R$ {item.valorUnitario.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        R$ {item.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                      Total Geral:
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      R$ {ordem.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Observações */}
        {ordem.observacoes && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Observações
              </h3>
              <p className="text-sm text-gray-900">
                {ordem.observacoes}
              </p>
            </div>
          </div>
        )}

        {/* Ações */}
        <div className="mt-6 flex justify-end space-x-4">
          <Link
            href="/ordem-compra"
            className="px-6 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Voltar para Lista
          </Link>
          <button className="px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700">
            Criar Requisição
          </button>
          <button className="px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
            Aprovar Ordem
          </button>
        </div>
      </main>
    </div>
  );
}
