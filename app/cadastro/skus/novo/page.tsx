"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Save, X, AlertCircle, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SearchableSelect } from '@/components/SearchableSelect';

export default function NovoSKU() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    id: "",
    nome: "",
    descricao: "",
    categoria: "",
    unidade: "UN",
    precoVenda: "",
    custoMedio: "",
    estoqueMinimo: "",
    estoqueMaximo: "",
    familiaId: "",
    tamanhoId: "",
    corId: ""
  });

  const [familias, setFamilias] = useState([]);
  const [tamanhos, setTamanhos] = useState([]);
  const [cores, setCores] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [familiasRes, tamanhosRes, coresRes] = await Promise.all([
          fetch('/api/familias'),
          fetch('/api/tamanhos'),
          fetch('/api/cores')
        ]);

        if (familiasRes.ok) {
          const familiasData = await familiasRes.json();
          setFamilias(familiasData.map((f: any) => ({
            id: f.id,
            label: `${f.codigo} - ${f.nome}`,
            value: f.id.toString()
          })));
        }

        if (tamanhosRes.ok) {
          const tamanhosData = await tamanhosRes.json();
          setTamanhos(tamanhosData.map((t: any) => ({
            id: t.id,
            label: `${t.codigo} - ${t.nome}`,
            value: t.id.toString()
          })));
        }

        if (coresRes.ok) {
          const coresData = await coresRes.json();
          setCores(coresData.map((c: any) => ({
            id: c.id,
            label: `${c.nome}${c.codigoHex ? ` (${c.codigoHex})` : ''}`,
            value: c.id.toString()
          })));
        }
      } catch (error) {
        console.error('Erro ao carregar opções:', error);
      } finally {
        setLoadingOptions(false);
      }
    };

    loadOptions();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.id.trim()) {
      setError('Código do SKU é obrigatório');
      return false;
    }
    if (!formData.nome.trim()) {
      setError('Nome do SKU é obrigatório');
      return false;
    }
    if (formData.precoVenda && parseFloat(formData.precoVenda) < 0) {
      setError('Preço de venda não pode ser negativo');
      return false;
    }
    if (formData.custoMedio && parseFloat(formData.custoMedio) < 0) {
      setError('Custo médio não pode ser negativo');
      return false;
    }
    if (formData.estoqueMinimo && parseInt(formData.estoqueMinimo) < 0) {
      setError('Estoque mínimo não pode ser negativo');
      return false;
    }
    if (formData.estoqueMaximo && parseInt(formData.estoqueMaximo) < 0) {
      setError('Estoque máximo não pode ser negativo');
      return false;
    }
    if (formData.estoqueMinimo && formData.estoqueMaximo &&
        parseInt(formData.estoqueMinimo) > parseInt(formData.estoqueMaximo)) {
      setError('Estoque mínimo não pode ser maior que o estoque máximo');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      const dataToSend = {
        ...formData,
        precoVenda: formData.precoVenda ? parseFloat(formData.precoVenda) : null,
        custoMedio: formData.custoMedio ? parseFloat(formData.custoMedio) : null,
        estoqueMinimo: formData.estoqueMinimo ? parseInt(formData.estoqueMinimo) : null,
        estoqueMaximo: formData.estoqueMaximo ? parseInt(formData.estoqueMaximo) : null,
        familiaId: formData.familiaId ? parseInt(formData.familiaId) : null,
        tamanhoId: formData.tamanhoId ? parseInt(formData.tamanhoId) : null,
        corId: formData.corId ? parseInt(formData.corId) : null
      };

      const response = await fetch('/api/skus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar SKU');
      }

      setSuccess('SKU criado com sucesso!');

      // Reset form
      setFormData({
        id: "",
        nome: "",
        descricao: "",
        categoria: "",
        unidade: "UN",
        precoVenda: "",
        custoMedio: "",
        estoqueMinimo: "",
        estoqueMaximo: "",
        familiaId: "",
        tamanhoId: "",
        corId: ""
      });

      // Redirect after success
      setTimeout(() => {
        router.push('/cadastro/skus');
      }, 2000);

    } catch (error) {
      console.error('Erro:', error);
      setError(error instanceof Error ? error.message : 'Erro ao criar SKU');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/cadastro/skus');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
              <Package className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Cadastrar Novo SKU</h1>
              <p className="text-gray-600">Preencha os dados do novo SKU/produto</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Dados do SKU
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <p className="text-green-600 text-sm">{success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Código e Nome */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="id" className="text-sm font-medium text-gray-700">
                    Código do SKU *
                  </Label>
                  <Input
                    id="id"
                    type="text"
                    value={formData.id}
                    onChange={(e) => handleInputChange('id', e.target.value)}
                    placeholder="Ex: SKU001"
                    className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nome" className="text-sm font-medium text-gray-700">
                    Nome do Produto *
                  </Label>
                  <Input
                    id="nome"
                    type="text"
                    value={formData.nome}
                    onChange={(e) => handleInputChange('nome', e.target.value)}
                    placeholder="Digite o nome do produto"
                    className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Descrição */}
              <div className="space-y-2">
                <Label htmlFor="descricao" className="text-sm font-medium text-gray-700">
                  Descrição
                </Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => handleInputChange('descricao', e.target.value)}
                  placeholder="Descrição detalhada do produto"
                  className="min-h-24 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  rows={4}
                />
              </div>

              {/* Família, Tamanho e Cor */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Família
                  </Label>
                  <SearchableSelect
                    options={familias}
                    value={formData.familiaId}
                    onChange={(value) => handleInputChange('familiaId', value)}
                    placeholder="Selecione uma família"
                    loading={loadingOptions}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Tamanho
                  </Label>
                  <SearchableSelect
                    options={tamanhos}
                    value={formData.tamanhoId}
                    onChange={(value) => handleInputChange('tamanhoId', value)}
                    placeholder="Selecione um tamanho"
                    loading={loadingOptions}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Cor
                  </Label>
                  <SearchableSelect
                    options={cores}
                    value={formData.corId}
                    onChange={(value) => handleInputChange('corId', value)}
                    placeholder="Selecione uma cor"
                    loading={loadingOptions}
                  />
                </div>
              </div>

              {/* Categoria e Unidade */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="categoria" className="text-sm font-medium text-gray-700">
                    Categoria
                  </Label>
                  <Input
                    id="categoria"
                    type="text"
                    value={formData.categoria}
                    onChange={(e) => handleInputChange('categoria', e.target.value)}
                    placeholder="Ex: Eletrônicos, Roupas, etc."
                    className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unidade" className="text-sm font-medium text-gray-700">
                    Unidade de Medida *
                  </Label>
                  <select
                    id="unidade"
                    value={formData.unidade}
                    onChange={(e) => handleInputChange('unidade', e.target.value)}
                    className="h-12 w-full px-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 bg-white"
                    required
                  >
                    <option value="UN">Unidade (UN)</option>
                    <option value="KG">Quilograma (KG)</option>
                    <option value="LT">Litro (LT)</option>
                    <option value="MT">Metro (MT)</option>
                    <option value="M2">Metro Quadrado (M²)</option>
                    <option value="M3">Metro Cúbico (M³)</option>
                    <option value="PC">Peça (PC)</option>
                    <option value="CX">Caixa (CX)</option>
                  </select>
                </div>
              </div>

              {/* Preços */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="precoVenda" className="text-sm font-medium text-gray-700">
                    Preço de Venda (R$)
                  </Label>
                  <Input
                    id="precoVenda"
                    type="number"
                    value={formData.precoVenda}
                    onChange={(e) => handleInputChange('precoVenda', e.target.value)}
                    placeholder="0,00"
                    step="0.01"
                    min="0"
                    className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="custoMedio" className="text-sm font-medium text-gray-700">
                    Custo Médio (R$)
                  </Label>
                  <Input
                    id="custoMedio"
                    type="number"
                    value={formData.custoMedio}
                    onChange={(e) => handleInputChange('custoMedio', e.target.value)}
                    placeholder="0,00"
                    step="0.01"
                    min="0"
                    className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Controle de Estoque */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="estoqueMinimo" className="text-sm font-medium text-gray-700">
                    Estoque Mínimo
                  </Label>
                  <Input
                    id="estoqueMinimo"
                    type="number"
                    value={formData.estoqueMinimo}
                    onChange={(e) => handleInputChange('estoqueMinimo', e.target.value)}
                    placeholder="0"
                    min="0"
                    className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estoqueMaximo" className="text-sm font-medium text-gray-700">
                    Estoque Máximo
                  </Label>
                  <Input
                    id="estoqueMaximo"
                    type="number"
                    value={formData.estoqueMaximo}
                    onChange={(e) => handleInputChange('estoqueMaximo', e.target.value)}
                    placeholder="0"
                    min="0"
                    className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-4 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="h-12 px-8 border-gray-300 hover:bg-gray-50"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-12 px-8 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Salvar SKU
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
