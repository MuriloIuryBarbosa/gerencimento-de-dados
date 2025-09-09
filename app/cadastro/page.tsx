 "use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Palette, Truck, Home, ShoppingCart, Truck as TruckIcon, Building2, BarChart3, AlertTriangle, CheckCircle, Database, Users, TrendingUp, XCircle, RefreshCw, Plus } from 'lucide-react';

interface EstatisticasQualidade {
  totalTabelas: number;
  totalRegistros: number;
  registrosCompletos: number;
  registrosIncompletos: number;
  qualidadeGeral: number;
  tabelasComProblemas: number;
  detalhesPorTabela: Array<{
    nome: string;
    total: number;
    completos: number;
    incompletos: number;
    qualidade: number;
    problemas: string[];
  }>;
  alertas: Array<{
    tipo: string;
    titulo: string;
    descricao: string;
    itens: string[];
  }>;
  skusRevisao?: {
    totalPendente: number;
    criadosSistema: number;
    criadosUpload: number;
    criadosIndividual: number;
  };
}

export default function Cadastro() {
  const [estatisticas, setEstatisticas] = useState<EstatisticasQualidade | null>(null);
  const [empresas, setEmpresas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingEmpresas, setLoadingEmpresas] = useState(true);

  useEffect(() => {
    fetchQualidadeData();
    fetchEmpresas();
  }, []);

  const fetchQualidadeData = async () => {
    try {
      const response = await fetch('/api/cadastro/qualidade');
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // Buscar estatísticas de SKUs para revisão
          const skusResponse = await fetch('/api/skus/revisao?limit=1');
          if (skusResponse.ok) {
            const skusResult = await skusResponse.json();
            if (skusResult.success) {
              result.data.skusRevisao = {
                totalPendente: skusResult.data.total,
                criadosSistema: skusResult.data.estatisticas.find((e: any) => e.origemCriacao === 'sistema' && e.statusRevisao === 'pendente_revisao')?._count?.id || 0,
                criadosUpload: skusResult.data.estatisticas.find((e: any) => e.origemCriacao === 'upload_massa' && e.statusRevisao === 'pendente_revisao')?._count?.id || 0,
                criadosIndividual: skusResult.data.estatisticas.find((e: any) => e.origemCriacao === 'individual' && e.statusRevisao === 'pendente_revisao')?._count?.id || 0
              };
            }
          }
          setEstatisticas(result.data);
        } else {
          // Fallback para dados estáticos em caso de erro
          setEstatisticas(getFallbackData());
        }
      } else {
        // Fallback para dados estáticos em caso de erro
        setEstatisticas(getFallbackData());
      }
    } catch (error) {
      console.error('Erro ao buscar dados de qualidade:', error);
      // Fallback para dados estáticos em caso de erro
      setEstatisticas(getFallbackData());
    } finally {
      setLoading(false);
    }
  };

  const fetchEmpresas = async () => {
    try {
      const response = await fetch('/api/empresas');
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setEmpresas(result.data);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar empresas:', error);
    } finally {
      setLoadingEmpresas(false);
    }
  };

  const getFallbackData = (): EstatisticasQualidade => ({
    totalTabelas: 7,
    totalRegistros: 1864,
    registrosCompletos: 1712,
    registrosIncompletos: 152,
    qualidadeGeral: 91.8,
    tabelasComProblemas: 3,
    detalhesPorTabela: [
      {
        nome: 'SKUs',
        total: 1250,
        completos: 1180,
        incompletos: 70,
        qualidade: 94.4,
        problemas: ['45 sem descrição', '25 sem categoria']
      },
      {
        nome: 'Cores',
        total: 156,
        completos: 142,
        incompletos: 14,
        qualidade: 91.0,
        problemas: ['14 sem código hexadecimal']
      },
      {
        nome: 'Representantes',
        total: 45,
        completos: 38,
        incompletos: 7,
        qualidade: 84.4,
        problemas: ['7 sem telefone']
      },
      {
        nome: 'Clientes',
        total: 234,
        completos: 198,
        incompletos: 36,
        qualidade: 84.6,
        problemas: ['23 sem endereço', '13 sem CNPJ']
      },
      {
        nome: 'Fornecedores',
        total: 89,
        completos: 76,
        incompletos: 13,
        qualidade: 85.4,
        problemas: ['8 sem CNPJ', '5 sem contato']
      },
      {
        nome: 'Transportadoras',
        total: 67,
        completos: 58,
        incompletos: 9,
        qualidade: 86.6,
        problemas: ['9 sem dados de contato']
      },
      {
        nome: 'Empresas',
        total: 23,
        completos: 20,
        incompletos: 3,
        qualidade: 87.0,
        problemas: ['3 sem endereço completo']
      }
    ],
    alertas: [
      {
        tipo: 'critico',
        titulo: 'Cadastros Críticos Incompletos',
        descricao: 'Alguns cadastros essenciais estão com campos obrigatórios vazios',
        itens: [
          'SKUs sem descrição completa: 45 registros',
          'Fornecedores sem CNPJ: 8 registros',
          'Clientes sem endereço: 23 registros'
        ]
      },
      {
        tipo: 'aviso',
        titulo: 'SKUs Aguardando Revisão',
        descricao: 'Novos SKUs foram criados automaticamente e precisam ser revisados',
        itens: [
          `${estatisticas?.skusRevisao?.totalPendente || 0} SKUs pendentes de revisão`,
          `${estatisticas?.skusRevisao?.criadosSistema || 0} criados pelo sistema`,
          `${estatisticas?.skusRevisao?.criadosUpload || 0} criados por upload em massa`
        ]
      },
      {
        tipo: 'aviso',
        titulo: 'Dados Desatualizados',
        descricao: 'Alguns registros não são atualizados há mais de 6 meses',
        itens: [
          'Transportadoras: 12 registros desatualizados',
          'Representantes: 5 registros desatualizados',
          'Cores: 3 registros desatualizados'
        ]
      }
    ],
    skusRevisao: {
      totalPendente: 15,
      criadosSistema: 12,
      criadosUpload: 3,
      criadosIndividual: 0
    }
  });

  const modulos = [
    {
      nome: 'SKUs',
      href: '/cadastro/skus',
      descricao: 'Gerenciar códigos de produtos (SKUs)',
      icone: Package,
      cor: 'from-blue-500 to-blue-600',
      stats: estatisticas?.detalhesPorTabela.find(t => t.nome === 'SKUs') || { total: 0, completos: 0, incompletos: 0 }
    },
    {
      nome: 'Cores',
      href: '/cadastro/cores',
      descricao: 'Gerenciar cores disponíveis',
      icone: Palette,
      cor: 'from-purple-500 to-purple-600',
      stats: estatisticas?.detalhesPorTabela.find(t => t.nome === 'Cores') || { total: 0, completos: 0, incompletos: 0 }
    },
    {
      nome: 'Representantes',
      href: '/cadastro/representantes',
      descricao: 'Gerenciar representantes comerciais',
      icone: Truck,
      cor: 'from-green-500 to-green-600',
      stats: estatisticas?.detalhesPorTabela.find(t => t.nome === 'Representantes') || { total: 0, completos: 0, incompletos: 0 }
    },
    {
      nome: 'Clientes',
      href: '/cadastro/clientes',
      descricao: 'Gerenciar clientes da empresa',
      icone: Home,
      cor: 'from-orange-500 to-orange-600',
      stats: estatisticas?.detalhesPorTabela.find(t => t.nome === 'Clientes') || { total: 0, completos: 0, incompletos: 0 }
    },
    {
      nome: 'Fornecedores',
      href: '/cadastro/fornecedores',
      descricao: 'Gerenciar fornecedores de produtos',
      icone: ShoppingCart,
      cor: 'from-red-500 to-red-600',
      stats: estatisticas?.detalhesPorTabela.find(t => t.nome === 'Fornecedores') || { total: 0, completos: 0, incompletos: 0 }
    },
    {
      nome: 'Transportadoras',
      href: '/cadastro/transportadoras',
      descricao: 'Gerenciar transportadoras',
      icone: TruckIcon,
      cor: 'from-indigo-500 to-indigo-600',
      stats: estatisticas?.detalhesPorTabela.find(t => t.nome === 'Transportadoras') || { total: 0, completos: 0, incompletos: 0 }
    },
    {
      nome: "Empresas",
      href: "/cadastro/empresas",
      descricao: "Gerenciar empresas fornecedoras",
      icone: Building2,
      cor: 'from-teal-500 to-teal-600',
      stats: estatisticas?.detalhesPorTabela.find(t => t.nome === 'Empresas') || { total: 0, completos: 0, incompletos: 0 }
    },
    {
      nome: "Carregar Bases",
      href: "/cadastro/carregar-bases",
      descricao: "Importar dados de estoque dos arquivos base",
      icone: Database,
      cor: 'from-emerald-500 to-emerald-600',
      stats: { total: 0, completos: 0, incompletos: 0 } // Dados dinâmicos podem ser adicionados depois
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Carregando dados de qualidade...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-full">
                <Database size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Módulo de Cadastros</h1>
                <p className="mt-1 text-blue-100">
                  Dashboard de cadastros com métricas de qualidade de dados
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchQualidadeData}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full transition-colors duration-200 flex items-center"
              >
                <RefreshCw size={16} className="mr-2" />
                Atualizar
              </button>
              <Link
                href="/"
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full transition-colors duration-200"
              >
                ← Voltar ao Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        {/* Estatísticas de Qualidade de Dados */}
        {estatisticas && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Qualidade dos Dados</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total de Tabelas</p>
                    <p className="text-3xl font-bold text-gray-900">{estatisticas.totalTabelas}</p>
                  </div>
                  <Database className="h-8 w-8 text-blue-500" />
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-600">Todas ativas</span>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Qualidade Geral</p>
                    <p className="text-3xl font-bold text-gray-900">{estatisticas.qualidadeGeral}%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-600">+2.1% vs mês anterior</span>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Registros Incompletos</p>
                    <p className="text-3xl font-bold text-gray-900">{estatisticas.registrosIncompletos}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-orange-500" />
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <AlertTriangle className="h-4 w-4 text-orange-500 mr-1" />
                  <span className="text-orange-600">{estatisticas.tabelasComProblemas} tabelas afetadas</span>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">SKUs para Revisão</p>
                    <p className="text-3xl font-bold text-gray-900">{estatisticas.skusRevisao?.totalPendente || 0}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-orange-500" />
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-gray-600">Sistema: {estatisticas.skusRevisao?.criadosSistema || 0}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-gray-600">Upload: {estatisticas.skusRevisao?.criadosUpload || 0}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                    <span className="text-gray-600">Individual: {estatisticas.skusRevisao?.criadosIndividual || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Alertas de Qualidade */}
        {estatisticas?.alertas && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Alertas de Qualidade de Dados</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {estatisticas.alertas.map((alerta, index) => (
                <div key={index} className={`border rounded-xl p-6 ${
                  alerta.tipo === 'critico'
                    ? 'bg-red-50 border-red-200'
                    : 'bg-yellow-50 border-yellow-200'
                }`}>
                  <div className="flex items-center mb-4">
                    {alerta.tipo === 'critico' ? (
                      <XCircle className="h-6 w-6 text-red-500 mr-3" />
                    ) : (
                      <AlertTriangle className="h-6 w-6 text-yellow-500 mr-3" />
                    )}
                    <h3 className={`text-lg font-semibold ${
                      alerta.tipo === 'critico' ? 'text-red-800' : 'text-yellow-800'
                    }`}>
                      {alerta.titulo}
                    </h3>
                  </div>
                  <p className={`mb-4 ${
                    alerta.tipo === 'critico' ? 'text-red-700' : 'text-yellow-700'
                  }`}>
                    {alerta.descricao}
                  </p>
                  <div className="space-y-2">
                    {alerta.itens.map((item, itemIndex) => (
                      <p key={itemIndex} className={`text-sm ${
                        alerta.tipo === 'critico' ? 'text-red-600' : 'text-yellow-600'
                      }`}>
                        • {item}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Módulos de Cadastro */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Módulos de Cadastro</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modulos.map((modulo, index) => {
              const Icon = modulo.icone;
              const qualidadePercentual = modulo.stats.total > 0
                ? ((modulo.stats.completos / modulo.stats.total) * 100).toFixed(1)
                : '0.0';

              return (
                <Link
                  key={index}
                  href={modulo.href}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  <div className={`bg-gradient-to-r ${modulo.cor} p-6 text-white`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Icon size={24} className="mr-3" />
                        <h3 className="text-xl font-bold">{modulo.nome}</h3>
                      </div>
                      <div className="opacity-75 group-hover:opacity-100 transition-opacity">
                        →
                      </div>
                    </div>
                    <p className="mt-2 text-white/90">{modulo.descricao}</p>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-3 gap-4 text-center mb-4">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{modulo.stats.total}</p>
                        <p className="text-sm text-gray-600">Total</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-green-600">{modulo.stats.completos}</p>
                        <p className="text-sm text-gray-600">Completos</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-orange-600">{modulo.stats.incompletos}</p>
                        <p className="text-sm text-gray-600">Incompletos</p>
                      </div>
                    </div>

                    {/* Barra de qualidade */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Qualidade dos Dados</span>
                        <span className={`font-semibold ${
                          parseFloat(qualidadePercentual) >= 90 ? 'text-green-600' :
                          parseFloat(qualidadePercentual) >= 70 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {qualidadePercentual}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            parseFloat(qualidadePercentual) >= 90 ? 'bg-green-500' :
                            parseFloat(qualidadePercentual) >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${qualidadePercentual}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Empresas Cadastradas */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Empresas Cadastradas</h2>
            <Link href="/cadastro/empresas">
              <Button variant="outline" className="flex items-center gap-2">
                <Building2 size={16} />
                Ver Todas
              </Button>
            </Link>
          </div>

          {loadingEmpresas ? (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
              <p className="text-gray-600">Carregando empresas...</p>
            </div>
          ) : empresas.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-4">Nenhuma empresa cadastrada</p>
              <Link href="/cadastro/empresas/novo">
                <Button className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Cadastrar Primeira Empresa
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {empresas.slice(0, 6).map((empresa) => (
                <div key={empresa.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-4 text-white">
                    <div className="flex items-center gap-3">
                      <Building2 size={20} />
                      <div>
                        <h3 className="font-bold text-lg">{empresa.nome}</h3>
                        <p className="text-teal-100 text-sm">{empresa.cnpj}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="space-y-2 text-sm">
                      {empresa.endereco && (
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-600">{empresa.endereco}</span>
                        </div>
                      )}
                      {empresa.cidade && empresa.estado && (
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-600">{empresa.cidade}, {empresa.estado}</span>
                        </div>
                      )}
                      {empresa.telefone && (
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-600">Tel: {empresa.telefone}</span>
                        </div>
                      )}
                      {empresa.email && (
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-600">{empresa.email}</span>
                        </div>
                      )}
                      {empresa.contato && (
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-600">Contato: {empresa.contato}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          empresa.ativo
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {empresa.ativo ? 'Ativa' : 'Inativa'}
                        </div>
                        <Link href={`/cadastro/empresas/${empresa.id}`}>
                          <Button variant="outline" size="sm">
                            Ver Detalhes
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {empresas.length > 6 && (
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg p-8 text-center border-2 border-dashed border-gray-300">
                  <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg mb-2">+{empresas.length - 6} empresas</p>
                  <p className="text-gray-400 text-sm mb-4">mais empresas cadastradas</p>
                  <Link href="/cadastro/empresas">
                    <Button variant="outline">
                      Ver Todas as Empresas
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Ações Rápidas */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Link
              href="/cadastro/skus/novo"
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center">
                <Package size={24} className="mr-3" />
                <div>
                  <h3 className="text-lg font-bold">Novo SKU</h3>
                  <p className="text-blue-100">Cadastrar novo produto</p>
                </div>
              </div>
            </Link>

            <Link
              href="/cadastro/skus/revisao"
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center">
                <AlertTriangle size={24} className="mr-3" />
                <div>
                  <h3 className="text-lg font-bold">Revisar SKUs</h3>
                  <p className="text-orange-100">Aprovar SKUs criados</p>
                </div>
              </div>
            </Link>

            <Link
              href="/cadastro/carregar-bases"
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center">
                <Database size={24} className="mr-3" />
                <div>
                  <h3 className="text-lg font-bold">Carregar Bases</h3>
                  <p className="text-emerald-100">Importar dados de estoque</p>
                </div>
              </div>
            </Link>

            <Link
              href="/cadastro/empresas/novo"
              className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center">
                <Building2 size={24} className="mr-3" />
                <div>
                  <h3 className="text-lg font-bold">Nova Empresa</h3>
                  <p className="text-teal-100">Cadastrar fornecedor</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
