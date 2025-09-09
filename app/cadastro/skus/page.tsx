"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Plus, Search, Edit, Eye, AlertCircle, Upload } from 'lucide-react';

interface SKU {
  id: string;
  nome: string;
  descricao: string | null;
  categoria: string | null;
  unidade: string;
  precoVenda: number | null;
  custoMedio: number | null;
  estoqueMinimo: number;
  estoqueMaximo: number | null;
  ativo: boolean;
}

export default function SKUs() {
  const [skus, setSkus] = useState<SKU[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchSKUs = async () => {
      try {
        const response = await fetch('/api/skus');
        if (response.ok) {
          const data = await response.json();
          // A API retorna { success: true, data: skus }, então pegamos o array de data
          setSkus(data.success ? data.data : []);
        } else {
          console.error('Erro na resposta da API:', response.status);
          setSkus([]);
          setError('Erro ao carregar SKUs');
        }
      } catch (error) {
        console.error('Erro ao buscar SKUs:', error);
        setSkus([]);
        setError('Erro de conexão com o servidor');
      } finally {
        setLoading(false);
      }
    };

    fetchSKUs();
  }, []);

  const filteredSkus = skus.filter(sku =>
    sku.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sku.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sku.categoria?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sku.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando SKUs...</p>
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
                <Package className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">SKUs</h1>
                <p className="text-gray-600">Gerencie os códigos de produtos (SKUs)</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Link href="/cadastro/skus/novo">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo SKU
                </Button>
              </Link>
              <Link href="/cadastro/skus/upload">
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

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Buscar SKUs por nome, código, descrição ou categoria..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* SKUs List */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Lista de SKUs ({filteredSkus.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {filteredSkus.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  {searchTerm ? 'Nenhum SKU encontrado' : 'Nenhum SKU cadastrado'}
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  {searchTerm ? 'Tente ajustar os termos da busca' : 'Comece cadastrando um novo SKU'}
                </p>
                {!searchTerm && (
                  <Link href="/cadastro/skus/novo">
                    <Button className="mt-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Cadastrar Primeiro SKU
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredSkus.map((sku) => (
                  <div key={sku.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                            <Package className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">{sku.nome}</h3>
                            <p className="text-sm text-gray-600 mb-2">Código: {sku.id}</p>

                            {sku.descricao && (
                              <p className="text-sm text-gray-500 mb-3">{sku.descricao}</p>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-500">
                              <div>
                                <span className="font-medium">Categoria:</span> {sku.categoria || 'Não informado'}
                              </div>
                              <div>
                                <span className="font-medium">Unidade:</span> {sku.unidade}
                              </div>
                              <div>
                                <span className="font-medium">Estoque Mín.:</span> {sku.estoqueMinimo}
                              </div>
                              <div>
                                <span className="font-medium">Preço Venda:</span> {sku.precoVenda && !isNaN(Number(sku.precoVenda)) ? `R$ ${Number(sku.precoVenda).toFixed(2)}` : 'Não informado'}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          sku.ativo
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {sku.ativo ? 'Ativo' : 'Inativo'}
                        </div>
                        <Link href={`/cadastro/skus/${sku.id}`}>
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
          </CardContent>
        </Card>

        {/* Summary */}
        <div className="mt-6 text-center text-gray-500">
          <p>{filteredSkus.length} SKU{filteredSkus.length !== 1 ? 's' : ''} encontrado{filteredSkus.length !== 1 ? 's' : ''}</p>
        </div>
      </div>
    </div>
  );
}
