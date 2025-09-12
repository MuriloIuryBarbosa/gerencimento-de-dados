"use client";

import { useAuth } from '@/components/AuthContext';
import { BarChart3, Calendar, Target, TrendingUp, Clock, CheckCircle, AlertTriangle, Users, Package, Zap } from 'lucide-react';

export default function PlanejamentoAnalyticsPage() {
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

  const planningMetrics = [
    {
      title: "Projetos Ativos",
      value: "24",
      change: "+15%",
      icon: Target,
      color: "bg-blue-500",
      trend: "up"
    },
    {
      title: "Tarefas Concluídas",
      value: "156",
      change: "+22%",
      icon: CheckCircle,
      color: "bg-green-500",
      trend: "up"
    },
    {
      title: "Projetos Atrasados",
      value: "3",
      change: "-25%",
      icon: AlertTriangle,
      color: "bg-red-500",
      trend: "down"
    },
    {
      title: "Equipe Alocada",
      value: "89%",
      change: "+5%",
      icon: Users,
      color: "bg-purple-500",
      trend: "up"
    }
  ];

  const projectStatus = [
    { status: "Em Andamento", count: 18, percentage: 75, color: "bg-blue-500" },
    { status: "Planejamento", count: 4, percentage: 17, color: "bg-yellow-500" },
    { status: "Concluído", count: 2, percentage: 8, color: "bg-green-500" }
  ];

  const upcomingDeadlines = [
    {
      project: "Lançamento Coleção Verão 2024",
      deadline: "2024-01-20",
      priority: "high",
      progress: 85
    },
    {
      project: "Otimização Supply Chain",
      deadline: "2024-01-25",
      priority: "medium",
      progress: 60
    },
    {
      project: "Implementação Sistema ERP",
      deadline: "2024-02-01",
      priority: "high",
      progress: 45
    },
    {
      project: "Treinamento Equipe",
      deadline: "2024-02-05",
      priority: "low",
      progress: 90
    }
  ];

  const resourceAllocation = [
    { resource: "Equipe Desenvolvimento", allocated: 12, total: 15, utilization: 80 },
    { resource: "Equipe Produção", allocated: 25, total: 30, utilization: 83 },
    { resource: "Equipe Logística", allocated: 8, total: 10, utilization: 80 },
    { resource: "Equipe Vendas", allocated: 18, total: 20, utilization: 90 }
  ];

  const quarterlyGoals = [
    { goal: "Aumentar produção em 20%", progress: 75, target: "Q1 2024" },
    { goal: "Reduzir custos em 15%", progress: 60, target: "Q1 2024" },
    { goal: "Expandir mercado em 25%", progress: 45, target: "Q2 2024" },
    { goal: "Implementar 3 novos produtos", progress: 30, target: "Q2 2024" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics - Planejamento</h1>
            <p className="text-sm text-gray-600 mt-1">Gestão de projetos e planejamento estratégico</p>
          </div>
          <div className="flex items-center space-x-3">
            <BarChart3 size={24} className="text-blue-600" />
            <span className="text-sm text-gray-500">Última atualização: 14:30</span>
          </div>
        </div>
      </div>

      {/* Planning Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {planningMetrics.map((metric, index) => {
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

      {/* Project Status Overview */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Status dos Projetos</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projectStatus.map((status, index) => (
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

      {/* Upcoming Deadlines and Resource Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Deadlines */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Próximos Prazos</h3>
          <div className="space-y-4">
            {upcomingDeadlines.map((deadline, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar size={16} className="text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">{deadline.deadline}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      deadline.priority === 'high' ? 'bg-red-100 text-red-600' :
                      deadline.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      {deadline.priority === 'high' ? 'Alta' : deadline.priority === 'medium' ? 'Média' : 'Baixa'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{deadline.project}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${deadline.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{deadline.progress}% concluído</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resource Allocation */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Alocação de Recursos</h3>
          <div className="space-y-4">
            {resourceAllocation.map((resource, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{resource.resource}</p>
                  <p className="text-xs text-gray-500">{resource.allocated}/{resource.total} alocados</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{resource.utilization}%</p>
                  <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className={`h-2 rounded-full ${
                        resource.utilization >= 90 ? 'bg-red-500' :
                        resource.utilization >= 80 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${resource.utilization}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quarterly Goals */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Metas Trimestrais</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quarterlyGoals.map((goal, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">{goal.target}</span>
                <span className="text-sm text-gray-500">{goal.progress}%</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{goal.goal}</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    goal.progress >= 75 ? 'bg-green-500' :
                    goal.progress >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${goal.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações de Planejamento</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Target size={24} className="text-blue-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Novo Projeto</span>
          </button>
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Calendar size={24} className="text-green-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Cronograma</span>
          </button>
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Users size={24} className="text-purple-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Recursos</span>
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
