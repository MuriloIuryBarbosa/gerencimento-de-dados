"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useLanguage } from "../../../components/LanguageContext";

interface Pagina {
  id: string;
  nome: string;
  rota: string;
  categoria: string;
  descricao: string;
}

interface Permissao {
  id: number;
  nome: string;
  descricao: string;
  categoria: string;
  ativo: boolean;
}

interface Usuario {
  id: number;
  nome: string;
  email: string;
  cargo?: string;
}

interface PermissaoUsuario {
  usuarioId: number;
  paginaId: string;
  permissoes: string[]; // Array de permissões concedidas para esta página
}

export default function GerenciarPermissoesDinamicas() {
  const { t } = useLanguage();
  const [paginas, setPaginas] = useState<Pagina[]>([]);
  const [permissoes, setPermissoes] = useState<Permissao[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [permissoesUsuarios, setPermissoesUsuarios] = useState<PermissaoUsuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUsuario, setSelectedUsuario] = useState<number | null>(null);
  const [selectedPagina, setSelectedPagina] = useState<string | null>(null);

  // Definir páginas do sistema
  const paginasSistema: Pagina[] = [
    // Dashboard e Visão Geral
    { id: 'dashboard', nome: 'Dashboard', rota: '/', categoria: 'Visão Geral', descricao: 'Página inicial com métricas gerais' },
    { id: 'admin', nome: 'Painel Admin', rota: '/admin', categoria: 'Administração', descricao: 'Painel administrativo do sistema' },

    // Planejamento
    { id: 'ordem-compra', nome: 'Ordens de Compra', rota: '/ordem-compra', categoria: 'Planejamento', descricao: 'Gerenciamento de ordens de compra' },
    { id: 'ordem-compra-nova', nome: 'Nova Ordem', rota: '/ordem-compra/nova', categoria: 'Planejamento', descricao: 'Criar nova ordem de compra' },
    { id: 'proforma', nome: 'Proformas', rota: '/proforma', categoria: 'Planejamento', descricao: 'Gerenciamento de proformas' },
    { id: 'requisicoes', nome: 'Requisições', rota: '/requisicoes', categoria: 'Planejamento', descricao: 'Gerenciamento de requisições' },
    { id: 'conteineres', nome: 'Contêineres', rota: '/conteineres', categoria: 'Planejamento', descricao: 'Gerenciamento de contêineres' },
    { id: 'follow-up', nome: 'Follow-up', rota: '/follow-up', categoria: 'Planejamento', descricao: 'Acompanhamento logístico' },

    // Executivo
    { id: 'executivo-skus', nome: 'SKUs Executivo', rota: '/executivo/skus', categoria: 'Executivo', descricao: 'Gerenciamento executivo de SKUs' },
    { id: 'executivo-precos', nome: 'Preços Executivo', rota: '/executivo/precos', categoria: 'Executivo', descricao: 'Controle executivo de preços' },
    { id: 'executivo-estoque', nome: 'Estoque Executivo', rota: '/executivo/estoque', categoria: 'Executivo', descricao: 'Gerenciamento executivo de estoque' },
    { id: 'executivo-cores', nome: 'Cores Executivo', rota: '/executivo/cores', categoria: 'Executivo', descricao: 'Gerenciamento executivo de cores' },

    // Cadastro
    { id: 'cadastro-skus', nome: 'Cadastro SKUs', rota: '/cadastro/skus', categoria: 'Cadastro', descricao: 'Cadastro de SKUs' },
    { id: 'cadastro-cores', nome: 'Cadastro Cores', rota: '/cadastro/cores', categoria: 'Cadastro', descricao: 'Cadastro de cores' },
    { id: 'cadastro-fornecedores', nome: 'Cadastro Fornecedores', rota: '/cadastro/fornecedores', categoria: 'Cadastro', descricao: 'Cadastro de fornecedores' },
    { id: 'cadastro-clientes', nome: 'Cadastro Clientes', rota: '/cadastro/clientes', categoria: 'Cadastro', descricao: 'Cadastro de clientes' },
    { id: 'cadastro-representantes', nome: 'Cadastro Representantes', rota: '/cadastro/representantes', categoria: 'Cadastro', descricao: 'Cadastro de representantes' },
    { id: 'cadastro-transportadoras', nome: 'Cadastro Transportadoras', rota: '/cadastro/transportadoras', categoria: 'Cadastro', descricao: 'Cadastro de transportadoras' },

    // Configurações
    { id: 'settings', nome: 'Configurações', rota: '/settings', categoria: 'Sistema', descricao: 'Configurações do sistema' },
  ];

  // Definir permissões disponíveis por página
  const permissoesPorPagina: Record<string, string[]> = {
    'dashboard': ['view'],
    'admin': ['view', 'manage_users', 'manage_permissions', 'view_logs', 'manage_tables'],
    'ordem-compra': ['view', 'create', 'edit', 'delete', 'approve'],
    'ordem-compra-nova': ['create'],
    'proforma': ['view', 'create', 'edit', 'delete', 'approve'],
    'requisicoes': ['view', 'create', 'edit', 'delete', 'approve'],
    'conteineres': ['view', 'create', 'edit', 'delete'],
    'follow-up': ['view', 'edit'],
    'executivo-skus': ['view', 'edit'],
    'executivo-precos': ['view', 'edit'],
    'executivo-estoque': ['view', 'edit'],
    'executivo-cores': ['view', 'edit'],
    'cadastro-skus': ['view', 'create', 'edit', 'delete'],
    'cadastro-cores': ['view', 'create', 'edit', 'delete'],
    'cadastro-fornecedores': ['view', 'create', 'edit', 'delete'],
    'cadastro-clientes': ['view', 'create', 'edit', 'delete'],
    'cadastro-representantes': ['view', 'create', 'edit', 'delete'],
    'cadastro-transportadoras': ['view', 'create', 'edit', 'delete'],
    'settings': ['view', 'edit']
  };

  useEffect(() => {
    setPaginas(paginasSistema);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [permissoesRes, usuariosRes] = await Promise.all([
        fetch('/api/admin/permissoes'),
        fetch('/api/admin/usuarios')
      ]);

      if (permissoesRes.ok) {
        const permissoesData = await permissoesRes.json();
        setPermissoes(permissoesData);
      }

      if (usuariosRes.ok) {
        const usuariosData = await usuariosRes.json();
        setUsuarios(usuariosData);
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPermissaoUsuario = (usuarioId: number, paginaId: string): string[] => {
    // Simulação - em produção, isso viria da API
    return [];
  };

  const togglePermissao = async (usuarioId: number, paginaId: string, permissao: string) => {
    const currentPermissoes = getPermissaoUsuario(usuarioId, paginaId);
    const hasPermissao = currentPermissoes.includes(permissao);

    const newPermissoes = hasPermissao
      ? currentPermissoes.filter(p => p !== permissao)
      : [...currentPermissoes, permissao];

    try {
      const response = await fetch('/api/admin/permissoes-dinamicas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuarioId,
          paginaId,
          permissoes: newPermissoes
        }),
      });

      if (response.ok) {
        alert('Permissões atualizadas com sucesso!');
        // Atualizar estado local
      } else {
        throw new Error('Erro ao atualizar permissões');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao atualizar permissões');
    }
  };

  const getPermissaoLabel = (permissao: string): string => {
    const labels: Record<string, string> = {
      'view': 'Visualizar',
      'create': 'Criar',
      'edit': 'Editar',
      'delete': 'Excluir',
      'approve': 'Aprovar',
      'manage_users': 'Gerenciar Usuários',
      'manage_permissions': 'Gerenciar Permissões',
      'view_logs': 'Ver Logs',
      'manage_tables': 'Gerenciar Tabelas'
    };
    return labels[permissao] || permissao;
  };

  const paginasPorCategoria = paginas.reduce((acc, pagina) => {
    if (!acc[pagina.categoria]) {
      acc[pagina.categoria] = [];
    }
    acc[pagina.categoria].push(pagina);
    return acc;
  }, {} as Record<string, Pagina[]>);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando permissões dinâmicas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Permissões Dinâmicas</h1>
              <p className="mt-1 text-sm text-gray-500">
                Controle granular de permissões por página e funcionalidade
              </p>
            </div>
            <div className="flex space-x-4">
              <Link
                href="/admin/permissoes"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                ← Permissões Simples
              </Link>
              <Link
                href="/admin"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                ← Voltar ao Admin
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Seletor de Usuário */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Selecionar Usuário
            </h3>
            <div className="max-w-md">
              <select
                value={selectedUsuario || ""}
                onChange={(e) => setSelectedUsuario(e.target.value ? parseInt(e.target.value) : null)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Selecione um usuário</option>
                {usuarios.map((usuario) => (
                  <option key={usuario.id} value={usuario.id}>
                    {usuario.nome} - {usuario.cargo || 'Sem cargo'}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {selectedUsuario && (
          <div className="space-y-8">
            {Object.entries(paginasPorCategoria).map(([categoria, paginasCategoria]) => (
              <div key={categoria} className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    {categoria}
                  </h3>

                  <div className="space-y-6">
                    {paginasCategoria.map((pagina) => (
                      <div key={pagina.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">
                              {pagina.nome}
                            </h4>
                            <p className="text-sm text-gray-500 mt-1">
                              {pagina.descricao}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              Rota: {pagina.rota}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                          {permissoesPorPagina[pagina.id]?.map((permissao) => {
                            const hasPermissao = getPermissaoUsuario(selectedUsuario, pagina.id).includes(permissao);
                            return (
                              <div key={permissao} className="flex items-center">
                                <input
                                  type="checkbox"
                                  id={`${pagina.id}-${permissao}`}
                                  checked={hasPermissao}
                                  onChange={() => togglePermissao(selectedUsuario, pagina.id, permissao)}
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label
                                  htmlFor={`${pagina.id}-${permissao}`}
                                  className="ml-2 block text-sm text-gray-900"
                                >
                                  {getPermissaoLabel(permissao)}
                                </label>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!selectedUsuario && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Selecione um usuário
                </h3>
                <p className="text-gray-500">
                  Escolha um usuário para gerenciar suas permissões por página
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
