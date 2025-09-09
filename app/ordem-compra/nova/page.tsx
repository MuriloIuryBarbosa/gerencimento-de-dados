"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useLanguage } from "../../../components/LanguageContext";
import { Save, FileText, Eye, EyeOff, Users, Calendar, DollarSign, Package, Truck, Factory, Globe, Plus, Search, X } from 'lucide-react';
import EmpresaModal from "../../../components/EmpresaModal";
import SKUModal from "../../../components/SKUModal";

interface Empresa {
  id: number;
  nome: string;
  cnpj: string;
}

interface SKU {
  id: string;
  nome: string;
  descricao: string;
  categoria: string;
  unidade: string;
  precoVenda: number | null;
  custoMedio: number | null;
  estoqueMinimo: number;
}

interface ItemOrdemCompra {
  id: string;
  skuId: string;
  skuNome: string;
  quantidade: number;
  unidade: string;
  valorUnitario: number;
  valorTotal: number;
  descricao: string;
}

export default function NovaOrdemCompra() {
  const { t } = useLanguage();
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [skus, setSkus] = useState<SKU[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPI, setShowPI] = useState(false);
  const [isDraft, setIsDraft] = useState(false);
  const [showEmpresaModal, setShowEmpresaModal] = useState(false);
  const [showSKUModal, setShowSKUModal] = useState(false);

  // Estados para busca
  const [skuSearch, setSkuSearch] = useState('');
  const [showSkuDropdown, setShowSkuDropdown] = useState(false);
  const [selectedSku, setSelectedSku] = useState<SKU | null>(null);

  // Estados para múltiplos itens
  const [itens, setItens] = useState<ItemOrdemCompra[]>([]);
  const [currentItem, setCurrentItem] = useState({
    skuId: '',
    skuNome: '',
    quantidade: 1,
    unidade: 'UN',
    valorUnitario: 0,
    valorTotal: 0,
    descricao: ''
  });

  const [formData, setFormData] = useState({
    // Campos OC (Ordem de Compra) - Azul
    empresaId: "",
    empresaNome: "",
    uneg: "",
    familiaCodigo: "",
    familiaNome: "",
    produtoDescricao: "",
    codTamanho: "",
    observacao: "",
    capacidadeContainer: "",
    planejadoCompra: "",
    etdTarget: "",
    weekEtd: "",
    transitTime: "",
    leadTime: "",
    factoryDate: "",
    weekFactory: "",
    dateOfSale: "",
    propCont: "",
    originalTotalValue: "",
    costInDollars: "",
    totalValueDollarsItem: "",
    totalValueDollarsUc: "",

    // Campos PI (Proforma Invoice) - Verde
    piNumero: "",
    piDate: "",
    piCountry: "",
    piSupplier: "",
    piObs: "",
    piOriginalCurrency: "",
    piOriginalCost: "",

    // Totais
    totalContainers: "",

    // Controle
    compartilhadoCom: [] as string[]
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscar empresas da API
        const empresasResponse = await fetch('/api/empresas');
        if (empresasResponse.ok) {
          const empresasData = await empresasResponse.json();
          if (empresasData.success) {
            setEmpresas(empresasData.data);
          }
        }

        // Buscar SKUs da API
        const skusResponse = await fetch('/api/skus?limit=50');
        if (skusResponse.ok) {
          const skusData = await skusResponse.json();
          if (skusData.success) {
            setSkus(skusData.data);
          }
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSkuSearch = async (searchTerm: string) => {
    setSkuSearch(searchTerm);
    if (searchTerm.length >= 2) {
      try {
        const response = await fetch(`/api/skus?search=${encodeURIComponent(searchTerm)}&limit=10`);
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setSkus(data.data);
            setShowSkuDropdown(true);
          }
        }
      } catch (error) {
        console.error('Erro ao buscar SKUs:', error);
      }
    } else {
      setShowSkuDropdown(false);
    }
  };

  const handleSkuSelect = (sku: SKU) => {
    setSelectedSku(sku);
    setSkuSearch(sku.nome);
    setShowSkuDropdown(false);

    // Preencher campos automaticamente
    setFormData(prev => ({
      ...prev,
      produtoDescricao: sku.descricao && sku.descricao !== sku.nome ? sku.descricao : sku.nome,
      uneg: sku.id.substring(0, 6), // Extrair UNEG do ID do SKU
      familiaCodigo: sku.categoria || '',
      familiaNome: sku.categoria || ''
    }));

    // Atualizar item atual
    setCurrentItem(prev => ({
      ...prev,
      skuId: sku.id,
      skuNome: sku.nome,
      unidade: sku.unidade,
      valorUnitario: sku.custoMedio || sku.precoVenda || 0,
      descricao: sku.descricao || sku.nome
    }));
  };

  const handleAddItem = () => {
    if (!currentItem.skuId || !currentItem.skuNome) {
      alert('Selecione um SKU primeiro!');
      return;
    }

    if (currentItem.quantidade <= 0) {
      alert('Quantidade deve ser maior que zero!');
      return;
    }

    const valorTotal = currentItem.quantidade * currentItem.valorUnitario;

    const newItem: ItemOrdemCompra = {
      id: `item_${Date.now()}`,
      ...currentItem,
      valorTotal
    };

    setItens(prev => [...prev, newItem]);

    // Reset current item
    setCurrentItem({
      skuId: '',
      skuNome: '',
      quantidade: 1,
      unidade: 'UN',
      valorUnitario: 0,
      valorTotal: 0,
      descricao: ''
    });
    setSelectedSku(null);
    setSkuSearch('');
  };

  const handleRemoveItem = (itemId: string) => {
    setItens(prev => prev.filter(item => item.id !== itemId));
  };

  const handleItemChange = (field: string, value: any) => {
    setCurrentItem(prev => {
      const updated = { ...prev, [field]: value };

      // Recalcular valor total quando quantidade ou valor unitário mudar
      if (field === 'quantidade' || field === 'valorUnitario') {
        updated.valorTotal = updated.quantidade * updated.valorUnitario;
      }

      return updated;
    });
  };

  const getTotalValue = () => {
    return itens.reduce((total, item) => total + item.valorTotal, 0);
  };

  const handleEmpresaSave = (novaEmpresa: any) => {
    // Adicionar a nova empresa à lista
    const empresaAdicionada = {
      id: Date.now(), // ID temporário
      nome: novaEmpresa.nome,
      cnpj: novaEmpresa.cnpj
    };
    setEmpresas(prev => [...prev, empresaAdicionada]);

    // Selecionar automaticamente a nova empresa
    setFormData(prev => ({
      ...prev,
      empresaId: empresaAdicionada.id.toString(),
      empresaNome: empresaAdicionada.nome
    }));

    // Fechar o modal
    setShowEmpresaModal(false);
  };

  const handleSKUSave = (novoSKU: any) => {
    // Adicionar o novo SKU à lista
    setSkus(prev => [...prev, novoSKU]);

    // Selecionar automaticamente o novo SKU
    handleSkuSelect(novoSKU);

    // Fechar o modal
    setShowSKUModal(false);
  };

  const handleEmpresaCancel = () => {
    setShowEmpresaModal(false);
  };

  const handleEmpresaChange = (empresaId: string) => {
    const empresa = empresas.find(e => e.id.toString() === empresaId);
    if (empresa) {
      setFormData(prev => ({
        ...prev,
        empresaId,
        empresaNome: empresa.nome
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent, saveAsDraft = false) => {
    e.preventDefault();

    if (itens.length === 0) {
      alert('Adicione pelo menos um item à ordem de compra!');
      return;
    }

    try {
      const id = `OC-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;

      const ordemData = {
        id,
        ...formData,
        itens, // Incluir os itens
        valorTotal: getTotalValue(), // Calcular valor total
        status: saveAsDraft ? 'Rascunho' : 'Pendente Aprovação',
        usuarioCriadorNome: 'Administrador', // Em produção, viria do contexto do usuário
        dataCriacao: new Date().toISOString()
      };

      const response = await fetch('/api/ordens-compra-novo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ordemData),
      });

      if (response.ok) {
        alert(saveAsDraft ? 'Rascunho salvo com sucesso!' : 'Ordem de compra criada com sucesso!');
        if (!saveAsDraft) {
          // Resetar formulário ou redirecionar
          window.location.href = '/ordem-compra';
        }
      } else {
        const errorData = await response.json();
        alert(`Erro: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao salvar ordem de compra');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando formulário...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Moderno */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-full">
                <FileText size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Nova Ordem de Compra</h1>
                <p className="mt-1 text-blue-100">
                  Preencha os dados da OC e Proforma Invoice
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-full">
                <Eye size={16} className="text-white" />
                <span className="text-white text-sm">Modo Visual</span>
              </div>
              <Link
                href="/ordem-compra"
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full transition-colors duration-200"
              >
                ← Voltar
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-8">

          {/* Seção OC - Ordem de Compra (Azul) */}
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden border-l-8 border-blue-500">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
              <div className="flex items-center space-x-3">
                <Package size={24} className="text-white" />
                <h2 className="text-xl font-bold text-white">📋 Ordem de Compra (OC)</h2>
              </div>
              <p className="text-blue-100 text-sm mt-1">Dados principais da ordem de compra</p>
            </div>

            <div className="p-6 space-y-6">
              {/* Linha 1 - Empresa e Produto */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-sm font-semibold text-blue-700">
                    <Factory size={16} />
                    <span>Empresa *</span>
                  </label>
                  <div className="flex gap-2">
                    <select
                      name="empresaId"
                      value={formData.empresaId}
                      onChange={(e) => handleEmpresaChange(e.target.value)}
                      required
                      className="flex-1 px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                    >
                      <option value="">Selecione a empresa...</option>
                      {empresas.map((empresa) => (
                        <option key={empresa.id} value={empresa.id}>
                          {empresa.nome} - {empresa.cnpj}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setShowEmpresaModal(true)}
                      className="px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
                      title="Adicionar nova empresa"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-sm font-semibold text-blue-700">
                    <Package size={16} />
                    <span>Produto *</span>
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={skuSearch}
                        onChange={(e) => handleSkuSearch(e.target.value)}
                        onFocus={() => skuSearch && setShowSkuDropdown(true)}
                        placeholder="Buscar SKU por nome ou ID..."
                        className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                      />
                      {showSkuDropdown && skus.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                          {skus.map((sku) => (
                            <div
                              key={sku.id}
                              onClick={() => handleSkuSelect(sku)}
                              className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                            >
                              <div className="font-medium text-gray-900">{sku.nome}</div>
                              <div className="text-sm text-gray-500">
                                ID: {sku.id} | Categoria: {sku.categoria || 'N/A'} | Preço: {sku.precoVenda ? `R$ ${sku.precoVenda.toFixed(2)}` : 'N/A'}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowSKUModal(true)}
                      className="px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
                      title="Adicionar novo SKU"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                  {selectedSku && (
                    <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="text-sm text-blue-800">
                        <strong>Selecionado:</strong> {selectedSku.nome} ({selectedSku.id})
                      </div>
                      <div className="text-xs text-blue-600 mt-1">
                        Categoria: {selectedSku.categoria || 'N/A'} |
                        Unidade: {selectedSku.unidade} |
                        Preço: {selectedSku.precoVenda ? `R$ ${selectedSku.precoVenda.toFixed(2)}` : 'N/A'}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Seção de Itens da Ordem de Compra */}
              <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-purple-800">📦 Itens da Ordem de Compra</h3>
                  <div className="text-sm text-purple-600">
                    Total: <span className="font-bold">R$ {getTotalValue().toFixed(2)}</span>
                  </div>
                </div>

                {/* Formulário para adicionar item */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6 p-4 bg-white rounded-lg border border-purple-200">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-purple-700">Quantidade</label>
                    <input
                      type="number"
                      min="1"
                      value={currentItem.quantidade}
                      onChange={(e) => handleItemChange('quantidade', parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-purple-700">Unidade</label>
                    <select
                      value={currentItem.unidade}
                      onChange={(e) => handleItemChange('unidade', e.target.value)}
                      className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                    >
                      <option value="UN">UN</option>
                      <option value="KG">KG</option>
                      <option value="M">M</option>
                      <option value="M2">M²</option>
                      <option value="M3">M³</option>
                      <option value="L">L</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-purple-700">Valor Unitário</label>
                    <input
                      type="number"
                      step="0.01"
                      value={currentItem.valorUnitario}
                      onChange={(e) => handleItemChange('valorUnitario', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                      placeholder="0.00"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-purple-700">Valor Total</label>
                    <input
                      type="number"
                      step="0.01"
                      value={currentItem.valorTotal.toFixed(2)}
                      readOnly
                      className="w-full px-3 py-2 border border-purple-300 rounded-lg bg-gray-50"
                    />
                  </div>

                  <div className="space-y-2 flex items-end">
                    <button
                      type="button"
                      onClick={handleAddItem}
                      disabled={!selectedSku}
                      className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus size={16} className="inline mr-2" />
                      Adicionar
                    </button>
                  </div>
                </div>

                {/* Lista de itens */}
                {itens.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-md font-semibold text-purple-800 mb-3">Itens Adicionados:</h4>
                    {itens.map((item, index) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-purple-200">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{item.skuNome}</div>
                          <div className="text-sm text-gray-600">
                            {item.quantidade} {item.unidade} × R$ {item.valorUnitario.toFixed(2)} = R$ {item.valorTotal.toFixed(2)}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                          title="Remover item"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {itens.length === 0 && (
                  <div className="text-center py-8 text-purple-600">
                    <Package size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Nenhum item adicionado ainda.</p>
                    <p className="text-sm">Selecione um SKU e adicione itens à ordem de compra.</p>
                  </div>
                )}
              </div>

              {/* Linha 2 - UNEG e Família */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-blue-700">UNEG</label>
                  <input
                    type="text"
                    name="uneg"
                    value={formData.uneg}
                    onChange={handleInputChange}
                    placeholder="Código UNEG"
                    className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-blue-700">Família (Código)</label>
                  <input
                    type="text"
                    name="familiaCodigo"
                    value={formData.familiaCodigo}
                    onChange={handleInputChange}
                    placeholder="Código da família"
                    className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-blue-700">Família (Nome)</label>
                  <input
                    type="text"
                    name="familiaNome"
                    value={formData.familiaNome}
                    onChange={handleInputChange}
                    placeholder="Nome da família"
                    className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Linha 3 - Descrição e Tamanho */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-blue-700">Descrição do Produto</label>
                  <input
                    type="text"
                    name="produtoDescricao"
                    value={formData.produtoDescricao}
                    onChange={handleInputChange}
                    placeholder="Descrição completa do produto"
                    className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-blue-700">Código Tamanho</label>
                  <input
                    type="text"
                    name="codTamanho"
                    value={formData.codTamanho}
                    onChange={handleInputChange}
                    placeholder="Código do tamanho"
                    className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Linha 4 - Capacidade e Planejado */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-blue-700">Capacidade do Container</label>
                  <input
                    type="text"
                    name="capacidadeContainer"
                    value={formData.capacidadeContainer}
                    onChange={handleInputChange}
                    placeholder="Ex: 20FT, 40FT, etc."
                    className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-blue-700">Planejado para Compra</label>
                  <input
                    type="number"
                    name="planejadoCompra"
                    value={formData.planejadoCompra}
                    onChange={handleInputChange}
                    placeholder="Quantidade planejada"
                    className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Linha 5 - Datas ETD */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-sm font-semibold text-blue-700">
                    <Calendar size={16} />
                    <span>ETD Target</span>
                  </label>
                  <input
                    type="date"
                    name="etdTarget"
                    value={formData.etdTarget}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-blue-700">Week ETD</label>
                  <input
                    type="text"
                    name="weekEtd"
                    value={formData.weekEtd}
                    onChange={handleInputChange}
                    placeholder="Semana ETD"
                    className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-blue-700">Transit Time</label>
                  <input
                    type="number"
                    name="transitTime"
                    value={formData.transitTime}
                    onChange={handleInputChange}
                    placeholder="Dias"
                    className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Linha 6 - Lead Time e Factory */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-blue-700">Lead Time</label>
                  <input
                    type="number"
                    name="leadTime"
                    value={formData.leadTime}
                    onChange={handleInputChange}
                    placeholder="Dias"
                    className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-blue-700">Factory Date</label>
                  <input
                    type="date"
                    name="factoryDate"
                    value={formData.factoryDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-blue-700">Week Factory</label>
                  <input
                    type="text"
                    name="weekFactory"
                    value={formData.weekFactory}
                    onChange={handleInputChange}
                    placeholder="Semana Factory"
                    className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-blue-700">Date of Sale</label>
                  <input
                    type="date"
                    name="dateOfSale"
                    value={formData.dateOfSale}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Linha 7 - Valores */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-blue-700">Prop. Cont.</label>
                  <input
                    type="text"
                    name="propCont"
                    value={formData.propCont}
                    onChange={handleInputChange}
                    placeholder="Proposta container"
                    className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-blue-700">Original Total Value</label>
                  <input
                    type="number"
                    step="0.01"
                    name="originalTotalValue"
                    value={formData.originalTotalValue}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-blue-700">Cost in Dollars</label>
                  <input
                    type="number"
                    step="0.01"
                    name="costInDollars"
                    value={formData.costInDollars}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-blue-700">Total Value in Dollars (Item)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="totalValueDollarsItem"
                    value={formData.totalValueDollarsItem}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Linha 8 - Valores Finais */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-blue-700">Total Value in Dollars (UC)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="totalValueDollarsUc"
                    value={formData.totalValueDollarsUc}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-blue-700">Total de Containers</label>
                  <input
                    type="number"
                    name="totalContainers"
                    value={formData.totalContainers}
                    onChange={handleInputChange}
                    placeholder="Quantidade"
                    className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Observação OC */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-blue-700">Observação (OC)</label>
                <textarea
                  name="observacao"
                  value={formData.observacao}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Observações da ordem de compra..."
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* Seção PI - Proforma Invoice (Verde) */}
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden border-l-8 border-green-500">
            <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText size={24} className="text-white" />
                  <h2 className="text-xl font-bold text-white">📄 Proforma Invoice (PI)</h2>
                  <button
                    type="button"
                    onClick={() => setShowPI(!showPI)}
                    className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors duration-200"
                  >
                    {showPI ? <EyeOff size={16} /> : <Eye size={16} />}
                    <span className="text-sm">{showPI ? 'Ocultar' : 'Mostrar'}</span>
                  </button>
                </div>
                <div className="text-green-100 text-sm">
                  Campos opcionais da PI
                </div>
              </div>
            </div>

            {showPI && (
              <div className="p-6 space-y-6">
                {/* Linha 1 - PI Básico */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-green-700">
                      <FileText size={16} />
                      <span>PI Número</span>
                    </label>
                    <input
                      type="text"
                      name="piNumero"
                      value={formData.piNumero}
                      onChange={handleInputChange}
                      placeholder="Número da PI"
                      className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-green-700">
                      <Calendar size={16} />
                      <span>PI Date</span>
                    </label>
                    <input
                      type="date"
                      name="piDate"
                      value={formData.piDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-green-700">
                      <Globe size={16} />
                      <span>PI Country</span>
                    </label>
                    <input
                      type="text"
                      name="piCountry"
                      value={formData.piCountry}
                      onChange={handleInputChange}
                      placeholder="País da PI"
                      className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Linha 2 - Fornecedor PI */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-green-700">
                      <Truck size={16} />
                      <span>PI Supplier</span>
                    </label>
                    <input
                      type="text"
                      name="piSupplier"
                      value={formData.piSupplier}
                      onChange={handleInputChange}
                      placeholder="Fornecedor da PI"
                      className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-green-700">
                      <DollarSign size={16} />
                      <span>PI Original Currency</span>
                    </label>
                    <select
                      name="piOriginalCurrency"
                      value={formData.piOriginalCurrency}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                    >
                      <option value="">Selecione...</option>
                      <option value="USD">USD - Dólar Americano</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="CNY">CNY - Yuan Chinês</option>
                      <option value="BRL">BRL - Real Brasileiro</option>
                    </select>
                  </div>
                </div>

                {/* Linha 3 - Valores PI */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-green-700">PI Original Cost</label>
                    <input
                      type="number"
                      step="0.01"
                      name="piOriginalCost"
                      value={formData.piOriginalCost}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-green-700">PI Observações</label>
                    <textarea
                      name="piObs"
                      value={formData.piObs}
                      onChange={handleInputChange}
                      rows={2}
                      placeholder="Observações da Proforma Invoice..."
                      className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Botões de Ação Modernos */}
          <div className="bg-white shadow-xl rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isDraft}
                    onChange={(e) => setIsDraft(e.target.checked)}
                    className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Salvar como rascunho</span>
                </label>

                {isDraft && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Users size={16} />
                    <span>Rascunhos são privados por padrão</span>
                  </div>
                )}
              </div>

              <div className="flex space-x-4">
                <Link
                  href="/ordem-compra"
                  className="px-6 py-3 border-2 border-gray-300 rounded-xl text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200"
                >
                  Cancelar
                </Link>

                <button
                  type="button"
                  onClick={(e) => handleSubmit(e, true)}
                  className="flex items-center space-x-2 px-6 py-3 border-2 border-orange-300 rounded-xl text-sm font-semibold text-orange-700 bg-orange-50 hover:bg-orange-100 transition-all duration-200"
                >
                  <Save size={18} />
                  <span>Salvar Rascunho</span>
                </button>

                <button
                  type="submit"
                  className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-sm font-semibold text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <FileText size={18} />
                  <span>Criar Ordem de Compra</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </main>

      {/* Modal de Cadastro de Empresa */}
      <EmpresaModal
        isOpen={showEmpresaModal}
        onSave={handleEmpresaSave}
        onCancel={handleEmpresaCancel}
      />

      {/* Modal de Cadastro de SKU */}
      <SKUModal
        isOpen={showSKUModal}
        onSave={handleSKUSave}
        onCancel={() => setShowSKUModal(false)}
      />
    </div>
  );
}
