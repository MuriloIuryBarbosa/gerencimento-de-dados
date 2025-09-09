"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle, Search, RefreshCw, Package, Palette, Ruler } from 'lucide-react';
import Link from 'next/link';

interface SKURevisao {
  id: string;
  nome: string;
  familia: string | null;
  cor: string | null;
  tamanho: string | null;
  origemCriacao: string;
  statusRevisao: string;
  createdAt: Date;
  itensEstoque: Array<{
    quantidade: number;
    unidade: string;
    localizacao: {
      codigo: string;
      empresa: string;
    };
  }>;
  estoqueConsolidado: {
    quantidadeTotal: number;
    unidade: string;
  } | null;
}

interface EstatisticasRevisao {
  origemCriacao: string;
  statusRevisao: string;
  _count: {
    id: number;
  };
}

export default function RevisaoSKUsPage() {
  const [skus, setSkus] = useState<SKURevisao[]>([]);
  const [estatisticas, setEstatisticas] = useState<EstatisticasRevisao[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroOrigem, setFiltroOrigem] = useState<string>('todos');
  const [busca, setBusca] = useState('');
  const [skuSelecionado, setSkuSelecionado] = useState<SKURevisao | null>(null);
  const [observacoes, setObservacoes] = useState('');

  useEffect(() => {
    carregarSKUsRevisao();
  }, [filtroOrigem]);

  const carregarSKUsRevisao = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filtroOrigem !== 'todos') {
        params.append('origemCriacao', filtroOrigem);
      }

      const response = await fetch(`/api/skus/revisao?${params}`);
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setSkus(result.data.skus);
          setEstatisticas(result.data.estatisticas);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar SKUs:', error);
    } finally {
      setLoading(false);
    }
  };

  const aprovarSKU = async (skuId: string) => {
    try {
      const response = await fetch('/api/skus/revisao', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          skuId,
          statusRevisao: 'revisado',
          observacoesRevisao: observacoes,
          revisadoPor: 1 // TODO: pegar do contexto do usuário
        })
      });

      if (response.ok) {
        // Atualizar lista
        setSkus(prev => prev.filter(sku => sku.id !== skuId));
        setSkuSelecionado(null);
        setObservacoes('');
        carregarSKUsRevisao();
      }
    } catch (error) {
      console.error('Erro ao aprovar SKU:', error);
    }
  };

  const rejeitarSKU = async (skuId: string) => {
    try {
      const response = await fetch('/api/skus/revisao', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          skuId,
          statusRevisao: 'rejeitado',
          observacoesRevisao: observacoes,
          revisadoPor: 1 // TODO: pegar do contexto do usuário
        })
      });

      if (response.ok) {
        // Atualizar lista
        setSkus(prev => prev.filter(sku => sku.id !== skuId));
        setSkuSelecionado(null);
        setObservacoes('');
        carregarSKUsRevisao();
      }
    } catch (error) {
      console.error('Erro ao rejeitar SKU:', error);
    }
  };

  const getBadgeOrigem = (origem: string) => {
    switch (origem) {
      case 'sistema':
        return <Badge variant="secondary">Sistema</Badge>;
      case 'upload_massa':
        return <Badge variant="outline">Upload</Badge>;
      case 'individual':
        return <Badge variant="default">Individual</Badge>;
      default:
        return <Badge variant="secondary">{origem}</Badge>;
    }
  };

  const skusFiltrados = skus.filter(sku =>
    sku.nome.toLowerCase().includes(busca.toLowerCase()) ||
    sku.id.toLowerCase().includes(busca.toLowerCase()) ||
    (sku.familia && sku.familia.toLowerCase().includes(busca.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Carregando SKUs para revisão...</p>
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
                <Package size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Revisão de SKUs</h1>
                <p className="mt-1 text-blue-100">
                  Aprove ou rejeite SKUs criados automaticamente
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={carregarSKUsRevisao}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full transition-colors duration-200 flex items-center"
              >
                <RefreshCw size={16} className="mr-2" />
                Atualizar
              </button>
              <Link
                href="/cadastro"
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full transition-colors duration-200"
              >
                ← Voltar ao Cadastro
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        {/* Estatísticas */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Estatísticas de Revisão</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {estatisticas.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {stat.origemCriacao === 'sistema' ? 'Criados pelo Sistema' :
                         stat.origemCriacao === 'upload_massa' ? 'Criados por Upload' :
                         'Criados Individualmente'}
                      </p>
                      <p className="text-3xl font-bold text-gray-900">{stat._count.id}</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Filtros */}
        <div className="mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="busca">Buscar SKU</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="busca"
                      placeholder="Nome, código ou família..."
                      value={busca}
                      onChange={(e) => setBusca(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="filtro">Origem</Label>
                  <select
                    id="filtro"
                    value={filtroOrigem}
                    onChange={(e) => setFiltroOrigem(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="todos">Todas as origens</option>
                    <option value="sistema">Sistema</option>
                    <option value="upload_massa">Upload em Massa</option>
                    <option value="individual">Individual</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de SKUs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lista */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>SKUs para Revisão ({skusFiltrados.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {skusFiltrados.map((sku) => (
                    <div
                      key={sku.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        skuSelecionado?.id === sku.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSkuSelecionado(sku)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{sku.nome}</h4>
                          <p className="text-sm text-gray-600">{sku.id}</p>
                        </div>
                        {getBadgeOrigem(sku.origemCriacao)}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        {sku.familia && (
                          <div className="flex items-center gap-1">
                            <Package size={14} />
                            <span>{sku.familia}</span>
                          </div>
                        )}
                        {sku.cor && (
                          <div className="flex items-center gap-1">
                            <Palette size={14} />
                            <span>{sku.cor}</span>
                          </div>
                        )}
                        {sku.tamanho && (
                          <div className="flex items-center gap-1">
                            <Ruler size={14} />
                            <span>{sku.tamanho}</span>
                          </div>
                        )}
                      </div>

                      {sku.estoqueConsolidado && (
                        <div className="mt-2 text-sm">
                          <span className="text-gray-600">Estoque: </span>
                          <span className="font-medium">
                            {sku.estoqueConsolidado.quantidadeTotal} {sku.estoqueConsolidado.unidade}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}

                  {skusFiltrados.length === 0 && (
                    <div className="text-center py-8">
                      <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                      <p className="text-gray-500">Nenhum SKU encontrado para revisão</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detalhes do SKU Selecionado */}
          <div>
            {skuSelecionado ? (
              <Card>
                <CardHeader>
                  <CardTitle>Detalhes do SKU</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label>Nome</Label>
                      <p className="font-medium">{skuSelecionado.nome}</p>
                    </div>

                    <div>
                      <Label>Código SKU</Label>
                      <p className="font-mono text-sm">{skuSelecionado.id}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>Família</Label>
                        <p>{skuSelecionado.familia || 'Não informado'}</p>
                      </div>
                      <div>
                        <Label>Cor</Label>
                        <p>{skuSelecionado.cor || 'Não informado'}</p>
                      </div>
                      <div>
                        <Label>Tamanho</Label>
                        <p>{skuSelecionado.tamanho || 'Não informado'}</p>
                      </div>
                    </div>

                    <div>
                      <Label>Origem</Label>
                      <div className="mt-1">{getBadgeOrigem(skuSelecionado.origemCriacao)}</div>
                    </div>

                    {skuSelecionado.estoqueConsolidado && (
                      <div>
                        <Label>Estoque Consolidado</Label>
                        <p className="font-medium">
                          {skuSelecionado.estoqueConsolidado.quantidadeTotal} {skuSelecionado.estoqueConsolidado.unidade}
                        </p>
                      </div>
                    )}

                    <div>
                      <Label>Itens de Estoque ({skuSelecionado.itensEstoque.length})</Label>
                      <div className="mt-2 space-y-2 max-h-32 overflow-y-auto">
                        {skuSelecionado.itensEstoque.map((item, index) => (
                          <div key={index} className="text-sm border rounded p-2">
                            <div className="flex justify-between">
                              <span>{item.localizacao.empresa} - {item.localizacao.codigo}</span>
                              <span>{item.quantidade} {item.unidade}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="observacoes">Observações da Revisão</Label>
                      <textarea
                        id="observacoes"
                        value={observacoes}
                        onChange={(e) => setObservacoes(e.target.value)}
                        placeholder="Adicione observações sobre a revisão..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                        rows={3}
                      />
                    </div>

                    <div className="flex gap-4">
                      <Button
                        onClick={() => aprovarSKU(skuSelecionado.id)}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Aprovar SKU
                      </Button>
                      <Button
                        onClick={() => rejeitarSKU(skuSelecionado.id)}
                        variant="destructive"
                        className="flex-1"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Rejeitar SKU
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Selecione um SKU para ver os detalhes</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
