"use client";

import { useAuth } from '@/components/AuthContext';
import { BarChart3, TrendingUp, DollarSign, Package, Users, Activity, Target, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';

export default function ExecutivoAnalyticsPage() {
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

  const kpis = [
    {
      title: "Receita Total",
      value: "R$ 2.4M",
      change: "+18%",
      icon: DollarSign,
      color: "bg-green-500",
      trend: "up"
    },
    {
      title: "Pedidos Processados",
      value: "1,847",
      change: "+12%",
      icon: Package,
      color: "bg-blue-500",
      trend: "up"
    },
    {
      title: "Clientes Ativos",
      value: "892",
      change: "+8%",
      icon: Users,
      color: "bg-purple-500",
      trend: "up"
    },
    {
      title: "Taxa de Conversão",
      value: "24.5%",
      change: "-2%",
      icon: Target,
      color: "bg-orange-500",
      trend: "down"
    }
  ];

  const alerts = [
    {
      type: "warning",
      message: "Estoque baixo em 15 SKUs",
      time: "2h atrás",
      icon: AlertTriangle
    },
    {
      type: "success",
      message: "Meta mensal atingida - R$ 2.1M",
      time: "4h atrás",
      icon: CheckCircle
    },
    {
      type: "info",
      message: "Novo pedido grande - R$ 150K",
      time: "6h atrás",
      icon: Activity
    }
  ];

  const performanceMetrics = [
    { label: "Vendas Hoje", value: "R$ 45,230", change: "+15%" },
    { label: "Pedidos Hoje", value: "127", change: "+8%" },
    { label: "Ticket Médio", value: "R$ 356", change: "+5%" },
    { label: "Tempo Médio de Processamento", value: "2.3h", change: "-12%" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics - Executivo</h1>
            <p className="text-sm text-gray-600 mt-1">Dashboard executivo com métricas de performance</p>
          </div>
          <div className="flex items-center space-x-3">
            <BarChart3 size={24} className="text-blue-600" />
            <span className="text-sm text-gray-500">Última atualização: 14:30</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                  <p className={`text-sm flex items-center mt-1 ${
                    kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <TrendingUp size={14} className={`mr-1 ${kpi.trend === 'down' ? 'rotate-180' : ''}`} />
                    {kpi.change} vs mês anterior
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${kpi.color}`}>
                  <Icon size={24} className="text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Métricas de Performance - Hoje</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {performanceMetrics.map((metric, index) => (
            <div key={index} className="text-center">
              <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
              <p className="text-sm font-medium text-gray-600">{metric.label}</p>
              <p className={`text-sm mt-1 ${
                metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.change}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Charts and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Alerts */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Alertas Recentes</h3>
          <div className="space-y-4">
            {alerts.map((alert, index) => {
              const Icon = alert.icon;
              return (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                  <div className={`p-2 rounded-full ${
                    alert.type === 'warning' ? 'bg-yellow-100' :
                    alert.type === 'success' ? 'bg-green-100' : 'bg-blue-100'
                  }`}>
                    <Icon size={16} className={
                      alert.type === 'warning' ? 'text-yellow-600' :
                      alert.type === 'success' ? 'text-green-600' : 'text-blue-600'
                    } />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                    <p className="text-xs text-gray-500">{alert.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Produtos Mais Vendidos</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-600">1</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">SKU-2024-001</p>
                  <p className="text-xs text-gray-500">Algodão Premium</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">R$ 45,230</p>
                <p className="text-xs text-green-600">+15%</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-green-600">2</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">SKU-2024-002</p>
                  <p className="text-xs text-gray-500">Poliéster Misto</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">R$ 38,450</p>
                <p className="text-xs text-green-600">+8%</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-purple-600">3</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">SKU-2024-003</p>
                  <p className="text-xs text-gray-500">Linho Natural</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">R$ 32,180</p>
                <p className="text-xs text-green-600">+12%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Executivas</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Target size={24} className="text-blue-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Definir Metas</span>
          </button>
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <TrendingUp size={24} className="text-green-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Relatórios</span>
          </button>
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Calendar size={24} className="text-purple-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Agendar Reunião</span>
          </button>
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <AlertTriangle size={24} className="text-orange-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Alertas</span>
          </button>
        </div>
      </div>
    </div>
  );
}
