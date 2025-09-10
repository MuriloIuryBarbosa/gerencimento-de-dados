"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Plus, Search, Edit, Trash2, RefreshCw, Upload } from 'lucide-react';

interface UNEG {
  id: number;
  codigo: string;
  nome: string;
  descricao: string | null;
  ativo: boolean;
}

export default function UNEGs() {
  const [unegs, setUneg] = useState<UNEG[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUneg = async () => {
      try {
        const response = await fetch('/api/unegs');
        if (response.ok) {
          const data = await response.json();
          setUneg(data);
        }
      } catch (error) {
        console.error('Erro ao buscar UNEGs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUneg();
  }, []);

  const filteredUneg = unegs.filter(uneg =>
    uneg.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    uneg.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    uneg.descricao?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta UNEG?')) return;

    try {
      const response = await fetch(`/api/unegs/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setUneg(unegs.filter(u => u.id !== id));
      } else {
        alert('Erro ao excluir UNEG');
      }
    } catch (error) {
      console.error('Erro ao excluir UNEG:', error);
      alert('Erro ao excluir UNEG');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Carregando UNEGs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-green-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-full">
                <Building2 size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">UNEGs</h1>
                <p className="text-green-100">Gerenciar unidades de negócio</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Link href="/cadastro/unegs/novo">
                <Button className="bg-white text-green-600 hover:bg-green-50">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova UNEG
                </Button>
              </Link>
              <Link href="/cadastro/unegs/upload">
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
              placeholder="Buscar UNEGs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* UNEGs Grid */}
        {filteredUneg.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Building2 className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'Nenhuma UNEG encontrada' : 'Nenhuma UNEG cadastrada'}
              </h3>
              <p className="text-gray-500 text-center mb-4">
                {searchTerm ? 'Tente ajustar sua busca' : 'Comece criando sua primeira UNEG'}
              </p>
              {!searchTerm && (
                <Link href="/cadastro/unegs/novo">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Primeira UNEG
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUneg.map((uneg) => (
              <Card key={uneg.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-lg">{uneg.nome}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      uneg.ativo
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {uneg.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <strong>Código:</strong> {uneg.codigo}
                    </p>
                    {uneg.descricao && (
                      <p className="text-sm text-gray-600">
                        <strong>Descrição:</strong> {uneg.descricao}
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
                      onClick={() => handleDelete(uneg.id)}
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
