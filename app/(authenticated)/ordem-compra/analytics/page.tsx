"use client";

import { useAuth } from '@/components/AuthContext';
import { BarChart3, ShoppingCart, Clock, CheckCircle, AlertTriangle, DollarSign, TrendingUp, Package, Truck, Calendar } from 'lucide-react';

export default function OrdemCompraAnalyticsPage() {
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

  const ordemCompraMetrics = [
    {
      title: "Ordens de Compra Ativas",
      value: "234",
      change: "+15%",
      icon: ShoppingCart,
      color: "bg-blue-500",
      trend: "up"
    },
    {
      title: "Valor Total em Ordens",
      value: "R$ 2.8M",
      change: "+22%",
      icon: DollarSign,
      color: "bg-green-500",
      trend: "up"
    },
    {
      title: "Tempo Médio de Processamento",
      value: "4.2d",
      change: "-8%",
      icon: Clock,
      color: "bg-purple-500",
      trend: "down"
    },
    {
      title: "Ordens Atrasadas",
      value: "12",
      change: "-18%",
      icon: AlertTriangle,
      color: "bg-red-500",
      trend: "down"
    }
  ];

  const orderStatus = [
    { status: "Aprovadas", count: 156, percentage: 67, color: "bg-green-500" },
    { status: "Em Processamento", count: 45, percentage: 19, color: "bg-blue-500" },
    { status: "Entregues", count: 33, percentage: 14, color: "bg-purple-500" }
  ];

  const topSuppliers = [
    { name: "Fornecedor ABC Ltda", orders: 45, value: "R$ 450.000", rating: 4.8 },
    { name: "Textile Plus", orders: 38, value: "R$ 380.000", rating: 4.6 },
    { name: "Material Supply Co", orders: 32, value: "R$ 320.000", rating: 4.7 },
    { name: "Fabric World", orders: 28, value: "R$ 280.000", rating: 4.5 },
    { name: "Premium Textiles", orders: 25, value: "R$ 250.000", rating: 4.9 }
  ];

  const monthlyOrders = [
    { month: "Jan", orders: 45, value: 450000 },
    { month: "Fev", orders: 52, value: 520000 },
    { month: "Mar", orders: 48, value: 480000 },
    { month: "Abr", orders: 61, value: 610000 },
    { month: "Mai", orders: 58, value: 580000 },
    { month: "Jun", orders: 65, value: 650000 }
  ];

  const deliveryPerformance = [
    { supplier: "Fornecedor ABC Ltda", onTime: 42, delayed: 3, total: 45 },
    { supplier: "Textile Plus", onTime: 35, delayed: 3, total: 38 },
    { supplier: "Material Supply Co", onTime: 30, delayed: 2, total: 32 },
    { supplier: "Fabric World", onTime: 25, delayed: 3, total: 28 },
    { supplier: "Premium Textiles", onTime: 24, delayed: 1, total: 25 }
  ];

  const categorySpending = [
    { category: "Matérias-primas", value: 1200000, percentage: 43 },
    { category: "Equipamentos", value: 850000, percentage: 30 },
    { category: "Serviços", value: 450000, percentage: 16 },
    { category: "Manutenção", value: 300000, percentage: 11 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics - Ordem de Compra</h1>
            <p className="text-sm text-gray-600 mt-1">Análise de compras e fornecedores</p>
          </div>
          <div className="flex items-center space-x-3">
            <BarChart3 size={24} className="text-blue-600" />
            <span className="text-sm text-gray-500">Última atualização: 14:30</span>
          </div>
        </div>
      </div>

      {/* Ordem Compra Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {ordemCompraMetrics.map((metric, index) => {
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

      {/* Order Status Overview */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Status das Ordens de Compra</h3>
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

      {/* Top Suppliers and Monthly Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Suppliers */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Fornecedores</h3>
          <div className="space-y-4">
            {topSuppliers.map((supplier, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-blue-600">{index + 1}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{supplier.name}</p>
                    <p className="text-xs text-gray-500">{supplier.orders} pedidos</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{supplier.value}</p>
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-xs ${
                        i < Math.floor(supplier.rating) ? 'text-yellow-400' : 'text-gray-300'
                      }`}>
                        ★
                      </span>
                    ))}
                    <span className="text-xs text-gray-500 ml-1">{supplier.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Orders */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ordens por Mês</h3>
          <div className="space-y-4">
            {monthlyOrders.map((month, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900 w-12">{month.month}</span>
                <div className="flex-1 mx-4">
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-blue-500 h-4 rounded-full"
                      style={{ width: `${(month.orders / 70) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{month.orders}</p>
                  <p className="text-xs text-green-600">R$ {(month.value / 1000).toFixed(0)}K</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Delivery Performance and Category Spending */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Delivery Performance */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance de Entrega por Fornecedor</h3>
          <div className="space-y-4">
            {deliveryPerformance.map((supplier, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{supplier.supplier}</p>
                  <p className="text-xs text-gray-500">
                    {supplier.onTime} no prazo, {supplier.delayed} atrasados
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">
                    {((supplier.onTime / supplier.total) * 100).toFixed(1)}%
                  </p>
                  <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(supplier.onTime / supplier.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Spending */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Gastos por Categoria</h3>
          <div className="space-y-4">
            {categorySpending.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${
                    index === 0 ? 'bg-blue-500' :
                    index === 1 ? 'bg-green-500' :
                    index === 2 ? 'bg-purple-500' : 'bg-orange-500'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-900">{category.category}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">
                    R$ {(category.value / 1000).toFixed(0)}K
                  </p>
                  <p className="text-xs text-gray-500">{category.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Total Gasto</span>
              <span>R$ 2.8M</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações de Ordem de Compra</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <ShoppingCart size={24} className="text-blue-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Nova Ordem</span>
          </button>
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <CheckCircle size={24} className="text-green-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Aprovar Ordens</span>
          </button>
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Truck size={24} className="text-purple-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Acompanhar Entregas</span>
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
