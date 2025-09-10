"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shirt, Plus, Search, Edit, Trash2, RefreshCw } from 'lucide-react';

interface Familia {
  id: number;
  codigo: string;
  nome: string;
  descricao: string | null;
  ativo: boolean;
}

export default function Familias() {
  const [familias, setFamilias] = useState<Familia[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchFamilias = async () => {
      try {
        const response = await fetch('/api/familias');
        if (response.ok) {
          const data = await response.json();
          setFamilias(data);
        }
      } catch (error) {
        console.error('Erro ao buscar famílias:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFamilias();
  }, []);

  const filteredFamilias = familias.filter(familia =>
    familia.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    familia.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    familia.descricao?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta família?')) return;

    try {
      const response = await fetch(`/api/familias/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setFamilias(familias.filter(f => f.id !== id));
      } else {
        alert('Erro ao excluir família');
      }
    } catch (error) {
      console.error('Erro ao excluir família:', error);
      alert('Erro ao excluir família');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Carregando famílias...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-cyan-600 to-cyan-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-full">
                <Shirt size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Famílias</h1>
                <p className="text-cyan-100">Gerenciar famílias de produtos</p>
              </div>
            </div>
            <Link href="/cadastro/familias/novo">
              <Button className="bg-white text-cyan-600 hover:bg-cyan-50">
                <Plus className="h-4 w-4 mr-2" />
                Nova Família
              </Button>
            </Link>
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
              placeholder="Buscar famílias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Famílias Grid */}
        {filteredFamilias.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Shirt className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'Nenhuma família encontrada' : 'Nenhuma família cadastrada'}
              </h3>
              <p className="text-gray-500 text-center mb-4">
                {searchTerm ? 'Tente ajustar sua busca' : 'Comece criando sua primeira família'}
              </p>
              {!searchTerm && (
                <Link href="/cadastro/familias/novo">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Primeira Família
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFamilias.map((familia) => (
              <Card key={familia.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-lg">{familia.nome}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      familia.ativo
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {familia.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <strong>Código:</strong> {familia.codigo}
                    </p>
                    {familia.descricao && (
                      <p className="text-sm text-gray-600">
                        <strong>Descrição:</strong> {familia.descricao}
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
                      onClick={() => handleDelete(familia.id)}
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