"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Search, Filter, Eye } from 'lucide-react';

interface Cor {
  id: string;
  nome: string;
  codigoHex: string;
  codigoRgb: string;
  categoria: string;
  skusRelacionados: string[];
  estoqueTotal: number;
  valorTotal: number;
  status: string;
  dataCadastro: string;
  fornecedor: string;
  descricao: string;
}

interface CoresData {
  cores: Cor[];
  estatisticas: {
    totalCores: number;
    coresAtivas: number;
    coresBaixoEstoque: number;
    coresForaEstoque: number;
    totalEstoque: number;
    valorTotal: number;
  };
  categorias: string[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export default function ControleCores() {
  const [coresData, setCoresData] = useState<CoresData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [busca, setBusca] = useState("");

  useEffect(() => {
    const fetchCoresData = async () => {
      try {
        const response = await fetch('/api/executivo/cores');
        if (response.ok) {
          const data = await response.json();
          setCoresData(data);
        }
      } catch (error) {
        console.error('Erro ao buscar dados das cores:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoresData();
  }, []);

  const coresFiltradas = coresData?.cores.filter((cor: Cor) => {
    const matchCategoria = !filtroCategoria || cor.categoria === filtroCategoria;
    const matchBusca = !busca ||
      cor.nome.toLowerCase().includes(busca.toLowerCase()) ||
      cor.id.toLowerCase().includes(busca.toLowerCase());
    return matchCategoria && matchBusca;
  }) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativo":
        return "bg-green-100 text-green-800";
      case "Baixo Estoque":
        return "bg-yellow-100 text-yellow-800";
      case "Fora de Estoque":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getEstoquePercentual = (estoque: number) => {
    if (estoque === 0) return 0;
    if (estoque < 500) return 25;
    if (estoque < 1000) return 50;
    if (estoque < 2000) return 75;
    return 100;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Cores</h1>
              <p className="mt-1 text-sm text-gray-500">
                Gestão visual e integrada das cores com estoque e SKUs
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Filtros e Busca */}
        <div className="mb-8 bg-white shadow rounded-lg p-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buscar Cor
              </label>
              <input
                type="text"
                placeholder="Digite o nome ou código da cor..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="md:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoria
              </label>
              <select
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Todas as categorias</option>
                {coresData?.categorias.map((cat: string) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Grid de Cores */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {coresFiltradas.map((cor) => (
            <div key={cor.id} className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              {/* Amostra da Cor */}
              <div
                className="h-32 relative"
                style={{ backgroundColor: cor.codigoHex }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black bg-opacity-20 px-3 py-1 rounded text-white font-medium">
                    {cor.nome}
                  </div>
                </div>
                <div className="absolute top-2 right-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(cor.status)}`}>
                    {cor.status}
                  </span>
                </div>
              </div>

              {/* Informações da Cor */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{cor.nome}</h3>
                    <p className="text-sm text-gray-500">{cor.id}</p>
                  </div>
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                    {cor.categoria}
                  </span>
                </div>

                {/* Códigos de Cor */}
                <div className="mb-3 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">HEX:</span>
                    <span className="font-mono text-gray-900">{cor.codigoHex}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">RGB:</span>
                    <span className="font-mono text-gray-900">{cor.codigoRgb}</span>
                  </div>
                </div>

                {/* Estoque */}
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Estoque:</span>
                    <span className="font-medium text-gray-900">{cor.estoqueTotal} metros</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        cor.status === 'Fora de Estoque' ? 'bg-red-500' :
                        cor.status === 'Baixo Estoque' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${getEstoquePercentual(cor.estoqueTotal)}%` }}
                    ></div>
                  </div>
                </div>

                {/* SKUs Relacionados */}
                <div className="mb-3">
                  <p className="text-sm text-gray-500 mb-1">SKUs relacionados:</p>
                  <div className="flex flex-wrap gap-1">
                    {cor.skusRelacionados.slice(0, 2).map(sku => (
                      <span key={sku} className="inline-flex px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800">
                        {sku}
                      </span>
                    ))}
                    {cor.skusRelacionados.length > 2 && (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded bg-gray-100 text-gray-800">
                        +{cor.skusRelacionados.length - 2}
                      </span>
                    )}
                  </div>
                </div>

                {/* Valor Total */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-500">Valor Total:</span>
                  <span className="text-lg font-semibold text-gray-900">
                    R$ {cor.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                {/* Ações */}
                <div className="flex space-x-2">
                  <Link
                    href={`/executivo/cores/${cor.id}`}
                    className="flex-1 text-center px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100"
                  >
                    Ver Detalhes
                  </Link>
                  <button className="flex-1 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-md hover:bg-gray-100">
                    Editar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Estatísticas */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-2xl">
                  🎨
                </div>
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Total de Cores</p>
                <p className="text-2xl font-semibold text-gray-900">{coresFiltradas.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-2xl">
                  📦
                </div>
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Estoque Total</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {coresFiltradas.reduce((total: number, cor: Cor) => total + cor.estoqueTotal, 0).toLocaleString()}m
                </p>
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
                <p className="text-2xl font-semibold text-gray-900">
                  {coresFiltradas.filter((cor: Cor) => cor.status === 'Baixo Estoque').length}
                </p>
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
                <p className="text-2xl font-semibold text-gray-900">
                  {coresFiltradas.filter((cor: Cor) => cor.status === 'Fora de Estoque').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Paleta de Cores por Categoria */}
        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Paleta por Categoria</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {coresData?.categorias.map((categoria: string) => {
              const coresCategoria = coresFiltradas.filter((cor: Cor) => cor.categoria === categoria);
              return (
                <div key={categoria} className="text-center">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">{categoria}</h4>
                  <div className="flex flex-wrap justify-center gap-1 mb-2">
                    {coresCategoria.slice(0, 4).map((cor: Cor) => (
                      <div
                        key={cor.id}
                        className="w-6 h-6 rounded border border-gray-300 cursor-pointer hover:scale-110 transition-transform"
                        style={{ backgroundColor: cor.codigoHex }}
                        title={cor.nome}
                      />
                    ))}
                    {coresCategoria.length > 4 && (
                      <div className="w-6 h-6 rounded border border-gray-300 bg-gray-200 flex items-center justify-center text-xs text-gray-600">
                        +{coresCategoria.length - 4}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{coresCategoria.length} cores</p>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

// Funções auxiliares
function getStatusColor(status: string): string {
  switch (status) {
    case 'Ativo':
      return 'bg-green-100 text-green-800';
    case 'Baixo Estoque':
      return 'bg-yellow-100 text-yellow-800';
    case 'Fora de Estoque':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function getEstoquePercentual(estoque: number): number {
  // Considerando que o estoque ideal é 1000 metros
  const percentual = (estoque / 1000) * 100;
  return Math.min(percentual, 100);
}
