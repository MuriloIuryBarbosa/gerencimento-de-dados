"use client";

import Link from "next/link";
import { useLanguage } from "../../components/LanguageContext";

export default function Cadastro() {
  const { t } = useLanguage();

  const modulos = [
    {
      nome: t('skus'),
      href: '/cadastro/skus',
      descricao: 'Gerenciar SKUs do sistema',
      icone: '📦'
    },
    {
      nome: t('colors'),
      href: '/cadastro/cores',
      descricao: 'Gerenciar cores disponíveis',
      icone: '🎨'
    },
    {
      nome: t('representatives'),
      href: '/cadastro/representantes',
      descricao: 'Gerenciar representantes',
      icone: '👥'
    },
    {
      nome: t('clients'),
      href: '/cadastro/clientes',
      descricao: 'Gerenciar clientes',
      icone: '🏢'
    },
    {
      nome: t('suppliers'),
      href: '/cadastro/fornecedores',
      descricao: 'Gerenciar fornecedores',
      icone: '🚚'
    },
    {
      nome: t('carriers'),
      href: '/cadastro/transportadoras',
      descricao: 'Gerenciar transportadoras',
      icone: '🚛'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t('registration')}</h1>
              <p className="mt-1 text-sm text-gray-500">
                {t('manageSystemData')}
              </p>
            </div>
            <nav className="flex space-x-4">
              <Link
                href="/"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                ← {t('back')}
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modulos.map((modulo, index) => (
              <Link
                key={index}
                href={modulo.href}
                className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-200"
              >
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white text-xl">
                        {modulo.icone}
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">{modulo.nome}</h3>
                      <p className="text-sm text-gray-500">{modulo.descricao}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
