"use client";

import { useAuth } from '@/components/AuthContext';
import { BarChart3, Package, Palette, Truck, Home, ShoppingCart, Ruler, Building2, Warehouse, Archive, TrendingUp, Users, Activity } from 'lucide-react';

export default function CadastroAnalyticsPage() {
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

  const stats = [
    {
      title: "Total de SKUs",
      value: "1,247",
      change: "+12%",
      icon: Package,
      color: "bg-blue-500"
    },
    {
      title: "Cores Cadastradas",
      value: "89",
      change: "+5%",
      icon: Palette,
      color: "bg-green-500"
    },
    {
      title: "Fornecedores Ativos",
      value: "156",
      change: "+8%",
      icon: ShoppingCart,
      color: "bg-purple-500"
    },
    {
      title: "Clientes Registrados",
      value: "2,341",
      change: "+15%",
      icon: Users,
      color: "bg-orange-500"
    },
    {
      title: "Transportadoras",
      value: "23",
      change: "+2%",
      icon: Truck,
      color: "bg-red-500"
    },
    {
      title: "Depósitos",
      value: "12",
      change: "0%",
      icon: Warehouse,
      color: "bg-indigo-500"
    }
  ];

  const recentActivities = [
    { action: "Novo SKU cadastrado", item: "SKU-2024-001", time: "2 min atrás", type: "create" },
    { action: "Fornecedor atualizado", item: "ABC Textiles Ltda", time: "15 min atrás", type: "update" },
    { action: "Nova cor adicionada", item: "Azul Marinho 500", time: "1h atrás", type: "create" },
    { action: "Cliente removido", item: "Cliente XYZ Corp", time: "2h atrás", type: "delete" },
    { action: "Transportadora atualizada", item: "Fast Logistics", time: "3h atrás", type: "update" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics - Cadastro</h1>
            <p className="text-sm text-gray-600 mt-1">Visão geral dos dados cadastrais do sistema</p>
          </div>
          <div className="flex items-center space-x-3">
            <BarChart3 size={24} className="text-blue-600" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className={`text-sm flex items-center mt-1 ${
                    stat.change.startsWith('+') ? 'text-green-600' : 
                    stat.change === '0%' ? 'text-gray-500' : 'text-red-600'
                  }`}>
                    <TrendingUp size={14} className="mr-1" />
                    {stat.change} vs mês anterior
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon size={24} className="text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts and Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Chart Placeholder */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Atividades Recentes</h3>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${
                    activity.type === 'create' ? 'bg-green-100' :
                    activity.type === 'update' ? 'bg-blue-100' : 'bg-red-100'
                  }`}>
                    <Activity size={16} className={
                      activity.type === 'create' ? 'text-green-600' :
                      activity.type === 'update' ? 'text-blue-600' : 'text-red-600'
                    } />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.item}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo por Categoria</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Package size={20} className="text-blue-600" />
                <span className="text-sm font-medium text-gray-900">Produtos/SKUs</span>
              </div>
              <span className="text-sm font-bold text-gray-900">1,247</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Palette size={20} className="text-green-600" />
                <span className="text-sm font-medium text-gray-900">Cores</span>
              </div>
              <span className="text-sm font-bold text-gray-900">89</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <ShoppingCart size={20} className="text-purple-600" />
                <span className="text-sm font-medium text-gray-900">Fornecedores</span>
              </div>
              <span className="text-sm font-bold text-gray-900">156</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Home size={20} className="text-orange-600" />
                <span className="text-sm font-medium text-gray-900">Clientes</span>
              </div>
              <span className="text-sm font-bold text-gray-900">2,341</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Truck size={20} className="text-red-600" />
                <span className="text-sm font-medium text-gray-900">Transportadoras</span>
              </div>
              <span className="text-sm font-bold text-gray-900">23</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Package size={24} className="text-blue-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Novo SKU</span>
          </button>
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Palette size={24} className="text-green-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Nova Cor</span>
          </button>
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <ShoppingCart size={24} className="text-purple-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Novo Fornecedor</span>
          </button>
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Home size={24} className="text-orange-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Novo Cliente</span>
          </button>
        </div>
      </div>
    </div>
  );
}
