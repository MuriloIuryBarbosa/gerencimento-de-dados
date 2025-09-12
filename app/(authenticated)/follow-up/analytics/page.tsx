"use client";

import { useAuth } from '@/components/AuthContext';
import { BarChart3, Clock, CheckCircle, AlertTriangle, Package, Truck, Users, TrendingUp, Activity, MessageSquare } from 'lucide-react';

export default function FollowUpAnalyticsPage() {
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

  const followUpMetrics = [
    {
      title: "Pedidos em Follow-up",
      value: "89",
      change: "+12%",
      icon: Package,
      color: "bg-blue-500",
      trend: "up"
    },
    {
      title: "Tempo Médio de Resposta",
      value: "2.3h",
      change: "-15%",
      icon: Clock,
      color: "bg-green-500",
      trend: "down"
    },
    {
      title: "Satisfação do Cliente",
      value: "94%",
      change: "+3%",
      icon: Users,
      color: "bg-purple-500",
      trend: "up"
    },
    {
      title: "Reclamações Abertas",
      value: "7",
      change: "-8%",
      icon: AlertTriangle,
      color: "bg-red-500",
      trend: "down"
    }
  ];

  const orderStatus = [
    { status: "Em Produção", count: 45, percentage: 51, color: "bg-blue-500" },
    { status: "Em Trânsito", count: 23, percentage: 26, color: "bg-yellow-500" },
    { status: "Entregue", count: 21, percentage: 23, color: "bg-green-500" }
  ];

  const recentInteractions = [
    {
      orderId: "OC-2024-001",
      client: "Empresa ABC Ltda",
      action: "Atualização de status",
      time: "2h atrás",
      type: "update"
    },
    {
      orderId: "OC-2024-002",
      client: "Cliente XYZ Corp",
      action: "Reclamação sobre atraso",
      time: "4h atrás",
      type: "complaint"
    },
    {
      orderId: "OC-2024-003",
      client: "Fashion Store",
      action: "Confirmação de entrega",
      time: "6h atrás",
      type: "delivery"
    },
    {
      orderId: "OC-2024-004",
      client: "Textile Plus",
      action: "Solicitação de alteração",
      time: "8h atrás",
      type: "request"
    }
  ];

  const deliveryPerformance = [
    { period: "Ontem", onTime: 18, delayed: 2, total: 20 },
    { period: "Hoje", onTime: 15, delayed: 1, total: 16 },
    { period: "Semana", onTime: 142, delayed: 8, total: 150 },
    { period: "Mês", onTime: 587, delayed: 23, total: 610 }
  ];

  const clientFeedback = [
    { rating: 5, count: 45, percentage: 65 },
    { rating: 4, count: 18, percentage: 26 },
    { rating: 3, count: 5, percentage: 7 },
    { rating: 2, count: 1, percentage: 1 },
    { rating: 1, count: 1, percentage: 1 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics - Follow-up</h1>
            <p className="text-sm text-gray-600 mt-1">Acompanhamento de pedidos e satisfação do cliente</p>
          </div>
          <div className="flex items-center space-x-3">
            <BarChart3 size={24} className="text-blue-600" />
            <span className="text-sm text-gray-500">Última atualização: 14:30</span>
          </div>
        </div>
      </div>

      {/* Follow-up Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {followUpMetrics.map((metric, index) => {
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
                    {metric.change} vs período anterior
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

      {/* Order Status Overview */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Status dos Pedidos</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {orderStatus.map((status, index) => (
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

      {/* Delivery Performance and Recent Interactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Delivery Performance */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance de Entrega</h3>
          <div className="space-y-4">
            {deliveryPerformance.map((period, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                <span className="text-sm font-medium text-gray-900">{period.period}</span>
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <p className="text-xs text-green-600">No Prazo</p>
                    <p className="text-sm font-bold text-green-600">{period.onTime}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-red-600">Atrasado</p>
                    <p className="text-sm font-bold text-red-600">{period.delayed}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Total</p>
                    <p className="text-sm font-bold text-gray-900">{period.total}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-blue-600">Taxa</p>
                    <p className="text-sm font-bold text-blue-600">
                      {((period.onTime / period.total) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Interactions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Interações Recentes</h3>
          <div className="space-y-4">
            {recentInteractions.map((interaction, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 border border-gray-100 rounded-lg">
                <div className={`p-2 rounded-full ${
                  interaction.type === 'complaint' ? 'bg-red-100' :
                  interaction.type === 'delivery' ? 'bg-green-100' :
                  interaction.type === 'request' ? 'bg-blue-100' : 'bg-yellow-100'
                }`}>
                  {interaction.type === 'complaint' ? (
                    <AlertTriangle size={16} className="text-red-600" />
                  ) : interaction.type === 'delivery' ? (
                    <CheckCircle size={16} className="text-green-600" />
                  ) : interaction.type === 'request' ? (
                    <MessageSquare size={16} className="text-blue-600" />
                  ) : (
                    <Activity size={16} className="text-yellow-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{interaction.orderId}</p>
                  <p className="text-xs text-gray-500">{interaction.client}</p>
                  <p className="text-sm text-gray-600 mt-1">{interaction.action}</p>
                  <p className="text-xs text-gray-400 mt-1">{interaction.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Client Feedback */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Feedback dos Clientes</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {clientFeedback.map((feedback, index) => (
            <div key={index} className="text-center">
              <div className="flex items-center justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`text-lg ${
                    i < feedback.rating ? 'text-yellow-400' : 'text-gray-300'
                  }`}>
                    ★
                  </span>
                ))}
              </div>
              <p className="text-sm font-medium text-gray-900">{feedback.count} avaliações</p>
              <p className="text-xs text-gray-500">{feedback.percentage}%</p>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Média Geral</span>
            <span>4.2/5.0</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '84%' }}></div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações de Follow-up</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Package size={24} className="text-blue-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Ver Pedidos</span>
          </button>
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <MessageSquare size={24} className="text-green-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Contatar Cliente</span>
          </button>
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <AlertTriangle size={24} className="text-red-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Reclamações</span>
          </button>
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <TrendingUp size={24} className="text-purple-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Relatórios</span>
          </button>
        </div>
      </div>
    </div>
  );
}
