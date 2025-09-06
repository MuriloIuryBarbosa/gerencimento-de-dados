"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useLanguage } from "../../../components/LanguageContext";

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
  const { t } = useLanguage();
  const [skus, setSkus] = useState<SKU[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchSKUs = async () => {
      try {
        const response = await fetch('/api/skus');
        if (response.ok) {
          const data = await response.json();
          setSkus(data);
        }
      } catch (error) {
        console.error('Erro ao buscar SKUs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSKUs();
  }, []);

  const filteredSkus = skus.filter(sku =>
    sku.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sku.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sku.categoria?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t('skus')}</h1>
              <p className="mt-1 text-sm text-gray-500">
                {t('manageSkus')}
              </p>
            </div>
            <div className="flex space-x-4">
              <Link
                href="/cadastro/skus/novo"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t('newSku')}
              </Link>
              <Link
                href="/cadastro"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                ← {t('back')}
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              placeholder={t('searchSkus')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* SKUs Table */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {filteredSkus.map((sku) => (
                <li key={sku.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900">{sku.nome}</h3>
                          <p className="text-sm text-gray-500">{sku.descricao}</p>
                          <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                            <span>{t('category')}: {sku.categoria || t('notSpecified')}</span>
                            <span>{t('unit')}: {sku.unidade}</span>
                            <span>{t('minStock')}: {sku.estoqueMinimo}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        sku.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {sku.ativo ? t('active') : t('inactive')}
                      </span>
                      <button className="text-blue-600 hover:text-blue-800">
                        {t('edit')}
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            {filteredSkus.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">{t('noSkusFound')}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
