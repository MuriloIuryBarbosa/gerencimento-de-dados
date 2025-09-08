"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  Shield,
  FileText,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart,
  Calendar,
  UserPlus,
  Settings,
  Database
} from 'lucide-react';
import { useLanguage } from '../../../components/LanguageContext';
import { useNotification } from '../../../components/Notification';

interface Estatistica {
  titulo: string;
  valor: number | string;
  icone: React.ComponentType<any>;
  cor: string;
  tendencia?: {
    valor: number;
    tipo: 'aumento' | 'diminuicao';
  };
}

interface AtividadeRecente {
  id: string;
  tipo: 'usuario' | 'permissao' | 'sistema' | 'log';
  descricao: string;
  usuario: string;
  data: string;
  status: 'sucesso' | 'erro' | 'aviso';
}

interface AlertaSistema {
  id: string;
  tipo: 'critico' | 'aviso' | 'info';
  titulo: string;
  mensagem: string;
  data: string;
  resolvido: boolean;
}

export default function AdminDashboardPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [estatisticas, setEstatisticas] = useState<Estatistica[]>([]);
  const [atividadesRecentes, setAtividadesRecentes] = useState<AtividadeRecente[]>([]);
  const [alertasSistema, setAlertasSistema] = useState<AlertaSistema[]>([]);

  useEffect(() => {
    const carregarDashboard = async () => {
      try {
        // Simulação de dados do dashboard
        const mockEstatisticas: Estatistica[] = [
          {
            titulo: "Total de Usuários",
            valor: 156,
            icone: Users,
            cor: "bg-blue-500",
            tendencia: { valor: 12, tipo: 'aumento' }
          },
          {
            titulo: "Administradores",
            valor: 8,
            icone: Shield,
            cor: "bg-green-500",
            tendencia: { valor: 2, tipo: 'aumento' }
          },
          {
            titulo: "Logs Hoje",
            valor: 1247,
            icone: FileText,
            cor: "bg-yellow-500",
            tendencia: { valor: 8, tipo: 'diminuicao' }
          },
          {
            titulo: "Atividades do Sistema",
            valor: "98.5%",
            icone: Activity,
            cor: "bg-purple-500"
          },
          {
            titulo: "Ordens de Compra",
            valor: 89,
            icone: BarChart3,
            cor: "bg-indigo-500",
            tendencia: { valor: 15, tipo: 'aumento' }
          },
          {
            titulo: "Proformas Ativas",
            valor: 34,
            icone: PieChart,
            cor: "bg-red-500",
            tendencia: { valor: 5, tipo: 'diminuicao' }
          }
        ];

        const mockAtividades: AtividadeRecente[] = [
          {
            id: '1',
            tipo: 'usuario',
            descricao: 'Novo usuário criado: Maria Silva',
            usuario: 'João Admin',
            data: '2024-12-19 14:30:00',
            status: 'sucesso'
          },
          {
            id: '2',
            tipo: 'permissao',
            descricao: 'Permissões atualizadas para o usuário Pedro Santos',
            usuario: 'João Admin',
            data: '2024-12-19 13:45:00',
            status: 'sucesso'
          },
          {
            id: '3',
            tipo: 'sistema',
            descricao: 'Backup do banco de dados concluído',
            usuario: 'Sistema',
            data: '2024-12-19 12:00:00',
            status: 'sucesso'
          },
          {
            id: '4',
            tipo: 'log',
            descricao: 'Tentativa de acesso não autorizado detectada',
            usuario: 'Sistema',
            data: '2024-12-19 11:30:00',
            status: 'aviso'
          },
          {
            id: '5',
            tipo: 'usuario',
            descricao: 'Usuário Ana Costa desativado',
            usuario: 'João Admin',
            data: '2024-12-19 10:15:00',
            status: 'aviso'
          }
        ];

        const mockAlertas: AlertaSistema[] = [
          {
            id: '1',
            tipo: 'critico',
            titulo: 'Espaço em Disco Baixo',
            mensagem: 'O servidor está com apenas 15% de espaço em disco disponível.',
            data: '2024-12-19 09:00:00',
            resolvido: false
          },
          {
            id: '2',
            tipo: 'aviso',
            titulo: 'Múltiplas Tentativas de Login',
            mensagem: 'Detectadas 5 tentativas de login falhadas para o usuário admin.',
            data: '2024-12-19 08:30:00',
            resolvido: false
          },
          {
            id: '3',
            tipo: 'info',
            titulo: 'Atualização do Sistema',
            mensagem: 'Nova versão do sistema disponível para instalação.',
            data: '2024-12-18 16:00:00',
            resolvido: true
          }
        ];

        setEstatisticas(mockEstatisticas);
        setAtividadesRecentes(mockAtividades);
        setAlertasSistema(mockAlertas);

        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
        showNotification('error', 'Erro ao carregar dados do dashboard');
      } finally {
        setLoading(false);
      }
    };

    carregarDashboard();
  }, [showNotification]);

  const getStatusIcon = (status: AtividadeRecente['status']) => {
    switch (status) {
      case 'sucesso':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'erro':
        return <AlertTriangle size={16} className="text-red-500" />;
      case 'aviso':
        return <Clock size={16} className="text-yellow-500" />;
    }
  };

  const getAlertaIcon = (tipo: AlertaSistema['tipo']) => {
    switch (tipo) {
      case 'critico':
        return <AlertTriangle size={20} className="text-red-500" />;
      case 'aviso':
        return <Clock size={20} className="text-yellow-500" />;
      case 'info':
        return <CheckCircle size={20} className="text-blue-500" />;
    }
  };

  const getAlertaCor = (tipo: AlertaSistema['tipo']) => {
    switch (tipo) {
      case 'critico':
        return 'border-red-200 bg-red-50';
      case 'aviso':
        return 'border-yellow-200 bg-yellow-50';
      case 'info':
        return 'border-blue-200 bg-blue-50';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <BarChart3 size={24} className="text-gray-600" />
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Administrativo</h1>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.push('/admin/logs')}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FileText size={16} />
                <span>Ver Logs</span>
              </button>
              <button
                onClick={() => router.push('/admin/usuarios')}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Users size={16} />
                <span>Gerenciar Usuários</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          {estatisticas.map((estatistica, index) => {
            const Icon = estatistica.icone;
            return (
              <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{estatistica.titulo}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{estatistica.valor}</p>
                    {estatistica.tendencia && (
                      <div className="flex items-center mt-2">
                        <TrendingUp
                          size={14}
                          className={estatistica.tendencia.tipo === 'aumento' ? 'text-green-500' : 'text-red-500'}
                        />
                        <span className={`text-xs ml-1 ${
                          estatistica.tendencia.tipo === 'aumento' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {estatistica.tendencia.tipo === 'aumento' ? '+' : '-'}{estatistica.tendencia.valor}%
                        </span>
                      </div>
                    )}
                  </div>
                  <div className={`p-3 rounded-lg ${estatistica.cor}`}>
                    <Icon size={24} className="text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Atividades Recentes */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Atividades Recentes</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {atividadesRecentes.map((atividade) => (
                  <div key={atividade.id} className="flex items-start space-x-3">
                    {getStatusIcon(atividade.status)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{atividade.descricao}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-gray-500">{atividade.usuario}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">
                          {new Date(atividade.data).toLocaleString('pt-BR')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <button
                  onClick={() => router.push('/admin/logs')}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Ver todas as atividades →
                </button>
              </div>
            </div>
          </div>

          {/* Alertas do Sistema */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Alertas do Sistema</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {alertasSistema.map((alerta) => (
                  <div key={alerta.id} className={`p-4 rounded-lg border ${getAlertaCor(alerta.tipo)}`}>
                    <div className="flex items-start space-x-3">
                      {getAlertaIcon(alerta.tipo)}
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900">{alerta.titulo}</h3>
                        <p className="text-sm text-gray-600 mt-1">{alerta.mensagem}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">
                            {new Date(alerta.data).toLocaleString('pt-BR')}
                          </span>
                          {alerta.resolvido && (
                            <span className="text-xs text-green-600 font-medium">Resolvido</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <button
                  onClick={() => router.push('/admin/logs')}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Ver todos os alertas →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Ações Rápidas</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => router.push('/admin/usuarios')}
                className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <UserPlus size={20} className="text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Novo Usuário</p>
                  <p className="text-xs text-gray-500">Criar conta de usuário</p>
                </div>
              </button>

              <button
                onClick={() => router.push('/admin/permissoes-dinamicas')}
                className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Shield size={20} className="text-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Gerenciar Permissões</p>
                  <p className="text-xs text-gray-500">Atribuir permissões</p>
                </div>
              </button>

              <button
                onClick={() => router.push('/admin/logs')}
                className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FileText size={20} className="text-yellow-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Verificar Logs</p>
                  <p className="text-xs text-gray-500">Auditoria do sistema</p>
                </div>
              </button>

              <button
                onClick={() => router.push('/settings')}
                className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Settings size={20} className="text-purple-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Configurações</p>
                  <p className="text-xs text-gray-500">Ajustes do sistema</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
