"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Archive, Plus, Search, Edit, Trash2, RefreshCw, Upload } from 'lucide-react';

interface Estoque {
  id: number;
  skuId: string;
  depositoId: number | null;
  quantidadeAtual: number;
  quantidadeReservada: number;
  quantidadeDisponivel: number;
  localizacao: string | null;
  lote: string | null;
  dataValidade: string | null;
  custoMedio: number | null;
  valorTotalEstoque: number | null;
  status: string;
  sku?: {
    nome: string;
    descricao: string | null;
  };
  deposito?: {
    nome: string;
  };
}

export default function Estoque() {
  const [estoques, setEstoques] = useState<Estoque[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchEstoques = async () => {
      try {
        const response = await fetch('/api/estoque');
        if (response.ok) {
          const data = await response.json();
          setEstoques(data);
        }
      } catch (error) {
        console.error('Erro ao buscar estoques:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEstoques();
  }, []);

  const filteredEstoques = estoques.filter(estoque =>
    estoque.sku?.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    estoque.skuId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    estoque.localizacao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    estoque.lote?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    estoque.deposito?.nome?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este registro de estoque?')) return;

    try {
      const response = await fetch(`/api/estoque/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setEstoques(estoques.filter(e => e.id !== id));
      } else {
        alert('Erro ao excluir registro de estoque');
      }
    } catch (error) {
      console.error('Erro ao excluir registro de estoque:', error);
      alert('Erro ao excluir registro de estoque');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Carregando registros de estoque...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-purple-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-full">
                <Archive size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Estoque</h1>
                <p className="text-purple-100">Gerenciar controle de estoque</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Link href="/cadastro/estoque/novo">
                <Button className="bg-white text-purple-600 hover:bg-purple-50">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Registro
                </Button>
              </Link>
              <Link href="/cadastro/estoque/upload">
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload CSV
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
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Buscar registros de estoque..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Estoques Grid */}
        {filteredEstoques.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Archive className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'Nenhum registro encontrado' : 'Nenhum registro de estoque cadastrado'}
              </h3>
              <p className="text-gray-500 text-center mb-4">
                {searchTerm ? 'Tente ajustar sua busca' : 'Comece criando seu primeiro registro de estoque'}
              </p>
              {!searchTerm && (
                <Link href="/cadastro/estoque/novo">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Primeiro Registro
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEstoques.map((estoque) => (
              <Card key={estoque.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-lg">{estoque.sku?.nome || estoque.skuId}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      estoque.status === 'Disponível'
                        ? 'bg-green-100 text-green-800'
                        : estoque.status === 'Reservado'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {estoque.status}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <strong>Código SKU:</strong> {estoque.skuId}
                    </p>
                    {estoque.deposito && (
                      <p className="text-sm text-gray-600">
                        <strong>Depósito:</strong> {estoque.deposito.nome}
                      </p>
                    )}
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <strong>Atual:</strong> {estoque.quantidadeAtual}
                      </div>
                      <div>
                        <strong>Reservada:</strong> {estoque.quantidadeReservada}
                      </div>
                      <div>
                        <strong>Disponível:</strong> {estoque.quantidadeDisponivel}
                      </div>
                      <div>
                        <strong>Localização:</strong> {estoque.localizacao || 'N/A'}
                      </div>
                    </div>
                    {estoque.lote && (
                      <p className="text-sm text-gray-600">
                        <strong>Lote:</strong> {estoque.lote}
                      </p>
                    )}
                    {estoque.custoMedio && (
                      <p className="text-sm text-gray-600">
                        <strong>Custo Médio:</strong> R$ {estoque.custoMedio.toFixed(2)}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(estoque.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Excluir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
