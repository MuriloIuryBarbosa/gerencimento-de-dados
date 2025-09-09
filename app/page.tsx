"use client";

import { useLanguage } from "../components/LanguageContext";
import ProtectedRoute from "../components/ProtectedRoute";
import { BarChart3, Package, ShoppingCart, AlertTriangle, TrendingUp, Users, FileText, Truck } from 'lucide-react';

export default function Home() {
  const { t } = useLanguage();

  const stats = [
    {
      title: "Total de SKUs",
      value: "247",
      change: "+12%",
      changeType: "positive",
      icon: Package,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Ordens Ativas",
      value: "32",
      change: "+8%",
      changeType: "positive",
      icon: ShoppingCart,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Requisições Pendentes",
      value: "12",
      change: "-3%",
      changeType: "negative",
      icon: FileText,
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      title: "Valor em Estoque",
      value: "R$ 1.2M",
      change: "+15%",
      changeType: "positive",
      icon: TrendingUp,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  const modules = [
    {
      name: "Cadastro",
      description: "Gestão de cadastros básicos do sistema",
      icon: "📝",
      color: "from-purple-500 to-purple-600",
      items: [
        { name: "SKUs", href: "/cadastro/skus", icon: "🏷️" },
        { name: "Cores", href: "/cadastro/cores", icon: "🎨" },
        { name: "Clientes", href: "/cadastro/clientes", icon: "👥" },
        { name: "Fornecedores", href: "/cadastro/fornecedores", icon: "🏭" },
        { name: "Representantes", href: "/cadastro/representantes", icon: "🤝" },
        { name: "Transportadoras", href: "/cadastro/transportadoras", icon: "🚛" }
      ]
    },
    {
      name: "Executivo",
      description: "Gestão de produtos, preços e operações",
      icon: "💼",
      color: "from-green-500 to-green-600",
      items: [
        { name: "SKUs", href: "/executivo/skus", icon: "🏷️" },
        { name: "Preços", href: "/executivo/precos", icon: "💰" },
        { name: "Estoque", href: "/executivo/estoque", icon: "📦" },
        { name: "Cores", href: "/executivo/cores", icon: "🎨" }
      ]
    },
    {
      name: "Planejamento",
      description: "Gestão de ordens, proformas e logística",
      icon: "📊",
      color: "from-blue-500 to-blue-600",
      items: [
        { name: "Ordens de Compra", href: "/ordem-compra", icon: "📋" },
        { name: "Proformas", href: "/proforma", icon: "📄" },
        { name: "Requisições", href: "/requisicoes", icon: "📝" },
        { name: "Conteineres", href: "/conteineres", icon: "📦" },
        { name: "Follow Up", href: "/followup", icon: "🚛" }
      ]
    }
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header com gradiente */}
        <header className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-8">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
                <p className="text-blue-100 text-lg">Visão geral do sistema de gerenciamento</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white">
                  <div className="flex items-center space-x-2">
                    <Users size={24} />
                    <div>
                      <p className="text-sm opacity-90">Usuários Ativos</p>
                      <p className="text-2xl font-bold">24</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
          {/* Cards de Métricas */}
          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className={`${stat.bgColor} overflow-hidden shadow-lg rounded-xl border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                        <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                        <div className="flex items-center">
                          <span className={`text-sm font-medium ${
                            stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {stat.change}
                          </span>
                          <span className="text-sm text-gray-500 ml-2">vs mês anterior</span>
                        </div>
                      </div>
                      <div className={`p-3 rounded-full bg-gradient-to-r ${stat.color} shadow-lg`}>
                        <IconComponent size={24} className="text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Módulos do Sistema */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
              <BarChart3 className="mr-3 text-blue-600" size={32} />
              Módulos do Sistema
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {modules.map((module, index) => (
                <div key={index} className="bg-white shadow-xl rounded-xl border border-gray-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className={`bg-gradient-to-r ${module.color} p-6 rounded-t-xl`}>
                    <div className="flex items-center">
                      <div className="text-4xl mr-4">{module.icon}</div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{module.name}</h3>
                        <p className="text-white/80 text-sm">{module.description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-3">
                      {module.items.map((item, itemIndex) => (
                        <a
                          key={itemIndex}
                          href={item.href}
                          className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200 group"
                        >
                          <span className="text-lg mr-3 group-hover:scale-110 transition-transform duration-200">
                            {item.icon}
                          </span>
                          <span className="font-medium group-hover:text-blue-600 transition-colors duration-200">
                            {item.name}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Grid de Informações Adicionais */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Atividades Recentes */}
            <div className="bg-white shadow-xl rounded-xl border border-gray-200">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-t-xl">
                <h3 className="text-xl font-bold text-white flex items-center">
                  <AlertTriangle className="mr-3" size={24} />
                  Atividades Recentes
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                      📋
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Nova ordem de compra criada</p>
                      <p className="text-sm text-gray-600">OC-2025-001 • Há 2 horas</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
                      ✅
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Requisição aprovada</p>
                      <p className="text-sm text-gray-600">REQ-2025-001 • Há 4 horas</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex-shrink-0 w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-white">
                      ⚠️
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Alerta: Estoque baixo</p>
                      <p className="text-sm text-gray-600">3 produtos • Há 6 horas</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dicas do Sistema */}
            <div className="bg-white shadow-xl rounded-xl border border-gray-200">
              <div className="bg-gradient-to-r from-green-500 to-teal-600 p-6 rounded-t-xl">
                <h3 className="text-xl font-bold text-white flex items-center">
                  <TrendingUp className="mr-3" size={24} />
                  Dicas do Sistema
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      💡
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Navegação Inteligente</p>
                      <p className="text-sm text-gray-600">Use o menu lateral para navegar rapidamente entre módulos</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      �
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Módulo Cadastro</p>
                      <p className="text-sm text-gray-600">Gerencie todos os cadastros básicos do sistema</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      💼
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Módulo Executivo</p>
                      <p className="text-sm text-gray-600">Controle produtos, preços e operações</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      �
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Módulo Planejamento</p>
                      <p className="text-sm text-gray-600">Gerencie pedidos, proformas e logística</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
