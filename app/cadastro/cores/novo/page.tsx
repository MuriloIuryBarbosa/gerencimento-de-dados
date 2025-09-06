"use client";

import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "../../../../components/LanguageContext";

export default function NovaCor() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    nome: "",
    codigoHex: "",
    codigoPantone: ""
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      const response = await fetch('/api/cores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert(t('colorCreated'));
        setFormData({
          nome: "",
          codigoHex: "",
          codigoPantone: ""
        });
      } else {
        throw new Error('Erro ao criar cor');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert(t('errorCreatingColor'));
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
              <h1 className="text-3xl font-bold text-gray-900">{t('newColor')}</h1>
              <p className="mt-1 text-sm text-gray-500">
                {t('fillColorData')}
              </p>
            </div>
            <nav className="flex space-x-4">
              <Link
                href="/cadastro/cores"
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
                {t('colorInfo')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('colorName')} *
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
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('hexCode')}
                  </label>
                  <input
                    type="text"
                    name="codigoHex"
                    value={formData.codigoHex}
                    onChange={handleInputChange}
                    placeholder="#000000"
                    pattern="^#[0-9A-Fa-f]{6}$"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('pantoneCode')}
                  </label>
                  <input
                    type="text"
                    name="codigoPantone"
                    value={formData.codigoPantone}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('preview')}
                  </label>
                  <div className="mt-1 flex items-center space-x-4">
                    <div
                      className="w-16 h-16 rounded border border-gray-300"
                      style={{
                        backgroundColor: formData.codigoHex || '#ffffff'
                      }}
                    />
                    <span className="text-sm text-gray-500">
                      {formData.codigoHex || '#ffffff'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Link
              href="/cadastro/cores"
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
