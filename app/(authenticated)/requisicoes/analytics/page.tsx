"use client";

import { useAuth } from '@/components/AuthContext';
import { BarChart3, FileText, Clock, CheckCircle, AlertTriangle, Users, TrendingUp, Activity, MessageSquare, Calendar } from 'lucide-react';

export default function RequisicoesAnalyticsPage() {
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

  const requisitionsMetrics = [
    {
      title: "Requisições Ativas",
      value: "156",
      change: "+18%",
      icon: FileText,
      color: "bg-blue-500",
      trend: "up"
    },
    {
      title: "Tempo Médio de Aprovação",
      value: "3.2d",
      change: "-12%",
      icon: Clock,
      color: "bg-green-500",
      trend: "down"
    },
    {
      title: "Taxa de Aprovação",
      value: "87%",
      change: "+5%",
      icon: CheckCircle,
      color: "bg-purple-500",
      trend: "up"
    },
    {
      title: "Requisições Pendentes",
      value: "23",
      change: "-8%",
      icon: AlertTriangle,
      color: "bg-red-500",
      trend: "down"
    }
  ];

  const requestStatus = [
    { status: "Aprovadas", count: 89, percentage: 57, color: "bg-green-500" },
    { status: "Em Análise", count: 34, percentage: 22, color: "bg-yellow-500" },
    { status: "Rejeitadas", count: 23, percentage: 15, color: "bg-red-500" },
    { status: "Rascunho", count: 10, percentage: 6, color: "bg-gray-500" }
  ];

  const departmentRequests = [
    { department: "Produção", count: 45, approved: 38, pending: 7 },
    { department: "Vendas", count: 32, approved: 29, pending: 3 },
    { department: "Logística", count: 28, approved: 22, pending: 6 },
    { department: "TI", count: 18, approved: 15, pending: 3 },
    { department: "RH", count: 15, approved: 12, pending: 3 },
    { department: "Financeiro", count: 12, approved: 10, pending: 2 }
  ];

  const recentRequests = [
    {
      id: "REQ-2024-001",
      title: "Compra de Equipamentos de Produção",
      requester: "João Silva",
      department: "Produção",
      status: "approved",
      amount: "R$ 150.000",
      submitted: "2 dias atrás"
    },
    {
      id: "REQ-2024-002",
      title: "Software de Gestão",
      requester: "Maria Santos",
      department: "TI",
      status: "pending",
      amount: "R$ 25.000",
      submitted: "1 dia atrás"
    },
    {
      id: "REQ-2024-003",
      title: "Treinamento da Equipe",
      requester: "Carlos Oliveira",
      department: "RH",
      status: "approved",
      amount: "R$ 8.500",
      submitted: "3 dias atrás"
    },
    {
      id: "REQ-2024-004",
      title: "Reforma do Escritório",
      requester: "Ana Costa",
      department: "Administração",
      status: "rejected",
      amount: "R$ 75.000",
      submitted: "5 dias atrás"
    }
  ];

  const approvalWorkflow = [
    { step: "Submetida", count: 156, avgTime: "0h" },
    { step: "Análise Inicial", count: 134, avgTime: "4h" },
    { step: "Aprovação Gestor", count: 112, avgTime: "1.5d" },
    { step: "Aprovação Diretoria", count: 89, avgTime: "2.3d" },
    { step: "Finalizada", count: 89, avgTime: "3.2d" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics - Requisições</h1>
            <p className="text-sm text-gray-600 mt-1">Gestão e análise de solicitações internas</p>
          </div>
          <div className="flex items-center space-x-3">
            <BarChart3 size={24} className="text-blue-600" />
            <span className="text-sm text-gray-500">Última atualização: 14:30</span>
          </div>
        </div>
      </div>

      {/* Requisitions Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {requisitionsMetrics.map((metric, index) => {
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

      {/* Request Status Overview */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Status das Requisições</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {requestStatus.map((status, index) => (
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

      {/* Department Requests and Recent Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Requests */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Requisições por Departamento</h3>
          <div className="space-y-4">
            {departmentRequests.map((dept, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{dept.department}</p>
                  <p className="text-xs text-gray-500">{dept.approved} aprovadas, {dept.pending} pendentes</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{dept.count}</p>
                  <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(dept.approved / dept.count) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Requests */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Requisições Recentes</h3>
          <div className="space-y-4">
            {recentRequests.map((request, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 border border-gray-100 rounded-lg">
                <div className={`p-2 rounded-full ${
                  request.status === 'approved' ? 'bg-green-100' :
                  request.status === 'pending' ? 'bg-yellow-100' : 'bg-red-100'
                }`}>
                  {request.status === 'approved' ? (
                    <CheckCircle size={16} className="text-green-600" />
                  ) : request.status === 'pending' ? (
                    <Clock size={16} className="text-yellow-600" />
                  ) : (
                    <AlertTriangle size={16} className="text-red-600" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900">{request.id}</p>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      request.status === 'approved' ? 'bg-green-100 text-green-600' :
                      request.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                      {request.status === 'approved' ? 'Aprovada' :
                       request.status === 'pending' ? 'Pendente' : 'Rejeitada'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{request.title}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{request.requester} • {request.department}</span>
                    <span>{request.amount} • {request.submitted}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Approval Workflow */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Fluxo de Aprovação</h3>
        <div className="overflow-x-auto">
          <div className="min-w-full">
            <div className="grid grid-cols-5 gap-4">
              {approvalWorkflow.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="relative">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-sm font-bold text-blue-600">{step.count}</span>
                    </div>
                    {index < approvalWorkflow.length - 1 && (
                      <div className="absolute top-6 left-full w-full h-0.5 bg-gray-300 transform -translate-x-6"></div>
                    )}
                  </div>
                  <p className="text-xs font-medium text-gray-900 mb-1">{step.step}</p>
                  <p className="text-xs text-gray-500">Tempo médio: {step.avgTime}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações de Requisições</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <FileText size={24} className="text-blue-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Nova Requisição</span>
          </button>
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <CheckCircle size={24} className="text-green-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Aprovar/Rejeitar</span>
          </button>
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <MessageSquare size={24} className="text-purple-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Comentários</span>
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
