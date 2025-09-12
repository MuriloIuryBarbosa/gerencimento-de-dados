"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ArrowLeft, Edit, Building2, MapPin, Phone, Mail, User, Calendar, FileText, Users, Warehouse, ShoppingCart } from 'lucide-react';

interface EmpresaDetalhes {
  id: number;
  nome: string;
  cnpj: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  telefone: string;
  email: string;
  contato: string;
  observacoes: string;
  dominio: string;
  logo: string;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
  _count: {
    usuarios: number;
    permissoes: number;
    tabelas: number;
  };
}

export default function DetalhesEmpresa() {
  const params = useParams();
  const router = useRouter();
  const [empresa, setEmpresa] = useState<EmpresaDetalhes | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmpresa = async () => {
      try {
        const response = await fetch(`/api/empresas/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setEmpresa(data.data);
          } else {
            router.push('/cadastro/empresas');
          }
        } else {
          router.push('/cadastro/empresas');
        }
      } catch (error) {
        console.error('Erro ao buscar empresa:', error);
        router.push('/cadastro/empresas');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchEmpresa();
    }
  }, [params.id, router]);

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando detalhes da empresa...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!empresa) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Empresa não encontrada</h2>
            <Link
              href="/cadastro/empresas"
              className="text-indigo-600 hover:text-indigo-500"
            >
              Voltar para lista de empresas
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link
                  href="/cadastro/empresas"
                  className="flex items-center text-blue-200 hover:text-white transition-colors"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Voltar
                </Link>
                <div>
                  <h1 className="text-3xl font-bold">{empresa.nome}</h1>
                  <p className="text-blue-200">CNPJ: {empresa.cnpj || 'Não informado'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                  empresa.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {empresa.ativo ? 'Ativa' : 'Inativa'}
                </span>
                <Link
                  href={`/cadastro/empresas/${empresa.id}/editar`}
                  className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 transition-colors flex items-center"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Informações Principais */}
            <div className="lg:col-span-2 space-y-6">
              {/* Informações da Empresa */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Building2 className="h-5 w-5 mr-2" />
                  Informações da Empresa
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nome</label>
                      <p className="mt-1 text-sm text-gray-900">{empresa.nome}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">CNPJ</label>
                      <p className="mt-1 text-sm text-gray-900">{empresa.cnpj || 'Não informado'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Domínio</label>
                      <p className="mt-1 text-sm text-gray-900">{empresa.dominio || 'Não informado'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        empresa.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {empresa.ativo ? 'Ativa' : 'Inativa'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        Endereço
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {empresa.endereco || 'Não informado'}
                        {empresa.cidade && empresa.estado && (
                          <><br />{empresa.cidade}, {empresa.estado}</>
                        )}
                        {empresa.cep && (
                          <><br />CEP: {empresa.cep}</>
                        )}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 flex items-center">
                        <Phone className="h-4 w-4 mr-1" />
                        Telefone
                      </label>
                      <p className="mt-1 text-sm text-gray-900">{empresa.telefone || 'Não informado'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 flex items-center">
                        <Mail className="h-4 w-4 mr-1" />
                        Email
                      </label>
                      <p className="mt-1 text-sm text-gray-900">{empresa.email || 'Não informado'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        Contato Principal
                      </label>
                      <p className="mt-1 text-sm text-gray-900">{empresa.contato || 'Não informado'}</p>
                    </div>
                  </div>
                </div>

                {empresa.observacoes && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 flex items-center mb-2">
                      <FileText className="h-4 w-4 mr-1" />
                      Observações
                    </label>
                    <p className="text-sm text-gray-600">{empresa.observacoes}</p>
                  </div>
                )}
              </div>

              {/* Estatísticas */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Estatísticas</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-2">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{empresa._count.usuarios}</p>
                    <p className="text-sm text-gray-600">Usuários</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-2">
                      <FileText className="h-6 w-6 text-green-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{empresa._count.tabelas}</p>
                    <p className="text-sm text-gray-600">Tabelas</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-2">
                      <FileText className="h-6 w-6 text-purple-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{empresa._count.tabelas}</p>
                    <p className="text-sm text-gray-600">Tabelas Dinâmicas</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mx-auto mb-2">
                      <Warehouse className="h-6 w-6 text-orange-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{empresa._count.permissoes}</p>
                    <p className="text-sm text-gray-600">Depósitos</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar com Informações Adicionais */}
            <div className="space-y-6">
              {/* Datas */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Datas Importantes
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Data de Cadastro</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(empresa.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Última Atualização</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(empresa.updatedAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Ações Rápidas */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Ações Rápidas</h3>
                <div className="space-y-3">
                  <Link
                    href={`/cadastro/usuarios?empresa=${empresa.id}`}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Gerenciar Usuários
                  </Link>
                  <Link
                    href={`/cadastro/depositos?empresa=${empresa.id}`}
                    className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center"
                  >
                    <Warehouse className="h-4 w-4 mr-2" />
                    Gerenciar Depósitos
                  </Link>
                </div>
              </div>

              {/* Logo da Empresa */}
              {empresa.logo && (
                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Logo da Empresa</h3>
                  <div className="flex justify-center">
                    <img
                      src={empresa.logo}
                      alt={`Logo ${empresa.nome}`}
                      className="max-w-full max-h-32 object-contain"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
