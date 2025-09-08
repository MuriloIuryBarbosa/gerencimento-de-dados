"use client";

import { useRouter } from 'next/navigation';
import { ShieldX, ArrowLeft, Home } from 'lucide-react';
import { useLanguage } from '../../components/LanguageContext';

export default function UnauthorizedPage() {
  const router = useRouter();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <ShieldX size={32} className="text-red-600" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Acesso Negado
        </h1>

        <p className="text-gray-600 mb-8">
          Você não tem permissão para acessar esta página. Entre em contato com o administrador do sistema se acreditar que isso é um erro.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => router.back()}
            className="w-full flex items-center justify-center space-x-2 bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Voltar</span>
          </button>

          <button
            onClick={() => router.push('/')}
            className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Home size={20} />
            <span>Ir para Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
}
