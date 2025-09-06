"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useLanguage } from "../../../components/LanguageContext";

interface Representante {
  id: number;
  nome: string;
  email: string | null;
  telefone: string | null;
  empresa: string | null;
  comissao: number | null;
  ativo: boolean;
}

export default function Representantes() {
  const { t } = useLanguage();
  const [representantes, setRepresentantes] = useState<Representante[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchRepresentantes = async () => {
      try {
        const response = await fetch('/api/representantes');
        if (response.ok) {
          const data = await response.json();
          setRepresentantes(data);
        }
      } catch (error) {
        console.error('Erro ao buscar representantes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRepresentantes();
  }, []);

  const filteredRepresentantes = representantes.filter(representante =>
    representante.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    representante.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    representante.empresa?.toLowerCase().includes(searchTerm.toLowerCase())
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
              <h1 className="text-3xl font-bold text-gray-900">{t('representatives')}</h1>
              <p className="mt-1 text-sm text-gray-500">
                {t('manageRepresentatives')}
              </p>
            </div>
            <nav className="flex space-x-4">
              <Link
                href="/cadastro/representantes/novo"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                + {t('newRepresentative')}
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
                placeholder={t('searchRepresentatives')}
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
                      {t('name')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('email')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('phone')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('company')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('commission')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRepresentantes.map((representante) => (
                    <tr key={representante.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {representante.nome}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {representante.email || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {representante.telefone || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {representante.empresa || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {representante.comissao ? `${representante.comissao}%` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          href={`/cadastro/representantes/${representante.id}`}
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

            {filteredRepresentantes.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">{t('noRepresentativesFound')}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
