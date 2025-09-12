"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import CSVUpload from '@/components/CSVUpload';

export default function UploadCores() {
  const [isImporting, setIsImporting] = useState(false);

  const availableFields = [
    { key: 'nome', label: 'Nome da Cor', required: true, type: 'string' as const },
    { key: 'legado', label: 'Código Legado', required: false, type: 'string' as const }
  ];

  const sampleData = [
    {
      nome: 'Azul Marinho',
      legado: '38-AZUL'
    },
    {
      nome: 'Vermelho Cereja',
      legado: '15-VERMELHO'
    },
    {
      nome: 'Branco Puro',
      legado: '01-BRANCO'
    },
    {
      nome: 'Preto Fosco',
      legado: '99-PRET'
    },
    {
      nome: 'Verde Esmeralda',
      legado: '22-VERDE'
    }
  ];

  const handleImport = async (data: any[], mappings: any[]) => {
    setIsImporting(true);

    try {
      const response = await fetch('/api/cores/bulk-import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data,
          mappings
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erro na importação');
      }

      return result;
    } catch (error) {
      console.error('Erro na importação:', error);
      throw error;
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl">
                <ArrowLeft className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Upload de Cores em Massa</h1>
                <p className="text-gray-600">Importe múltiplas cores através de arquivo CSV</p>
              </div>
            </div>
            <Link href="/cadastro/cores">
              <Button variant="outline">
                ← Voltar para Cores
              </Button>
            </Link>
          </div>
        </div>

        {/* CSV Upload Component */}
        <CSVUpload
          title="Importar Cores via CSV"
          moduleName="cores"
          availableFields={availableFields}
          onImport={handleImport}
          sampleData={sampleData}
        />

        {/* Instructions */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Instruções para Importação</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Campos Obrigatórios</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Nome da Cor (único e descritivo)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Campos Opcionais</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Código Legado (referência histórica)</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">Dicas Importantes</h4>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Use o botão "Baixar Exemplo CSV" para ver o formato correto</li>
              <li>• Certifique-se de que os nomes das cores são únicos</li>
              <li>• O código legado ajuda na rastreabilidade histórica</li>
              <li>• Todas as cores serão marcadas como ativas por padrão</li>
              <li>• O sistema irá validar os dados antes da importação</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
