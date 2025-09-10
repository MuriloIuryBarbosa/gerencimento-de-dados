"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Package, Save, X, Search } from 'lucide-react';

interface SKUModalProps {
  isOpen: boolean;
  onSave: (sku: any) => void;
  onCancel: () => void;
}

export default function SKUModal({ isOpen, onSave, onCancel }: SKUModalProps) {
  const [formData, setFormData] = useState({
    id: '',
    nome: '',
    descricao: '',
    categoria: '',
    unidade: 'UN',
    precoVenda: '',
    custoMedio: '',
    estoqueMinimo: '0'
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação básica
    if (!formData.id) {
      alert('ID é obrigatório!');
      return;
    }

    // Verificar se o ID já existe
    setIsLoading(true);
    try {
      const response = await fetch(`/api/skus?search=${formData.id}`);
      const result = await response.json();

      if (result.success && result.data.some((sku: any) => sku.id === formData.id)) {
        alert('Este ID de SKU já existe!');
        setIsLoading(false);
        return;
      }

      // Criar o SKU
      const createResponse = await fetch('/api/skus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          precoVenda: formData.precoVenda ? parseFloat(formData.precoVenda) : null,
          custoMedio: formData.custoMedio ? parseFloat(formData.custoMedio) : null,
          estoqueMinimo: parseInt(formData.estoqueMinimo) || 0,
          estoqueMaximo: null
        })
      });

      if (createResponse.ok) {
        const newSku = await createResponse.json();
        onSave(newSku);
        // Reset form
        setFormData({
          id: '',
          nome: '',
          descricao: '',
          categoria: '',
          unidade: 'UN',
          precoVenda: '',
          custoMedio: '',
          estoqueMinimo: '0'
        });
      } else {
        throw new Error('Erro ao criar SKU');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao salvar SKU');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      id: '',
      nome: '',
      descricao: '',
      categoria: '',
      unidade: 'UN',
      precoVenda: '',
      custoMedio: '',
      estoqueMinimo: '0'
    });
    onCancel();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Cadastrar Novo SKU</h2>
              <p className="text-gray-600">Preencha os dados do produto/SKU</p>
            </div>
          </div>
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* ID e Nome */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="id" className="text-sm font-medium text-gray-700">
                ID do SKU *
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
                Nome do Produto
              </Label>
              <Input
                id="nome"
                type="text"
                value={formData.nome}
                onChange={(e) => handleInputChange('nome', e.target.value)}
                placeholder="Nome completo do produto"
                className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
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
                placeholder="Categoria do produto"
                className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unidade" className="text-sm font-medium text-gray-700">
                Unidade de Medida
              </Label>
              <select
                id="unidade"
                value={formData.unidade}
                onChange={(e) => handleInputChange('unidade', e.target.value)}
                className="w-full h-12 px-4 py-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              >
                <option value="UN">UN - Unidade</option>
                <option value="KG">KG - Quilograma</option>
                <option value="M">M - Metro</option>
                <option value="M2">M² - Metro Quadrado</option>
                <option value="M3">M³ - Metro Cúbico</option>
                <option value="L">L - Litro</option>
                <option value="PCT">PCT - Pacote</option>
              </select>
            </div>
          </div>

          {/* Preços */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="custoMedio" className="text-sm font-medium text-gray-700">
                Custo Médio
              </Label>
              <Input
                id="custoMedio"
                type="number"
                step="0.01"
                value={formData.custoMedio}
                onChange={(e) => handleInputChange('custoMedio', e.target.value)}
                placeholder="0.00"
                className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="precoVenda" className="text-sm font-medium text-gray-700">
                Preço de Venda
              </Label>
              <Input
                id="precoVenda"
                type="number"
                step="0.01"
                value={formData.precoVenda}
                onChange={(e) => handleInputChange('precoVenda', e.target.value)}
                placeholder="0.00"
                className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

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
                className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
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
              placeholder="Descrição detalhada do produto..."
              className="min-h-24 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              rows={4}
            />
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
              className="h-12 px-8 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              disabled={isLoading}
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Salvando...' : 'Salvar SKU'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
