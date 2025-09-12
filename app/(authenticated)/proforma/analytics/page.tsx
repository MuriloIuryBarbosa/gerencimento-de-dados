"use client";

import { useAuth } from '@/components/AuthContext';
import { BarChart3, FileText, DollarSign, TrendingUp, Users, Clock, CheckCircle, AlertTriangle, Target, Globe } from 'lucide-react';

export default function ProformaAnalyticsPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const proformaMetrics = [
    {
      title: "Proformas Ativas",
      value: "89",
      change: "+12%",
      icon: FileText,
      color: "bg-blue-500",
      trend: "up"
    },
    {
      title: "Valor Total em Proformas",
      value: "R$ 4.2M",
      change: "+18%",
      icon: DollarSign,
      color: "bg-green-500",
      trend: "up"
    },
    {
      title: "Taxa de Conversão",
      value: "34%",
      change: "+5%",
      icon: Target,
      color: "bg-purple-500",
      trend: "up"
    },
    {
      title: "Tempo Médio de Resposta",
      value: "2.8d",
      change: "-15%",
      icon: Clock,
      color: "bg-orange-500",
      trend: "down"
    }
  ];

  const proformaStatus = [
    { status: "Enviadas", count: 45, percentage: 51, color: "bg-blue-500" },
    { status: "Aprovadas", count: 30, percentage: 34, color: "bg-green-500" },
    { status: "Em Análise", count: 14, percentage: 15, color: "bg-yellow-500" }
  ];

  const topClients = [
    { name: "Cliente Internacional Ltda", proformas: 12, value: "R$ 850.000", conversion: 42 },
    { name: "Fashion Export Corp", proformas: 8, value: "R$ 620.000", conversion: 38 },
    { name: "Global Textiles Inc", proformas: 10, value: "R$ 580.000", conversion: 35 },
    { name: "Premium Clothing Co", proformas: 6, value: "R$ 450.000", conversion: 50 },
    { name: "Textile Solutions Ltd", proformas: 7, value: "R$ 420.000", conversion: 29 }
  ];

  const monthlyProformas = [
    { month: "Jan", proformas: 12, value: 850000, conversions: 4 },
    { month: "Fev", proformas: 15, value: 920000, conversions: 5 },
    { month: "Mar", proformas: 18, value: 1100000, conversions: 6 },
    { month: "Abr", proformas: 14, value: 890000, conversions: 5 },
    { month: "Mai", proformas: 16, value: 980000, conversions: 6 },
    { month: "Jun", proformas: 20, value: 1250000, conversions: 7 }
  ];

  const regionalPerformance = [
    { region: "América do Norte", proformas: 25, value: 1800000, conversion: 36 },
    { region: "Europa", proformas: 20, value: 1500000, conversion: 40 },
    { region: "Ásia", proformas: 18, value: 1350000, conversion: 33 },
    { region: "América do Sul", proformas: 15, value: 980000, conversion: 27 },
    { region: "Oceania", proformas: 11, value: 780000, conversion: 45 }
  ];

  const productCategories = [
    { category: "Algodão Premium", proformas: 35, value: 1200000, avgPrice: 34286 },
    { category: "Poliéster Misto", proformas: 28, value: 950000, avgPrice: 33929 },
    { category: "Linho Natural", proformas: 15, value: 680000, avgPrice: 45333 },
    { category: "Malha Técnica", proformas: 11, value: 520000, avgPrice: 47273 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics - Proformas</h1>
            <p className="text-sm text-gray-600 mt-1">Análise de propostas comerciais e conversões</p>
          </div>
          <div className="flex items-center space-x-3">
            <BarChart3 size={24} className="text-blue-600" />
            <span className="text-sm text-gray-500">Última atualização: 14:30</span>
          </div>
        </div>
      </div>

      {/* Proforma Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {proformaMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  <p className={`text-sm flex items-center mt-1 ${
                    metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <TrendingUp size={14} className={`mr-1 ${metric.trend === 'down' ? 'rotate-180' : ''}`} />
                    {metric.change} vs mês anterior
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${metric.color}`}>
                  <Icon size={24} className="text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Proforma Status Overview */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Status das Proformas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {proformaStatus.map((status, index) => (
            <div key={index} className="text-center">
              <div className="relative w-full bg-gray-200 rounded-full h-4 mb-2">
                <div
                  className={`h-4 rounded-full ${status.color}`}
                  style={{ width: `${status.percentage}%` }}
                ></div>
              </div>
              <p className="text-sm font-medium text-gray-900">{status.status}</p>
              <p className="text-lg font-bold text-gray-900">{status.count}</p>
              <p className="text-xs text-gray-500">{status.percentage}%</p>
            </div>
          ))}
        </div>
      </div>

      {/* Top Clients and Monthly Proformas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Clients */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Clientes</h3>
          <div className="space-y-4">
            {topClients.map((client, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-green-600">{index + 1}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{client.name}</p>
                    <p className="text-xs text-gray-500">{client.proformas} proformas</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{client.value}</p>
                  <p className="text-xs text-blue-600">{client.conversion}% conversão</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Proformas */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Proformas por Mês</h3>
          <div className="space-y-4">
            {monthlyProformas.map((month, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900 w-12">{month.month}</span>
                <div className="flex-1 mx-4">
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-purple-500 h-4 rounded-full"
                      style={{ width: `${(month.proformas / 25) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{month.proformas}</p>
                  <p className="text-xs text-green-600">{month.conversions} conversões</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Regional Performance and Product Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Regional Performance */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance por Região</h3>
          <div className="space-y-4">
            {regionalPerformance.map((region, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Globe size={16} className="text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{region.region}</p>
                    <p className="text-xs text-gray-500">{region.proformas} proformas</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">
                    R$ {(region.value / 1000).toFixed(0)}K
                  </p>
                  <p className="text-xs text-green-600">{region.conversion}% conversão</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Product Categories */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Produtos Mais Cotados</h3>
          <div className="space-y-4">
            {productCategories.map((category, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{category.category}</p>
                  <p className="text-xs text-gray-500">{category.proformas} proformas</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">
                    R$ {(category.value / 1000).toFixed(0)}K
                  </p>
                  <p className="text-xs text-blue-600">
                    R$ {(category.avgPrice / 1000).toFixed(0)}K médio
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Conversion Funnel */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Funil de Conversão</h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <FileText size={24} className="text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">89</p>
            <p className="text-sm text-gray-600">Proformas Criadas</p>
            <p className="text-xs text-gray-500">100%</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Clock size={24} className="text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">45</p>
            <p className="text-sm text-gray-600">Enviadas</p>
            <p className="text-xs text-gray-500">51%</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Users size={24} className="text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">30</p>
            <p className="text-sm text-gray-600">Em Análise</p>
            <p className="text-xs text-gray-500">34%</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircle size={24} className="text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">30</p>
            <p className="text-sm text-gray-600">Aprovadas</p>
            <p className="text-xs text-gray-500">34%</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações de Proformas</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <FileText size={24} className="text-blue-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Nova Proforma</span>
          </button>
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Users size={24} className="text-green-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Gerenciar Clientes</span>
          </button>
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Target size={24} className="text-purple-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Oportunidades</span>
          </button>
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <TrendingUp size={24} className="text-orange-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Relatórios</span>
          </button>
        </div>
      </div>
    </div>
  );
}
