"use client";

import Link from "next/link";
import { DollarSign, FileText, CreditCard, TrendingUp, ArrowLeft, Calculator, Receipt } from 'lucide-react';

export default function FinanceiroPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-blue-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-full">
                <DollarSign size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Financeiro</h1>
                <p className="mt-1 text-green-100">
                  Gerencie pagamentos, boletos e finanças
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
          {/* Gestão de Boletos */}
          <Link
            href="/financeiro/boletos"
            className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border-l-8 border-green-500"
          >
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-green-100 p-3 rounded-full group-hover:bg-green-200 transition-colors duration-200">
                  <FileText size={24} className="text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors duration-200">
                    Gestão de Boletos
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Controle de boletos, pagamentos e vencimentos
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Sistema completo</span>
                <Receipt size={16} className="text-green-500 group-hover:text-green-600 transition-colors duration-200" />
              </div>
            </div>
          </Link>

          {/* Placeholder para futuras funcionalidades */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-l-8 border-gray-300">
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-gray-100 p-3 rounded-full">
                  <CreditCard size={24} className="text-gray-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-400">
                    Contas a Pagar
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Em desenvolvimento
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Próximas versões</span>
                <DollarSign size={16} className="text-gray-400" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-l-8 border-gray-300">
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-gray-100 p-3 rounded-full">
                  <TrendingUp size={24} className="text-gray-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-400">
                    Relatórios Financeiros
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Em desenvolvimento
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Próximas versões</span>
                <Calculator size={16} className="text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Informações do Módulo */}
        <div className="mt-12 bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Sobre o Módulo Financeiro
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              O módulo financeiro oferece ferramentas completas para gestão de pagamentos,
              controle de boletos, análise de custos e relatórios financeiros detalhados.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText size={32} className="text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Controle de Boletos
              </h3>
              <p className="text-gray-600 text-sm">
                Gerencie emissões, vencimentos e pagamentos de boletos de forma eficiente.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign size={32} className="text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Gestão Financeira
              </h3>
              <p className="text-gray-600 text-sm">
                Acompanhe custos, receitas e margens de lucro em tempo real.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp size={32} className="text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Relatórios Avançados
              </h3>
              <p className="text-gray-600 text-sm">
                Gere relatórios detalhados para tomada de decisões estratégicas.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
