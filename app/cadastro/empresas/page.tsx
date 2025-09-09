"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Building2, Plus, Search, Edit, Eye } from 'lucide-react';

interface Empresa {
  id: number;
  nome: string;
  cnpj: string;
  endereco: string | null;
  cidade: string | null;
  estado: string | null;
  telefone: string | null;
  email: string | null;
  contato: string | null;
  createdAt: string;
}

export default function Empresas() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const response = await fetch('/api/empresas');
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setEmpresas(data.data);
          }
        }
      } catch (error) {
        console.error('Erro ao buscar empresas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmpresas();
  }, []);

  const filteredEmpresas = empresas.filter(empresa =>
    empresa.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    empresa.cnpj.includes(searchTerm) ||
    empresa.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    empresa.cidade?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando empresas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Empresas</h1>
                <p className="text-gray-600">Gerencie o cadastro de empresas fornecedoras</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Link href="/cadastro/empresas/novo">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Empresa
                </Button>
              </Link>
              <Link href="/cadastro">
                <Button variant="outline">
                  ← Voltar
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Buscar empresas por nome, CNPJ, e-mail ou cidade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Empresas List */}
        <div className="bg-white shadow-xl border-0 rounded-xl overflow-hidden">
          {filteredEmpresas.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {searchTerm ? 'Nenhuma empresa encontrada' : 'Nenhuma empresa cadastrada'}
              </p>
              <p className="text-gray-400 text-sm mt-2">
                {searchTerm ? 'Tente ajustar os termos da busca' : 'Comece cadastrando uma nova empresa'}
              </p>
              {!searchTerm && (
                <Link href="/cadastro/empresas/novo">
                  <Button className="mt-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Cadastrar Primeira Empresa
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredEmpresas.map((empresa) => (
                <div key={empresa.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                          <Building2 className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">{empresa.nome}</h3>
                          <p className="text-sm text-gray-600 mb-2">CNPJ: {empresa.cnpj}</p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
                            <div>
                              <span className="font-medium">Endereço:</span> {empresa.endereco || 'Não informado'}
                            </div>
                            <div>
                              <span className="font-medium">Cidade/Estado:</span> {empresa.cidade ? `${empresa.cidade}/${empresa.estado}` : 'Não informado'}
                            </div>
                            <div>
                              <span className="font-medium">Telefone:</span> {empresa.telefone || 'Não informado'}
                            </div>
                            <div>
                              <span className="font-medium">E-mail:</span> {empresa.email || 'Não informado'}
                            </div>
                          </div>

                          {empresa.contato && (
                            <div className="mt-2 text-sm text-gray-500">
                              <span className="font-medium">Contato:</span> {empresa.contato}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Link href={`/cadastro/empresas/${empresa.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="mt-6 text-center text-gray-500">
          <p>{filteredEmpresas.length} empresa{filteredEmpresas.length !== 1 ? 's' : ''} encontrada{filteredEmpresas.length !== 1 ? 's' : ''}</p>
        </div>
      </div>
    </div>
  );
}
