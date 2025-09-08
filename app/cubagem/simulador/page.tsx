"use client";

import Link from "next/link";
import { useState } from "react";
import { Calculator, Package, Truck, ArrowLeft, Plus, Minus, RotateCcw, Save, Download } from 'lucide-react';

interface Produto {
  id: string;
  nome: string;
  largura: number;
  altura: number;
  profundidade: number;
  peso: number;
  quantidade: number;
  volume: number;
  pesoTotal: number;
}

interface Container {
  tipo: string;
  largura: number;
  altura: number;
  profundidade: number;
  pesoMaximo: number;
  volumeMaximo: number;
}

export default function SimuladorCubagemPage() {
  const [produtos, setProdutos] = useState<Produto[]>([
    {
      id: '1',
      nome: 'Produto Exemplo',
      largura: 30,
      altura: 20,
      profundidade: 15,
      peso: 2.5,
      quantidade: 10,
      volume: 0,
      pesoTotal: 0
    }
  ]);

  const [containerSelecionado, setContainerSelecionado] = useState<string>('20ft');
  const [resultados, setResultados] = useState<any>(null);

  const containers: Record<string, Container> = {
    '20ft': {
      tipo: '20ft Standard',
      largura: 233,
      altura: 239,
      profundidade: 589,
      pesoMaximo: 21700,
      volumeMaximo: 33.2
    },
    '40ft': {
      tipo: '40ft Standard',
      largura: 233,
      altura: 239,
      profundidade: 1203,
      pesoMaximo: 26700,
      volumeMaximo: 67.7
    },
    '40hc': {
      tipo: '40ft High Cube',
      largura: 233,
      altura: 269,
      profundidade: 1203,
      pesoMaximo: 26700,
      volumeMaximo: 76.3
    }
  };

  const adicionarProduto = () => {
    const novoProduto: Produto = {
      id: Date.now().toString(),
      nome: `Produto ${produtos.length + 1}`,
      largura: 0,
      altura: 0,
      profundidade: 0,
      peso: 0,
      quantidade: 1,
      volume: 0,
      pesoTotal: 0
    };
    setProdutos([...produtos, novoProduto]);
  };

  const removerProduto = (id: string) => {
    setProdutos(produtos.filter(p => p.id !== id));
  };

  const atualizarProduto = (id: string, campo: keyof Produto, valor: string | number) => {
    setProdutos(produtos.map(produto => {
      if (produto.id === id) {
        const updated = { ...produto, [campo]: valor };

        // Calcular volume e peso total
        if (campo === 'largura' || campo === 'altura' || campo === 'profundidade' || campo === 'quantidade' || campo === 'peso') {
          const volume = (updated.largura * updated.altura * updated.profundidade) / 1000000; // m³
          const pesoTotal = updated.peso * updated.quantidade;

          updated.volume = volume;
          updated.pesoTotal = pesoTotal;
        }

        return updated;
      }
      return produto;
    }));
  };

  const calcularCubagem = () => {
    const container = containers[containerSelecionado];

    // Calcular totais
    const totalVolume = produtos.reduce((sum, p) => sum + p.volume, 0);
    const totalPeso = produtos.reduce((sum, p) => sum + p.pesoTotal, 0);
    const totalItens = produtos.reduce((sum, p) => sum + p.quantidade, 0);

    // Calcular percentuais
    const percentualVolume = (totalVolume / container.volumeMaximo) * 100;
    const percentualPeso = (totalPeso / container.pesoMaximo) * 100;

    // Determinar gargalo
    const gargalo = percentualVolume > percentualPeso ? 'volume' : 'peso';
    const percentualGargalo = Math.max(percentualVolume, percentualPeso);

    setResultados({
      container,
      totais: {
        volume: totalVolume,
        peso: totalPeso,
        itens: totalItens
      },
      percentuais: {
        volume: percentualVolume,
        peso: percentualPeso
      },
      gargalo,
      percentualGargalo,
      viavel: percentualGargalo <= 100
    });
  };

  const limparSimulacao = () => {
    setProdutos([{
      id: '1',
      nome: 'Produto Exemplo',
      largura: 30,
      altura: 20,
      profundidade: 15,
      peso: 2.5,
      quantidade: 10,
      volume: 0,
      pesoTotal: 0
    }]);
    setResultados(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-full">
                <Calculator size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Simulador de Cubagem</h1>
                <p className="mt-1 text-purple-100">
                  Calcule volumes e otimize espaços em containers
                </p>
              </div>
            </div>
            <Link
              href="/cubagem"
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full transition-colors duration-200"
            >
              ← Voltar
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Formulário de Entrada */}
          <div className="lg:col-span-2 space-y-6">

            {/* Seleção de Container */}
            <div className="bg-white shadow-xl rounded-2xl p-6 border-l-8 border-purple-500">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Truck size={24} className="text-purple-600 mr-2" />
                Seleção de Container
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(containers).map(([key, container]) => (
                  <button
                    key={key}
                    onClick={() => setContainerSelecionado(key)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      containerSelecionado === key
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="font-semibold">{container.tipo}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      {container.largura}×{container.altura}×{container.profundidade}cm
                    </div>
                    <div className="text-sm text-gray-600">
                      {container.volumeMaximo}m³ • {container.pesoMaximo}kg
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Produtos */}
            <div className="bg-white shadow-xl rounded-2xl p-6 border-l-8 border-blue-500">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <Package size={24} className="text-blue-600 mr-2" />
                  Produtos
                </h2>
                <button
                  onClick={adicionarProduto}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-colors duration-200"
                >
                  <Plus size={18} />
                  <span>Adicionar Produto</span>
                </button>
              </div>

              <div className="space-y-4">
                {produtos.map((produto, index) => (
                  <div key={produto.id} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold text-gray-900">Produto {index + 1}</h3>
                      {produtos.length > 1 && (
                        <button
                          onClick={() => removerProduto(produto.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Minus size={18} />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nome do Produto
                        </label>
                        <input
                          type="text"
                          value={produto.nome}
                          onChange={(e) => atualizarProduto(produto.id, 'nome', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Largura (cm)
                        </label>
                        <input
                          type="number"
                          value={produto.largura}
                          onChange={(e) => atualizarProduto(produto.id, 'largura', Number(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Altura (cm)
                        </label>
                        <input
                          type="number"
                          value={produto.altura}
                          onChange={(e) => atualizarProduto(produto.id, 'altura', Number(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Profundidade (cm)
                        </label>
                        <input
                          type="number"
                          value={produto.profundidade}
                          onChange={(e) => atualizarProduto(produto.id, 'profundidade', Number(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Peso Unitário (kg)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={produto.peso}
                          onChange={(e) => atualizarProduto(produto.id, 'peso', Number(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Quantidade
                        </label>
                        <input
                          type="number"
                          value={produto.quantidade}
                          onChange={(e) => atualizarProduto(produto.id, 'quantidade', Number(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Volume Total (m³)
                        </label>
                        <input
                          type="number"
                          value={produto.volume.toFixed(4)}
                          readOnly
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-600"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Peso Total (kg)
                        </label>
                        <input
                          type="number"
                          value={produto.pesoTotal.toFixed(2)}
                          readOnly
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-600"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex space-x-4">
              <button
                onClick={calcularCubagem}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Calculator size={20} className="inline mr-2" />
                Calcular Cubagem
              </button>

              <button
                onClick={limparSimulacao}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200"
              >
                <RotateCcw size={20} className="inline mr-2" />
                Limpar
              </button>
            </div>
          </div>

          {/* Resultados */}
          <div className="space-y-6">
            {resultados && (
              <div className="bg-white shadow-xl rounded-2xl p-6 border-l-8 border-green-500">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <Calculator size={24} className="text-green-600 mr-2" />
                  Resultados da Simulação
                </h2>

                {/* Container Info */}
                <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                  <h3 className="font-semibold text-gray-900 mb-2">Container Selecionado</h3>
                  <p className="text-sm text-gray-600">{resultados.container.tipo}</p>
                  <p className="text-sm text-gray-600">
                    Volume Máx: {resultados.container.volumeMaximo}m³ • Peso Máx: {resultados.container.pesoMaximo}kg
                  </p>
                </div>

                {/* Totais */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Totais Calculados</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Volume Total:</span>
                      <span className="font-semibold">{resultados.totais.volume.toFixed(4)} m³</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Peso Total:</span>
                      <span className="font-semibold">{resultados.totais.peso.toFixed(2)} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total de Itens:</span>
                      <span className="font-semibold">{resultados.totais.itens}</span>
                    </div>
                  </div>
                </div>

                {/* Percentuais */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Utilização</h3>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Volume</span>
                        <span>{resultados.percentuais.volume.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${Math.min(resultados.percentuais.volume, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Peso</span>
                        <span>{resultados.percentuais.peso.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${Math.min(resultados.percentuais.peso, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className={`p-4 rounded-xl ${
                  resultados.viavel
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-red-50 border border-red-200'
                }`}>
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${
                      resultados.viavel ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <div>
                      <p className={`font-semibold ${
                        resultados.viavel ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {resultados.viavel ? 'Viável' : 'Não Viável'}
                      </p>
                      <p className={`text-sm ${
                        resultados.viavel ? 'text-green-600' : 'text-red-600'
                      }`}>
                        Gargalo: {resultados.gargalo === 'volume' ? 'Volume' : 'Peso'} ({resultados.percentualGargalo.toFixed(1)}%)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Recomendações */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <h4 className="font-semibold text-blue-800 mb-2">Recomendações</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    {resultados.percentualGargalo > 100 && (
                      <li>• Considere aumentar a quantidade de containers</li>
                    )}
                    {resultados.gargalo === 'volume' && resultados.percentuais.volume < 80 && (
                      <li>• Ainda há espaço para mais produtos no container</li>
                    )}
                    {resultados.gargalo === 'peso' && resultados.percentuais.peso < 80 && (
                      <li>• Ainda há capacidade de peso disponível</li>
                    )}
                  </ul>
                </div>
              </div>
            )}

            {/* Ações */}
            {resultados && (
              <div className="bg-white shadow-xl rounded-2xl p-6 border-l-8 border-gray-500">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Ações</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl transition-colors duration-200">
                    <Save size={18} />
                    <span>Salvar Simulação</span>
                  </button>

                  <button className="w-full flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl transition-colors duration-200">
                    <Download size={18} />
                    <span>Exportar Relatório</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
