"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import CSVUpload from '@/components/CSVUpload';

export default function UploadUneg() {
  const [isImporting, setIsImporting] = useState(false);

  const availableFields = [
    { key: 'codigo', label: 'Código', required: true, type: 'string' as const },
    { key: 'nome', label: 'Nome', required: true, type: 'string' as const },
    { key: 'descricao', label: 'Descrição', required: false, type: 'string' as const },
    { key: 'ativo', label: 'Ativo', required: false, type: 'boolean' as const }
  ];

  const sampleData = [
    {
      codigo: 'MICRO',
      nome: 'Microfibra',
      descricao: 'Unidade de negócio especializada em tecidos de microfibra',
      ativo: true
    },
    {
      codigo: 'ALGODAO',
      nome: 'Algodão',
      descricao: 'Unidade de negócio especializada em tecidos de algodão',
      ativo: true
    },
    {
      codigo: 'POLIESTER',
      nome: 'Poliéster',
      descricao: 'Unidade de negócio especializada em tecidos sintéticos',
      ativo: true
    },
    {
      codigo: 'MISTURA',
      nome: 'Mistura',
      descricao: 'Unidade de negócio especializada em misturas de fibras',
      ativo: true
    }
  ];

  const handleImport = async (data: any[], mappings: any[]) => {
    setIsImporting(true);

    try {
      const response = await fetch('/api/unegs/bulk-import', {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <ArrowLeft className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Upload de UNEGs em Massa</h1>
                <p className="text-gray-600">Importe múltiplas unidades de negócio através de arquivo CSV</p>
              </div>
            </div>
            <Link href="/cadastro/unegs">
              <Button variant="outline">
                ← Voltar para UNEGs
              </Button>
            </Link>
          </div>
        </div>

        {/* CSV Upload Component */}
        <CSVUpload
          title="Importar UNEGs via CSV"
          moduleName="unegs"
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
                <li>• Código (único)</li>
                <li>• Nome da UNEG</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Campos Opcionais</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Descrição</li>
                <li>• Status Ativo</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Dicas Importantes</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Use o botão "Baixar Exemplo CSV" para ver o formato correto</li>
              <li>• Certifique-se de que os códigos são únicos</li>
              <li>• Para campos booleanos, use: true/false, 1/0, sim/não</li>
              <li>• O sistema irá validar os dados antes da importação</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
