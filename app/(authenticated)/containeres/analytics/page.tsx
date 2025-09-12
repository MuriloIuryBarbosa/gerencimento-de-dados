"use client";

import { useAuth } from '@/components/AuthContext';
import { BarChart3, Package, Truck, MapPin, Clock, CheckCircle, AlertTriangle, TrendingUp, Ship, Calendar } from 'lucide-react';

export default function ContaineresAnalyticsPage() {
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

  const containeresMetrics = [
    {
      title: "Containeres Ativos",
      value: "67",
      change: "+8%",
      icon: Package,
      color: "bg-blue-500",
      trend: "up"
    },
    {
      title: "Volume Total Transportado",
      value: "1,247 m³",
      change: "+15%",
      icon: Ship,
      color: "bg-green-500",
      trend: "up"
    },
    {
      title: "Tempo Médio de Trânsito",
      value: "18d",
      change: "-5%",
      icon: Clock,
      color: "bg-purple-500",
      trend: "down"
    },
    {
      title: "Containeres Atrasados",
      value: "5",
      change: "-25%",
      icon: AlertTriangle,
      color: "bg-red-500",
      trend: "down"
    }
  ];

  const containerStatus = [
    { status: "Em Trânsito", count: 35, percentage: 52, color: "bg-blue-500" },
    { status: "Entregues", count: 25, percentage: 37, color: "bg-green-500" },
    { status: "Aguardando Embarque", count: 7, percentage: 11, color: "bg-yellow-500" }
  ];

  const shippingRoutes = [
    { route: "São Paulo → Miami", containers: 12, avgTime: "16d", reliability: 95 },
    { route: "Rio → Rotterdam", containers: 8, avgTime: "22d", reliability: 92 },
    { route: "Salvador → Shanghai", containers: 15, avgTime: "28d", reliability: 88 },
    { route: "Recife → Los Angeles", containers: 6, avgTime: "19d", reliability: 96 },
    { route: "Porto Alegre → Hamburgo", containers: 9, avgTime: "24d", reliability: 90 }
  ];

  const monthlyShipments = [
    { month: "Jan", containers: 18, volume: 450 },
    { month: "Fev", containers: 22, volume: 520 },
    { month: "Mar", containers: 19, volume: 480 },
    { month: "Abr", containers: 25, volume: 610 },
    { month: "Mai", containers: 23, volume: 580 },
    { month: "Jun", containers: 28, volume: 650 }
  ];

  const carrierPerformance = [
    { carrier: "Maersk Line", containers: 18, onTime: 17, avgDelay: 0.5 },
    { carrier: "MSC Shipping", containers: 15, onTime: 14, avgDelay: 1.2 },
    { carrier: "CMA CGM", containers: 12, onTime: 11, avgDelay: 0.8 },
    { carrier: "Hapag-Lloyd", containers: 10, onTime: 9, avgDelay: 1.5 },
    { carrier: "COSCO", containers: 8, onTime: 7, avgDelay: 0.3 }
  ];

  const portPerformance = [
    { port: "Porto de Santos", throughput: 145, avgWait: "2.3d", efficiency: 94 },
    { port: "Porto do Rio", throughput: 98, avgWait: "1.8d", efficiency: 96 },
    { port: "Porto de Salvador", throughput: 76, avgWait: "3.1d", efficiency: 89 },
    { port: "Porto de Recife", throughput: 54, avgWait: "2.7d", efficiency: 91 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics - Containeres</h1>
            <p className="text-sm text-gray-600 mt-1">Gestão logística e acompanhamento de embarques</p>
          </div>
          <div className="flex items-center space-x-3">
            <BarChart3 size={24} className="text-blue-600" />
            <span className="text-sm text-gray-500">Última atualização: 14:30</span>
          </div>
        </div>
      </div>

      {/* Containeres Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {containeresMetrics.map((metric, index) => {
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

      {/* Container Status Overview */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Status dos Containeres</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {containerStatus.map((status, index) => (
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

      {/* Shipping Routes and Monthly Shipments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shipping Routes */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Rotas de Embarque</h3>
          <div className="space-y-4">
            {shippingRoutes.map((route, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                <div className="flex items-center space-x-3">
                  <MapPin size={16} className="text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{route.route}</p>
                    <p className="text-xs text-gray-500">{route.containers} containers</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{route.avgTime}</p>
                  <p className="text-xs text-green-600">{route.reliability}% confiabilidade</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Shipments */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Embarques por Mês</h3>
          <div className="space-y-4">
            {monthlyShipments.map((month, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900 w-12">{month.month}</span>
                <div className="flex-1 mx-4">
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-blue-500 h-4 rounded-full"
                      style={{ width: `${(month.containers / 30) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{month.containers}</p>
                  <p className="text-xs text-green-600">{month.volume}m³</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Carrier Performance and Port Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Carrier Performance */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance das Transportadoras</h3>
          <div className="space-y-4">
            {carrierPerformance.map((carrier, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{carrier.carrier}</p>
                  <p className="text-xs text-gray-500">
                    {carrier.onTime}/{carrier.containers} no prazo
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">
                    {((carrier.onTime / carrier.containers) * 100).toFixed(1)}%
                  </p>
                  <p className="text-xs text-orange-600">{carrier.avgDelay}d atraso médio</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Port Performance */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance dos Portos</h3>
          <div className="space-y-4">
            {portPerformance.map((port, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Ship size={16} className="text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{port.port}</p>
                    <p className="text-xs text-gray-500">{port.throughput} containers/mês</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{port.avgWait}</p>
                  <p className="text-xs text-blue-600">{port.efficiency}% eficiência</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transit Time Analysis */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Análise de Tempo de Trânsito</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircle size={24} className="text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">62</p>
            <p className="text-sm text-gray-600">Containeres no Prazo</p>
            <p className="text-xs text-green-600">92.5%</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Clock size={24} className="text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">3</p>
            <p className="text-sm text-gray-600">Levemente Atrasados</p>
            <p className="text-xs text-yellow-600">4.5%</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <AlertTriangle size={24} className="text-red-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">2</p>
            <p className="text-sm text-gray-600">Significativamente Atrasados</p>
            <p className="text-xs text-red-600">3.0%</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações de Containeres</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Package size={24} className="text-blue-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Novo Container</span>
          </button>
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Truck size={24} className="text-green-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Rastrear Embarques</span>
          </button>
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <MapPin size={24} className="text-purple-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Otimizar Rotas</span>
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
