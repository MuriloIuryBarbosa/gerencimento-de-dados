"use client";

import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "../../../../components/LanguageContext";

export default function NovoSKU() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    id: "",
    nome: "",
    descricao: "",
    categoria: "",
    unidade: "UN",
    precoVenda: "",
    custoMedio: "",
    estoqueMinimo: "",
    estoqueMaximo: ""
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSend = {
        ...formData,
        precoVenda: formData.precoVenda ? parseFloat(formData.precoVenda) : null,
        custoMedio: formData.custoMedio ? parseFloat(formData.custoMedio) : null,
        estoqueMinimo: formData.estoqueMinimo ? parseInt(formData.estoqueMinimo) : null,
        estoqueMaximo: formData.estoqueMaximo ? parseInt(formData.estoqueMaximo) : null
      };

      const response = await fetch('/api/skus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        alert(t('skuCreated'));
        setFormData({
          id: "",
          nome: "",
          descricao: "",
          categoria: "",
          unidade: "UN",
          precoVenda: "",
          custoMedio: "",
          estoqueMinimo: "",
          estoqueMaximo: ""
        });
      } else {
        throw new Error('Erro ao criar SKU');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert(t('errorCreatingSku'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t('newSku')}</h1>
              <p className="mt-1 text-sm text-gray-500">
                {t('fillSkuData')}
              </p>
            </div>
            <nav className="flex space-x-4">
              <Link
                href="/cadastro/skus"
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
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                {t('skuInfo')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('skuCode')} *
                  </label>
                  <input
                    type="text"
                    name="id"
                    value={formData.id}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('skuName')} *
                  </label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('description')}
                  </label>
                  <textarea
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleInputChange}
                    rows={3}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('category')}
                  </label>
                  <input
                    type="text"
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('unit')} *
                  </label>
                  <select
                    name="unidade"
                    value={formData.unidade}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="UN">{t('unit')}</option>
                    <option value="KG">{t('kilogram')}</option>
                    <option value="LT">{t('liter')}</option>
                    <option value="MT">{t('meter')}</option>
                    <option value="M2">{t('squareMeter')}</option>
                    <option value="M3">{t('cubicMeter')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('salePrice')}
                  </label>
                  <input
                    type="number"
                    name="precoVenda"
                    value={formData.precoVenda}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('averageCost')}
                  </label>
                  <input
                    type="number"
                    name="custoMedio"
                    value={formData.custoMedio}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('minStock')}
                  </label>
                  <input
                    type="number"
                    name="estoqueMinimo"
                    value={formData.estoqueMinimo}
                    onChange={handleInputChange}
                    min="0"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('maxStock')}
                  </label>
                  <input
                    type="number"
                    name="estoqueMaximo"
                    value={formData.estoqueMaximo}
                    onChange={handleInputChange}
                    min="0"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Link
              href="/cadastro/skus"
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
            >
              {t('cancel')}
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? t('saving') : t('save')}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
