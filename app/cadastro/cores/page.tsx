"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useLanguage } from "../../../components/LanguageContext";

interface Cor {
  id: number;
  nome: string;
  codigoHex: string | null;
  codigoPantone: string | null;
}

export default function Cores() {
  const { t } = useLanguage();
  const [cores, setCores] = useState<Cor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCores = async () => {
      try {
        const response = await fetch('/api/cores');
        if (response.ok) {
          const data = await response.json();
          setCores(data);
        }
      } catch (error) {
        console.error('Erro ao buscar cores:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCores();
  }, []);

  const filteredCores = cores.filter(cor =>
    cor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cor.codigoHex?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cor.codigoPantone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t('colors')}</h1>
              <p className="mt-1 text-sm text-gray-500">
                {t('manageColors')}
              </p>
            </div>
            <nav className="flex space-x-4">
              <Link
                href="/cadastro/cores/novo"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                + {t('newColor')}
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="mb-4">
              <input
                type="text"
                placeholder={t('searchColors')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('color')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('hexCode')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('pantoneCode')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('preview')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCores.map((cor) => (
                    <tr key={cor.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {cor.nome}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {cor.codigoHex || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {cor.codigoPantone || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {cor.codigoHex && (
                          <div
                            className="w-8 h-8 rounded border border-gray-300"
                            style={{ backgroundColor: cor.codigoHex }}
                            title={cor.codigoHex}
                          />
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          href={`/cadastro/cores/${cor.id}`}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          {t('edit')}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredCores.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">{t('noColorsFound')}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
