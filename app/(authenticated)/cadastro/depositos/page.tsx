"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Warehouse, Plus, Search, Edit, Trash2, RefreshCw, Upload } from 'lucide-react';

interface Deposito {
  id: number;
  codigo: string;
  nome: string;
  endereco: string | null;
  cidade: string | null;
  estado: string | null;
  cep: string | null;
  telefone: string | null;
  responsavel: string | null;
  capacidade: number | null;
  tipo: string;
  ativo: boolean;
}

export default function Depositos() {
  const [depositos, setDepositos] = useState<Deposito[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchDepositos = async () => {
      try {
        const response = await fetch('/api/depositos');
        if (response.ok) {
          const data = await response.json();
          setDepositos(data);
        }
      } catch (error) {
        console.error('Erro ao buscar depósitos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDepositos();
  }, []);

  const filteredDepositos = depositos.filter(deposito =>
    deposito.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    deposito.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    deposito.cidade?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    deposito.estado?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este depósito?')) return;

    try {
      const response = await fetch(`/api/depositos/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setDepositos(depositos.filter(d => d.id !== id));
      } else {
        alert('Erro ao excluir depósito');
      }
    } catch (error) {
      console.error('Erro ao excluir depósito:', error);
      alert('Erro ao excluir depósito');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Carregando depósitos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-600 to-orange-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-full">
                <Warehouse size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Depósitos</h1>
                <p className="text-orange-100">Gerenciar depósitos e centros de distribuição</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Link href="/cadastro/depositos/novo">
                <Button className="bg-white text-orange-600 hover:bg-orange-50">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Depósito
                </Button>
              </Link>
              <Link href="/cadastro/depositos/upload">
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
              placeholder="Buscar depósitos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Depositos Grid */}
        {filteredDepositos.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Warehouse className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'Nenhum depósito encontrado' : 'Nenhum depósito cadastrado'}
              </h3>
              <p className="text-gray-500 text-center mb-4">
                {searchTerm ? 'Tente ajustar sua busca' : 'Comece criando seu primeiro depósito'}
              </p>
              {!searchTerm && (
                <Link href="/cadastro/depositos/novo">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Primeiro Depósito
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDepositos.map((deposito) => (
              <Card key={deposito.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-lg">{deposito.nome}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      deposito.ativo
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {deposito.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <strong>Código:</strong> {deposito.codigo}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Tipo:</strong> {deposito.tipo}
                    </p>
                    {deposito.capacidade && (
                      <p className="text-sm text-gray-600">
                        <strong>Capacidade:</strong> {deposito.capacidade} m³
                      </p>
                    )}
                    {deposito.cidade && deposito.estado && (
                      <p className="text-sm text-gray-600">
                        <strong>Localização:</strong> {deposito.cidade}, {deposito.estado}
                      </p>
                    )}
                    {deposito.responsavel && (
                      <p className="text-sm text-gray-600">
                        <strong>Responsável:</strong> {deposito.responsavel}
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
                      onClick={() => handleDelete(deposito.id)}
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
