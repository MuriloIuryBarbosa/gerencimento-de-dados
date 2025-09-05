"use client";

import Link from "next/link";
import { useState } from "react";

// Dados mockados para estoque
const mockEstoque = [
  {
    id: "EST-001",
    sku: "SKU-2025-001",
    nomeProduto: "Algodão Premium Branco",
    categoria: "Tecidos",
    fornecedor: "Fornecedor A",
    estoqueAtual: 1250,
    estoqueMinimo: 500,
    estoqueMaximo: 2000,
    unidade: "metros",
    localizacao: "Depósito A - Prateleira 3",
    ultimoMovimento: "2025-01-15",
    status: "Normal",
    valorUnitario: 45.00,
    valorTotal: 56250.00
  },
  {
    id: "EST-002",
    sku: "SKU-2025-002",
    nomeProduto: "Poliéster Azul Marinho",
    categoria: "Tecidos",
    fornecedor: "Fornecedor B",
    estoqueAtual: 890,
    estoqueMinimo: 300,
    estoqueMaximo: 1500,
    unidade: "metros",
    localizacao: "Depósito A - Prateleira 5",
    ultimoMovimento: "2025-01-14",
    status: "Normal",
    valorUnitario: 32.00,
    valorTotal: 28480.00
  },
  {
    id: "EST-003",
    sku: "SKU-2025-003",
    nomeProduto: "Linho Natural",
    categoria: "Tecidos Premium",
    fornecedor: "Fornecedor C",
    estoqueAtual: 245,
    estoqueMinimo: 100,
    estoqueMaximo: 800,
    unidade: "metros",
    localizacao: "Depósito B - Prateleira 2",
    ultimoMovimento: "2025-01-13",
    status: "Baixo Estoque",
    valorUnitario: 85.00,
    valorTotal: 20825.00
  },
  {
    id: "EST-004",
    sku: "SKU-2025-004",
    nomeProduto: "Seda Vermelha",
    categoria: "Tecidos Premium",
    fornecedor: "Fornecedor D",
    estoqueAtual: 0,
    estoqueMinimo: 50,
    estoqueMaximo: 300,
    unidade: "metros",
    localizacao: "Depósito B - Prateleira 1",
    ultimoMovimento: "2025-01-10",
    status: "Fora de Estoque",
    valorUnitario: 120.00,
    valorTotal: 0.00
  }
];

export default function ControleEstoque() {
  const [estoque] = useState(mockEstoque);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Normal":
        return "bg-green-100 text-green-800";
      case "Baixo Estoque":
        return "bg-yellow-100 text-yellow-800";
      case "Fora de Estoque":
        return "bg-red-100 text-red-800";
      case "Excesso":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getEstoquePercentual = (atual: number, maximo: number) => {
    return Math.min((atual / maximo) * 100, 100);
  };

  const getStatusEstoque = (atual: number, minimo: number, maximo: number) => {
    if (atual === 0) return "Fora de Estoque";
    if (atual <= minimo) return "Baixo Estoque";
    if (atual >= maximo) return "Excesso";
    return "Normal";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Controle de Estoque</h1>
              <p className="mt-1 text-sm text-gray-500">
                Monitoramento e gestão de inventário
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Métricas */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-2xl">
                  📦
                </div>
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Total em Estoque</p>
                <p className="text-2xl font-semibold text-gray-900">2,385m</p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-2xl">
                  ✅
                </div>
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Produtos OK</p>
                <p className="text-2xl font-semibold text-gray-900">156</p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center text-2xl">
                  ⚠️
                </div>
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Baixo Estoque</p>
                <p className="text-2xl font-semibold text-gray-900">23</p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center text-2xl">
                  ❌
                </div>
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Fora de Estoque</p>
                <p className="text-2xl font-semibold text-gray-900">8</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabela de Estoque */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Inventário de Produtos
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Controle detalhado de estoques e localizações
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
                    Estoque Atual
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Localização
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {estoque.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {item.nomeProduto}
                        </div>
                        <div className="text-sm text-gray-500">
                          {item.sku} • {item.categoria}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="flex-1">
                          <div className="text-sm text-gray-900">
                            {item.estoqueAtual} {item.unidade}
                          </div>
                          <div className="text-xs text-gray-500">
                            Mín: {item.estoqueMinimo} • Máx: {item.estoqueMaximo}
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div
                              className={`h-2 rounded-full ${
                                getStatusEstoque(item.estoqueAtual, item.estoqueMinimo, item.estoqueMaximo) === 'Fora de Estoque' ? 'bg-red-500' :
                                getStatusEstoque(item.estoqueAtual, item.estoqueMinimo, item.estoqueMaximo) === 'Baixo Estoque' ? 'bg-yellow-500' :
                                getStatusEstoque(item.estoqueAtual, item.estoqueMinimo, item.estoqueMaximo) === 'Excesso' ? 'bg-blue-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${getEstoquePercentual(item.estoqueAtual, item.estoqueMaximo)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(getStatusEstoque(item.estoqueAtual, item.estoqueMinimo, item.estoqueMaximo))}`}>
                        {getStatusEstoque(item.estoqueAtual, item.estoqueMinimo, item.estoqueMaximo)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.localizacao}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      R$ {item.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button className="text-indigo-600 hover:text-indigo-900">
                        Movimentar
                      </button>
                      <Link
                        href={`/executivo/estoque/${item.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Detalhes
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
            <h3 className="text-lg font-medium text-gray-900 mb-4">Movimentação</h3>
            <div className="space-y-3">
              <button className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                ➕ Entrada de Material
              </button>
              <button className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                ➖ Saída de Material
              </button>
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                🔄 Transferência
              </button>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Relatórios</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                📊 Posição de Estoque
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                📈 Giro de Estoque
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                🎯 Curva ABC
              </button>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Alertas</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                <span className="text-sm text-red-800">8 produtos fora de estoque</span>
                <span className="text-xs text-red-600">🚨</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                <span className="text-sm text-yellow-800">23 produtos com baixo estoque</span>
                <span className="text-xs text-yellow-600">⚠️</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                <span className="text-sm text-blue-800">5 produtos em excesso</span>
                <span className="text-xs text-blue-600">ℹ️</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mapa de Depósito */}
        <div className="mt-6 bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Mapa do Depósito</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="border-2 border-gray-200 rounded-lg p-4 text-center">
              <h4 className="font-medium text-gray-900">Depósito A</h4>
              <p className="text-sm text-gray-500">2.140m de tecido</p>
              <div className="mt-2 grid grid-cols-3 gap-1">
                {Array.from({ length: 9 }, (_, i) => (
                  <div
                    key={i}
                    className={`w-6 h-6 rounded ${
                      i < 6 ? 'bg-green-200' : i < 8 ? 'bg-yellow-200' : 'bg-red-200'
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="border-2 border-gray-200 rounded-lg p-4 text-center">
              <h4 className="font-medium text-gray-900">Depósito B</h4>
              <p className="text-sm text-gray-500">245m de tecido</p>
              <div className="mt-2 grid grid-cols-3 gap-1">
                {Array.from({ length: 9 }, (_, i) => (
                  <div
                    key={i}
                    className={`w-6 h-6 rounded ${
                      i < 2 ? 'bg-green-200' : i < 7 ? 'bg-gray-200' : 'bg-red-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
