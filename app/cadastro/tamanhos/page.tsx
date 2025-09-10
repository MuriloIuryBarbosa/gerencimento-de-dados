"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Ruler, Plus, Search, Edit, Trash2, RefreshCw, Upload } from 'lucide-react';

interface Tamanho {
  id: number;
  codigo: string;
  nome: string;
  descricao: string | null;
  ordem: number;
  ativo: boolean;
}

export default function Tamanhos() {
  const [tamanhos, setTamanhos] = useState<Tamanho[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchTamanhos = async () => {
      try {
        const response = await fetch('/api/tamanhos');
        if (response.ok) {
          const data = await response.json();
          setTamanhos(data);
        }
      } catch (error) {
        console.error('Erro ao buscar tamanhos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTamanhos();
  }, []);

  const filteredTamanhos = tamanhos.filter(tamanho =>
    tamanho.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tamanho.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tamanho.descricao?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este tamanho?')) return;

    try {
      const response = await fetch(`/api/tamanhos/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTamanhos(tamanhos.filter(t => t.id !== id));
      } else {
        alert('Erro ao excluir tamanho');
      }
    } catch (error) {
      console.error('Erro ao excluir tamanho:', error);
      alert('Erro ao excluir tamanho');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Carregando tamanhos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-pink-600 to-pink-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-full">
                <Ruler size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Tamanhos</h1>
                <p className="text-pink-100">Gerenciar tamanhos disponíveis</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Link href="/cadastro/tamanhos/novo">
                <Button className="bg-white text-pink-600 hover:bg-pink-50">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Tamanho
                </Button>
              </Link>
              <Link href="/cadastro/tamanhos/upload">
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
              placeholder="Buscar tamanhos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Tamanhos Grid */}
        {filteredTamanhos.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Ruler className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'Nenhum tamanho encontrado' : 'Nenhum tamanho cadastrado'}
              </h3>
              <p className="text-gray-500 text-center mb-4">
                {searchTerm ? 'Tente ajustar sua busca' : 'Comece criando seu primeiro tamanho'}
              </p>
              {!searchTerm && (
                <Link href="/cadastro/tamanhos/novo">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Primeiro Tamanho
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTamanhos.map((tamanho) => (
              <Card key={tamanho.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-lg">{tamanho.nome}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      tamanho.ativo
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {tamanho.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <strong>Código:</strong> {tamanho.codigo}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Ordem:</strong> {tamanho.ordem}
                    </p>
                    {tamanho.descricao && (
                      <p className="text-sm text-gray-600">
                        <strong>Descrição:</strong> {tamanho.descricao}
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
                      onClick={() => handleDelete(tamanho.id)}
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