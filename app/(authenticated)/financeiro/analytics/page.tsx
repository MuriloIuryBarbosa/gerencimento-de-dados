"use client";

import { useAuth } from '@/components/AuthContext';
import { BarChart3, DollarSign, TrendingUp, TrendingDown, CreditCard, Receipt, PiggyBank, AlertCircle, CheckCircle, Clock } from 'lucide-react';

export default function FinanceiroAnalyticsPage() {
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

  const financialMetrics = [
    {
      title: "Receita Líquida",
      value: "R$ 2.4M",
      change: "+18%",
      icon: DollarSign,
      color: "bg-green-500",
      trend: "up"
    },
    {
      title: "Lucro Bruto",
      value: "R$ 890K",
      change: "+22%",
      icon: TrendingUp,
      color: "bg-blue-500",
      trend: "up"
    },
    {
      title: "Contas a Receber",
      value: "R$ 156K",
      change: "-5%",
      icon: CreditCard,
      color: "bg-orange-500",
      trend: "down"
    },
    {
      title: "Contas a Pagar",
      value: "R$ 234K",
      change: "+8%",
      icon: Receipt,
      color: "bg-red-500",
      trend: "up"
    }
  ];

  const cashFlow = [
    { month: "Jan", inflow: 450000, outflow: 380000 },
    { month: "Fev", inflow: 520000, outflow: 410000 },
    { month: "Mar", inflow: 480000, outflow: 420000 },
    { month: "Abr", inflow: 610000, outflow: 450000 },
    { month: "Mai", inflow: 580000, outflow: 430000 },
    { month: "Jun", inflow: 650000, outflow: 470000 }
  ];

  const pendingPayments = [
    {
      id: "PAY-001",
      description: "Pagamento Fornecedor ABC",
      amount: "R$ 45,230",
      dueDate: "2024-01-15",
      status: "pending",
      priority: "high"
    },
    {
      id: "PAY-002",
      description: "Salários Janeiro",
      amount: "R$ 125,000",
      dueDate: "2024-01-20",
      status: "pending",
      priority: "high"
    },
    {
      id: "PAY-003",
      description: "Aluguel Escritório",
      amount: "R$ 15,500",
      dueDate: "2024-01-25",
      status: "upcoming",
      priority: "medium"
    },
    {
      id: "PAY-004",
      description: "Manutenção Equipamentos",
      amount: "R$ 8,900",
      dueDate: "2024-02-01",
      status: "upcoming",
      priority: "low"
    }
  ];

  const budgetVsActual = [
    { category: "Vendas", budget: 2400000, actual: 2420000, variance: 20000 },
    { category: "Custos Operacionais", budget: 1800000, actual: 1750000, variance: -50000 },
    { category: "Marketing", budget: 150000, actual: 165000, variance: 15000 },
    { category: "P&D", budget: 200000, actual: 195000, variance: -5000 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics - Financeiro</h1>
            <p className="text-sm text-gray-600 mt-1">Análise financeira e controle orçamentário</p>
          </div>
          <div className="flex items-center space-x-3">
            <BarChart3 size={24} className="text-blue-600" />
            <span className="text-sm text-gray-500">Última atualização: 14:30</span>
          </div>
        </div>
      </div>

      {/* Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {financialMetrics.map((metric, index) => {
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
                    {metric.trend === 'up' ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
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

      {/* Budget vs Actual */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Orçamento vs Realizado</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Categoria</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">Orçamento</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">Realizado</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">Variação</th>
              </tr>
            </thead>
            <tbody>
              {budgetVsActual.map((item, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">{item.category}</td>
                  <td className="py-3 px-4 text-sm text-right text-gray-900">R$ {item.budget.toLocaleString()}</td>
                  <td className="py-3 px-4 text-sm text-right text-gray-900">R$ {item.actual.toLocaleString()}</td>
                  <td className={`py-3 px-4 text-sm text-right font-medium ${
                    item.variance > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {item.variance > 0 ? '+' : ''}R$ {Math.abs(item.variance).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pending Payments and Cash Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Payments */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pagamentos Pendentes</h3>
          <div className="space-y-4">
            {pendingPayments.map((payment, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${
                    payment.priority === 'high' ? 'bg-red-100' :
                    payment.priority === 'medium' ? 'bg-yellow-100' : 'bg-green-100'
                  }`}>
                    {payment.status === 'pending' ? (
                      <AlertCircle size={16} className={
                        payment.priority === 'high' ? 'text-red-600' :
                        payment.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'
                      } />
                    ) : (
                      <Clock size={16} className="text-blue-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{payment.description}</p>
                    <p className="text-xs text-gray-500">Vencimento: {payment.dueDate}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{payment.amount}</p>
                  <p className={`text-xs ${
                    payment.status === 'pending' ? 'text-red-600' : 'text-blue-600'
                  }`}>
                    {payment.status === 'pending' ? 'Pendente' : 'Próximo'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cash Flow Summary */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Fluxo de Caixa - Últimos 6 Meses</h3>
          <div className="space-y-4">
            {cashFlow.map((month, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900 w-12">{month.month}</span>
                <div className="flex-1 mx-4">
                  <div className="flex space-x-1">
                    <div
                      className="bg-green-500 h-4 rounded-l"
                      style={{ width: `${(month.inflow / 700000) * 100}%` }}
                    ></div>
                    <div
                      className="bg-red-500 h-4 rounded-r"
                      style={{ width: `${(month.outflow / 700000) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-green-600">+R$ {(month.inflow / 1000).toFixed(0)}K</p>
                  <p className="text-xs text-red-600">-R$ {(month.outflow / 1000).toFixed(0)}K</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-center space-x-6 text-xs text-gray-500">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Entradas</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span>Saídas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Financeiras</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Receipt size={24} className="text-blue-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Novo Pagamento</span>
          </button>
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <PiggyBank size={24} className="text-green-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Relatório Financeiro</span>
          </button>
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <TrendingUp size={24} className="text-purple-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Projeções</span>
          </button>
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <AlertCircle size={24} className="text-orange-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Alertas</span>
          </button>
        </div>
      </div>
    </div>
  );
}
