"use client";

import Link from "next/link";
import { useState } from "react";

// Dados mockados para SKUs
const mockSKUs = [
  {
    id: "SKU-2025-001",
    nome: "Algodão Premium Branco",
    categoria: "Tecidos",
    fornecedor: "Fornecedor A",
    precoCusto: 45.00,
    precoVenda: 75.00,
    estoqueAtual: 1250,
    estoqueMinimo: 500,
    unidade: "metros",
    status: "Ativo",
    dataCadastro: "2025-01-15",
    descricao: "Tecido de algodão 100% premium, ideal para confecção"
  },
  {
    id: "SKU-2025-002",
    nome: "Poliéster Azul Marinho",
    categoria: "Tecidos",
    fornecedor: "Fornecedor B",
    precoCusto: 32.00,
    precoVenda: 58.00,
    estoqueAtual: 890,
    estoqueMinimo: 300,
    unidade: "metros",
    status: "Ativo",
    dataCadastro: "2025-01-12",
    descricao: "Tecido de poliéster resistente, cor azul marinho"
  },
  {
    id: "SKU-2025-003",
    nome: "Linho Natural",
    categoria: "Tecidos",
    fornecedor: "Fornecedor C",
    precoCusto: 85.00,
    precoVenda: 145.00,
    estoqueAtual: 245,
    estoqueMinimo: 100,
    unidade: "metros",
    status: "Baixo Estoque",
    dataCadastro: "2025-01-10",
    descricao: "Tecido de linho natural premium"
  },
  {
    id: "SKU-2025-004",
    nome: "Seda Vermelha",
    categoria: "Tecidos Premium",
    fornecedor: "Fornecedor D",
    precoCusto: 120.00,
    precoVenda: 220.00,
    estoqueAtual: 0,
    estoqueMinimo: 50,
    unidade: "metros",
    status: "Fora de Estoque",
    dataCadastro: "2025-01-08",
    descricao: "Tecido de seda pura, cor vermelha vibrante"
  }
];

const metricas = [
  {
    titulo: "Total de SKUs",
    valor: "247",
    cor: "bg-blue-500",
    icone: "📦"
  },
  {
    titulo: "SKUs Ativos",
    valor: "189",
    cor: "bg-green-500",
    icone: "✅"
  },
  {
    titulo: "Baixo Estoque",
    valor: "23",
    cor: "bg-yellow-500",
    icone: "⚠️"
  },
  {
    titulo: "Fora de Estoque",
    valor: "8",
    cor: "bg-red-500",
    icone: "❌"
  }
];

export default function GestaoSKUs() {
  const [skus] = useState(mockSKUs);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativo":
        return "bg-green-100 text-green-800";
      case "Baixo Estoque":
        return "bg-yellow-100 text-yellow-800";
      case "Fora de Estoque":
        return "bg-red-100 text-red-800";
      case "Inativo":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getEstoqueStatus = (atual: number, minimo: number) => {
    if (atual === 0) return "Fora de Estoque";
    if (atual <= minimo) return "Baixo Estoque";
    return "Ativo";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestão de SKUs</h1>
              <p className="mt-1 text-sm text-gray-500">
                Controle completo dos produtos e materiais
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

          {/* Botão Criar Novo SKU */}
          <div className="flex justify-end">
            <Link
              href="/executivo/skus/novo"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg className="-ml-1 mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Novo SKU
            </Link>
          </div>
        </div>

        {/* Tabela de SKUs */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Lista de SKUs
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Visualize e gerencie todos os SKUs cadastrados
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preço Venda
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estoque
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {skus.map((sku) => (
                  <tr key={sku.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {sku.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {sku.nome}
                        </div>
                        <div className="text-sm text-gray-500">
                          {sku.fornecedor}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sku.categoria}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      R$ {sku.precoVenda.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sku.estoqueAtual} {sku.unidade}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(getEstoqueStatus(sku.estoqueAtual, sku.estoqueMinimo))}`}>
                        {getEstoqueStatus(sku.estoqueAtual, sku.estoqueMinimo)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Link
                        href={`/executivo/skus/${sku.id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Ver Detalhes
                      </Link>
                      <button className="text-blue-600 hover:text-blue-900">
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
                <span className="font-medium">247</span> resultados
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

        {/* Filtros e Busca */}
        <div className="mt-6 bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Filtros e Busca</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buscar SKU
              </label>
              <input
                type="text"
                placeholder="Digite o nome ou código..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoria
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                <option value="">Todas as categorias</option>
                <option value="tecidos">Tecidos</option>
                <option value="premium">Tecidos Premium</option>
                <option value="acessorios">Acessórios</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                <option value="">Todos os status</option>
                <option value="ativo">Ativo</option>
                <option value="baixo-estoque">Baixo Estoque</option>
                <option value="fora-estoque">Fora de Estoque</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Filtrar
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
