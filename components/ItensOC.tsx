"use client";

import { useState, useEffect } from 'react';
import { Plus, Trash2, Calculator } from 'lucide-react';
import SearchableSelect from './SearchableSelect';

interface ItemOC {
  id: string;
  skuId: string;
  skuNome: string;
  quantidade: number;
  unidade: string;
  valorUnitario: number;
  valorTotal: number;
  observacoes?: string;
}

interface ItensOCProps {
  itens: ItemOC[];
  onItensChange: (itens: ItemOC[]) => void;
  skus: any[];
  onAddSku?: () => void;
}

export default function ItensOC({ itens, onItensChange, skus, onAddSku }: ItensOCProps) {
  const [totalGeral, setTotalGeral] = useState(0);

  useEffect(() => {
    const total = itens.reduce((sum, item) => sum + item.valorTotal, 0);
    setTotalGeral(total);
  }, [itens]);

  const adicionarItem = () => {
    const novoItem: ItemOC = {
      id: Date.now().toString(),
      skuId: '',
      skuNome: '',
      quantidade: 1,
      unidade: 'UN',
      valorUnitario: 0,
      valorTotal: 0,
      observacoes: ''
    };
    onItensChange([...itens, novoItem]);
  };

  const removerItem = (id: string) => {
    onItensChange(itens.filter(item => item.id !== id));
  };

  const atualizarItem = (id: string, campo: keyof ItemOC, valor: any) => {
    const itensAtualizados = itens.map(item => {
      if (item.id === id) {
        const itemAtualizado = { ...item, [campo]: valor };

        // Recalcular valor total quando quantidade ou valor unitário mudar
        if (campo === 'quantidade' || campo === 'valorUnitario') {
          itemAtualizado.valorTotal = itemAtualizado.quantidade * itemAtualizado.valorUnitario;
        }

        return itemAtualizado;
      }
      return item;
    });
    onItensChange(itensAtualizados);
  };

  const handleSkuSelect = (id: string, sku: any) => {
    atualizarItem(id, 'skuId', sku.id);
    atualizarItem(id, 'skuNome', sku.nome);
    // Preencher valores padrão se disponíveis
    if (sku.precoVenda) {
      atualizarItem(id, 'valorUnitario', sku.precoVenda);
    }
    if (sku.unidade) {
      atualizarItem(id, 'unidade', sku.unidade);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header com total */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Calculator size={24} className="text-blue-600" />
          <div>
            <h3 className="text-lg font-semibold text-blue-700">Itens da Ordem de Compra</h3>
            <p className="text-sm text-gray-600">Adicione os produtos que serão comprados</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">
            R$ {totalGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-sm text-gray-500">Total Geral</div>
        </div>
      </div>

      {/* Lista de itens */}
      <div className="space-y-4">
        {itens.map((item, index) => (
          <div key={item.id} className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <div className="flex justify-between items-start mb-4">
              <h4 className="text-md font-semibold text-gray-800">
                Item {index + 1}
              </h4>
              <button
                type="button"
                onClick={() => removerItem(item.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Remover item"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* SKU */}
              <SearchableSelect
                label="Produto/SKU"
                value={item.skuNome}
                onChange={(value) => atualizarItem(item.id, 'skuNome', value)}
                onSelect={(sku) => handleSkuSelect(item.id, sku)}
                onAddNew={onAddSku}
                placeholder="Selecione ou digite o produto..."
                searchPlaceholder="Buscar produto..."
                items={skus}
                displayField="nome"
                valueField="id"
                addButtonText="Adicionar Novo SKU"
                required
              />

              {/* Quantidade e Unidade */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-blue-700">
                    Quantidade *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantidade}
                    onChange={(e) => atualizarItem(item.id, 'quantidade', parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-blue-700">
                    Unidade
                  </label>
                  <select
                    value={item.unidade}
                    onChange={(e) => atualizarItem(item.id, 'unidade', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  >
                    <option value="UN">UN</option>
                    <option value="KG">KG</option>
                    <option value="M">M</option>
                    <option value="M2">M²</option>
                    <option value="M3">M³</option>
                    <option value="L">L</option>
                    <option value="PCT">PCT</option>
                  </select>
                </div>
              </div>

              {/* Valor Unitário e Total */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-blue-700">
                    Valor Unitário (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={item.valorUnitario}
                    onChange={(e) => atualizarItem(item.id, 'valorUnitario', parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-blue-700">
                    Valor Total (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={item.valorTotal.toFixed(2)}
                    readOnly
                    className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-xl text-gray-700 font-semibold"
                  />
                </div>
              </div>

              {/* Observações */}
              <div className="lg:col-span-2 space-y-2">
                <label className="block text-sm font-semibold text-blue-700">
                  Observações
                </label>
                <textarea
                  value={item.observacoes || ''}
                  onChange={(e) => atualizarItem(item.id, 'observacoes', e.target.value)}
                  rows={2}
                  placeholder="Observações específicas para este item..."
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Botão para adicionar item */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={adicionarItem}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Plus size={20} />
          <span>Adicionar Item</span>
        </button>
      </div>

      {/* Resumo */}
      {itens.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-lg font-semibold text-blue-800">Resumo da OC</h4>
              <p className="text-sm text-blue-600">{itens.length} item(s) adicionado(s)</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">
                R$ {totalGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <div className="text-sm text-blue-500">Valor Total</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
