"use client";

import Link from "next/link";
import { Package, Calculator, ArrowLeft, Zap, Box, Truck } from 'lucide-react';

export default function CubagemPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-full">
                <Package size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Cubagem</h1>
                <p className="mt-1 text-purple-100">
                  Gerencie volumes e cubagem de produtos
                </p>
              </div>
            </div>
            <Link
              href="/"
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full transition-colors duration-200"
            >
              ← Voltar ao Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        {/* Funcionalidades Disponíveis */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Simulador de Cubagem */}
          <Link
            href="/cubagem/simulador"
            className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border-l-8 border-purple-500"
          >
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-purple-100 p-3 rounded-full group-hover:bg-purple-200 transition-colors duration-200">
                  <Calculator size={24} className="text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors duration-200">
                    Simulador de Cubagem
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Calcule volumes e otimização de espaço
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Ferramenta avançada</span>
                <Zap size={16} className="text-purple-500 group-hover:text-purple-600 transition-colors duration-200" />
              </div>
            </div>
          </Link>

          {/* Placeholder para futuras funcionalidades */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-l-8 border-gray-300">
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-gray-100 p-3 rounded-full">
                  <Box size={24} className="text-gray-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-400">
                    Em Breve
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Novas funcionalidades em desenvolvimento
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Próximas versões</span>
                <Truck size={16} className="text-gray-400" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-l-8 border-gray-300">
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-gray-100 p-3 rounded-full">
                  <Package size={24} className="text-gray-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-400">
                    Em Breve
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Novas funcionalidades em desenvolvimento
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Próximas versões</span>
                <Box size={16} className="text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Informações do Módulo */}
        <div className="mt-12 bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Sobre o Módulo de Cubagem
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              O módulo de cubagem oferece ferramentas avançadas para calcular volumes,
              otimizar espaços em containers e maximizar a eficiência logística dos seus produtos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calculator size={32} className="text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Cálculos Precisos
              </h3>
              <p className="text-gray-600 text-sm">
                Algoritmos avançados para cálculos de volume e peso com máxima precisão.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Box size={32} className="text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Otimização de Espaço
              </h3>
              <p className="text-gray-600 text-sm">
                Maximize a utilização de containers e reduza custos de transporte.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck size={32} className="text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Logística Eficiente
              </h3>
              <p className="text-gray-600 text-sm">
                Planeje rotas e cargas de forma inteligente e sustentável.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
