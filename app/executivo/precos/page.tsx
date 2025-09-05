"use client";

import Link from "next/link";
import { useState } from "react";

// Dados mockados para preços
const mockPrecos = [
  {
    id: "PRC-2025-001",
    sku: "SKU-2025-001",
    nomeProduto: "Algodão Premium Branco",
    precoCusto: 45.00,
    precoVenda: 75.00,
    margemLucro: 66.67,
    categoria: "Tecidos",
    fornecedor: "Fornecedor A",
    ultimaAtualizacao: "2025-01-15",
    status: "Ativo",
    historico: [
      { data: "2025-01-15", precoAnterior: 72.00, precoNovo: 75.00, motivo: "Ajuste de mercado" },
      { data: "2025-01-01", precoAnterior: 70.00, precoNovo: 72.00, motivo: "Inflação" }
    ]
  },
  {
    id: "PRC-2025-002",
    sku: "SKU-2025-002",
    nomeProduto: "Poliéster Azul Marinho",
    precoCusto: 32.00,
    precoVenda: 58.00,
    margemLucro: 81.25,
    categoria: "Tecidos",
    fornecedor: "Fornecedor B",
    ultimaAtualizacao: "2025-01-12",
    status: "Ativo",
    historico: [
      { data: "2025-01-12", precoAnterior: 55.00, precoNovo: 58.00, motivo: "Aumento de custo" }
    ]
  },
  {
    id: "PRC-2025-003",
    sku: "SKU-2025-003",
    nomeProduto: "Linho Natural",
    precoCusto: 85.00,
    precoVenda: 145.00,
    margemLucro: 70.59,
    categoria: "Tecidos Premium",
    fornecedor: "Fornecedor C",
    ultimaAtualizacao: "2025-01-10",
    status: "Ativo",
    historico: [
      { data: "2025-01-10", precoAnterior: 140.00, precoNovo: 145.00, motivo: "Reajuste sazonal" }
    ]
  }
];

export default function GestaoPrecos() {
  const [precos] = useState(mockPrecos);

  const getMargemColor = (margem: number) => {
    if (margem >= 50) return "text-green-600";
    if (margem >= 30) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestão de Preços</h1>
              <p className="mt-1 text-sm text-gray-500">
                Controle de custos, vendas e margens de lucro
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Métricas */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-2xl">
                  💰
                </div>
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Margem Média</p>
                <p className="text-2xl font-semibold text-gray-900">72.8%</p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-2xl">
                  📈
                </div>
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Produtos Ativos</p>
                <p className="text-2xl font-semibold text-gray-900">156</p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center text-2xl">
                  ⏰
                </div>
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Atualizações Hoje</p>
                <p className="text-2xl font-semibold text-gray-900">8</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabela de Preços */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Controle de Preços
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Gerencie preços de custo, venda e margens
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preço Custo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preço Venda
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Margem
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Última Atualização
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {precos.map((preco) => (
                  <tr key={preco.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {preco.nomeProduto}
                        </div>
                        <div className="text-sm text-gray-500">
                          {preco.sku} • {preco.categoria}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      R$ {preco.precoCusto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      R$ {preco.precoVenda.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`font-semibold ${getMargemColor(preco.margemLucro)}`}>
                        {preco.margemLucro.toFixed(2)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {preco.ultimaAtualizacao}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button className="text-indigo-600 hover:text-indigo-900">
                        Ajustar Preço
                      </button>
                      <Link
                        href={`/executivo/precos/${preco.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Histórico
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Reajuste em Lote</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Percentual
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="5.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                Aplicar Reajuste
              </button>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Relatórios</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                📊 Margens por Categoria
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                📈 Histórico de Preços
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                🎯 Análise de Concorrência
              </button>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Alertas</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                <span className="text-sm text-yellow-800">Margem baixa em 3 produtos</span>
                <span className="text-xs text-yellow-600">⚠️</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                <span className="text-sm text-green-800">5 produtos sem reajuste há 30 dias</span>
                <span className="text-xs text-green-600">ℹ️</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
