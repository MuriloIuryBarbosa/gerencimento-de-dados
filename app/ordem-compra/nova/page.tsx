"use client";

import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "../../../components/LanguageContext";

export default function NovaOrdemCompra() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    fornecedor: "",
    cnpj: "",
    endereco: "",
    telefone: "",
    email: "",
    condicaoPagamento: "",
    prazoEntrega: "",
    observacoes: "",
    itens: [
      {
        descricao: "",
        quantidade: 1,
        unidade: "un",
        valorUnitario: 0,
        valorTotal: 0
      }
    ]
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const updatedItens = [...formData.itens];
    updatedItens[index] = {
      ...updatedItens[index],
      [field]: value
    };

    // Calcular valor total do item
    if (field === 'quantidade' || field === 'valorUnitario') {
      const quantidade = field === 'quantidade' ? Number(value) : updatedItens[index].quantidade;
      const valorUnitario = field === 'valorUnitario' ? Number(value) : updatedItens[index].valorUnitario;
      updatedItens[index].valorTotal = quantidade * valorUnitario;
    }

    setFormData(prev => ({
      ...prev,
      itens: updatedItens
    }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      itens: [
        ...prev.itens,
        {
          descricao: "",
          quantidade: 1,
          unidade: "un",
          valorUnitario: 0,
          valorTotal: 0
        }
      ]
    }));
  };

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      itens: prev.itens.filter((_, i) => i !== index)
    }));
  };

  const calcularTotalGeral = () => {
    return formData.itens.reduce((total, item) => total + item.valorTotal, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implementar envio para API
    console.log("Dados da ordem:", formData);
    alert("Ordem de compra criada com sucesso! (Simulação)");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t('newPurchaseOrder')}</h1>
              <p className="mt-1 text-sm text-gray-500">
                {t('fillDataNewOrder')}
              </p>
            </div>
            <nav className="flex space-x-4">
              <Link
                href="/ordem-compra"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                ← {t('back')}
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Dados do Fornecedor */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                {t('supplierInfo')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('supplier')} *
                  </label>
                  <input
                    type="text"
                    name="fornecedor"
                    value={formData.fornecedor}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('cnpj')}
                  </label>
                  <input
                    type="text"
                    name="cnpj"
                    value={formData.cnpj}
                    onChange={handleInputChange}
                    placeholder="00.000.000/0000-00"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('address')}
                  </label>
                  <input
                    type="text"
                    name="endereco"
                    value={formData.endereco}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('phone')}
                  </label>
                  <input
                    type="tel"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleInputChange}
                    placeholder="(00) 00000-0000"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Condições Comerciais */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                {t('paymentTerms')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('paymentTerms')} *
                  </label>
                  <select
                    name="condicaoPagamento"
                    value={formData.condicaoPagamento}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Selecione...</option>
                    <option value="avista">À Vista</option>
                    <option value="30dias">30 Dias</option>
                    <option value="60dias">60 Dias</option>
                    <option value="90dias">90 Dias</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('deliveryDeadline')} *
                  </label>
                  <input
                    type="date"
                    name="prazoEntrega"
                    value={formData.prazoEntrega}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Itens da Ordem */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {t('items')}
                </h3>
                <button
                  type="button"
                  onClick={addItem}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  {t('addItem')}
                </button>
              </div>

              <div className="space-y-4">
                {formData.itens.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-sm font-medium text-gray-900">{t('items')} {index + 1}</h4>
                      {formData.itens.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">
                          {t('description')} *
                        </label>
                        <input
                          type="text"
                          value={item.descricao}
                          onChange={(e) => handleItemChange(index, 'descricao', e.target.value)}
                          required
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          {t('quantity')} *
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantidade}
                          onChange={(e) => handleItemChange(index, 'quantidade', Number(e.target.value))}
                          required
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          {t('unit')}
                        </label>
                        <select
                          value={item.unidade}
                          onChange={(e) => handleItemChange(index, 'unidade', e.target.value)}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="un">Unidade</option>
                          <option value="kg">Kg</option>
                          <option value="m">Metro</option>
                          <option value="m2">M²</option>
                          <option value="l">Litro</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          {t('unitValue')} *
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.valorUnitario}
                          onChange={(e) => handleItemChange(index, 'valorUnitario', Number(e.target.value))}
                          required
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end">
                      <div className="text-sm text-gray-600">
                        {t('totalValue')}: <span className="font-semibold">R$ {item.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Geral */}
              <div className="mt-6 border-t pt-4">
                <div className="flex justify-end">
                  <div className="text-lg font-semibold text-gray-900">
                    {t('generalTotal')}: R$ {calcularTotalGeral().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Observações */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                {t('observations')}
              </h3>
              <div>
                <textarea
                  name="observacoes"
                  value={formData.observacoes}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Digite observações adicionais sobre a ordem de compra..."
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-end space-x-4">
            <Link
              href="/ordem-compra"
              className="px-6 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              {t('cancel')}
            </Link>
            <button
              type="submit"
              className="px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {t('createOrder')}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
