"use client";

import Link from "next/link";
import { useState } from "react";

export default function NovaRequisicao() {
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    departamento: "",
    prioridade: "Média",
    valorEstimado: "",
    justificativa: "",
    observacoes: ""
  });

  const [itens, setItens] = useState([
    { id: 1, descricao: "", quantidade: "", unidade: "", valorUnitario: "" }
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleItemChange = (id: number, field: string, value: string) => {
    setItens(prev => prev.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const addItem = () => {
    const newId = Math.max(...itens.map(item => item.id)) + 1;
    setItens(prev => [...prev, { id: newId, descricao: "", quantidade: "", unidade: "", valorUnitario: "" }]);
  };

  const removeItem = (id: number) => {
    if (itens.length > 1) {
      setItens(prev => prev.filter(item => item.id !== id));
    }
  };

  const calcularTotal = () => {
    return itens.reduce((total, item) => {
      const quantidade = parseFloat(item.quantidade) || 0;
      const valorUnitario = parseFloat(item.valorUnitario) || 0;
      return total + (quantidade * valorUnitario);
    }, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui seria implementada a lógica para salvar a requisição
    console.log("Dados da requisição:", { ...formData, itens, total: calcularTotal() });
    alert("Requisição criada com sucesso!");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Nova Requisição</h1>
              <p className="mt-1 text-sm text-gray-500">
                Crie uma nova requisição de compra
              </p>
            </div>
            <nav className="flex space-x-4">
              <Link
                href="/requisicoes"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                ← Voltar
              </Link>
              <Link
                href="/dashboard"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Dashboard
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Informações Básicas</h3>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">
                    Título da Requisição *
                  </label>
                  <input
                    type="text"
                    name="titulo"
                    id="titulo"
                    required
                    value={formData.titulo}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Ex: Materiais para produção"
                  />
                </div>
                <div>
                  <label htmlFor="departamento" className="block text-sm font-medium text-gray-700">
                    Departamento *
                  </label>
                  <select
                    name="departamento"
                    id="departamento"
                    required
                    value={formData.departamento}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="">Selecione um departamento</option>
                    <option value="Produção">Produção</option>
                    <option value="Manutenção">Manutenção</option>
                    <option value="Administrativo">Administrativo</option>
                    <option value="Vendas">Vendas</option>
                    <option value="RH">Recursos Humanos</option>
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">
                  Descrição *
                </label>
                <textarea
                  name="descricao"
                  id="descricao"
                  required
                  rows={3}
                  value={formData.descricao}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Descreva detalhadamente o que está sendo solicitado"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="prioridade" className="block text-sm font-medium text-gray-700">
                    Prioridade
                  </label>
                  <select
                    name="prioridade"
                    id="prioridade"
                    value={formData.prioridade}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="Baixa">Baixa</option>
                    <option value="Média">Média</option>
                    <option value="Alta">Alta</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="valorEstimado" className="block text-sm font-medium text-gray-700">
                    Valor Estimado (R$)
                  </label>
                  <input
                    type="number"
                    name="valorEstimado"
                    id="valorEstimado"
                    step="0.01"
                    value={formData.valorEstimado}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Itens da Requisição */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Itens Solicitados</h3>
              <button
                type="button"
                onClick={addItem}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Adicionar Item
              </button>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-4">
                {itens.map((item, index) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-sm font-medium text-gray-900">Item {index + 1}</h4>
                      {itens.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remover
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Descrição *
                        </label>
                        <input
                          type="text"
                          required
                          value={item.descricao}
                          onChange={(e) => handleItemChange(item.id, 'descricao', e.target.value)}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="Descrição do item"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Quantidade *
                        </label>
                        <input
                          type="number"
                          required
                          min="1"
                          step="0.01"
                          value={item.quantidade}
                          onChange={(e) => handleItemChange(item.id, 'quantidade', e.target.value)}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Unidade
                        </label>
                        <input
                          type="text"
                          value={item.unidade}
                          onChange={(e) => handleItemChange(item.id, 'unidade', e.target.value)}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="un, kg, m, etc."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Valor Unitário (R$) *
                        </label>
                        <input
                          type="number"
                          required
                          step="0.01"
                          value={item.valorUnitario}
                          onChange={(e) => handleItemChange(item.id, 'valorUnitario', e.target.value)}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Valor Total
                        </label>
                        <div className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-gray-50 rounded-md shadow-sm text-sm text-gray-900">
                          R$ {((parseFloat(item.quantidade) || 0) * (parseFloat(item.valorUnitario) || 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 border-t border-gray-200 pt-4">
                <div className="flex justify-end">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Valor Total Estimado</p>
                    <p className="text-lg font-semibold text-gray-900">
                      R$ {calcularTotal().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Justificativa e Observações */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Justificativa e Observações</h3>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <label htmlFor="justificativa" className="block text-sm font-medium text-gray-700">
                  Justificativa da Compra *
                </label>
                <textarea
                  name="justificativa"
                  id="justificativa"
                  required
                  rows={3}
                  value={formData.justificativa}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Explique por que esta compra é necessária"
                />
              </div>
              <div>
                <label htmlFor="observacoes" className="block text-sm font-medium text-gray-700">
                  Observações Adicionais
                </label>
                <textarea
                  name="observacoes"
                  id="observacoes"
                  rows={2}
                  value={formData.observacoes}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Informações adicionais relevantes"
                />
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-end space-x-4">
            <Link
              href="/requisicoes"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Criar Requisição
            </button>
          </div>
        </form>

        {/* Informações sobre o fluxo */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Sobre o Processo de Aprovação
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  Após criar a requisição, ela será automaticamente vinculada a uma ordem de compra existente.
                  Para ser aprovada, a requisição deve estar vinculada a uma proforma válida.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
