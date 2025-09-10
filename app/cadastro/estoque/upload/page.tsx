"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import CSVUpload from '@/components/CSVUpload';

export default function UploadEstoque() {
  const [isImporting, setIsImporting] = useState(false);

  const availableFields = [
    { key: 'skuId', label: 'Código SKU', required: true, type: 'string' as const },
    { key: 'depositoId', label: 'ID Depósito', required: false, type: 'number' as const },
    { key: 'quantidadeAtual', label: 'Quantidade Atual', required: true, type: 'number' as const },
    { key: 'quantidadeReservada', label: 'Quantidade Reservada', required: false, type: 'number' as const },
    { key: 'quantidadeDisponivel', label: 'Quantidade Disponível', required: false, type: 'number' as const },
    { key: 'localizacao', label: 'Localização', required: false, type: 'string' as const },
    { key: 'lote', label: 'Lote', required: false, type: 'string' as const },
    { key: 'dataValidade', label: 'Data Validade', required: false, type: 'string' as const },
    { key: 'dataUltimaEntrada', label: 'Data Última Entrada', required: false, type: 'string' as const },
    { key: 'dataUltimaSaida', label: 'Data Última Saída', required: false, type: 'string' as const },
    { key: 'custoMedio', label: 'Custo Médio', required: false, type: 'number' as const },
    { key: 'valorTotalEstoque', label: 'Valor Total Estoque', required: false, type: 'number' as const },
    { key: 'status', label: 'Status', required: false, type: 'string' as const }
  ];

  const sampleData = [
    {
      skuId: 'ABC001',
      depositoId: 1,
      quantidadeAtual: 100,
      quantidadeReservada: 10,
      quantidadeDisponivel: 90,
      localizacao: 'A-01-01',
      lote: 'LOTE2024001',
      dataValidade: '2025-12-31',
      custoMedio: 25.50,
      valorTotalEstoque: 2550.00,
      status: 'Disponível'
    },
    {
      skuId: 'ABC002',
      depositoId: 2,
      quantidadeAtual: 50,
      quantidadeReservada: 5,
      quantidadeDisponivel: 45,
      localizacao: 'B-02-03',
      lote: 'LOTE2024002',
      dataValidade: '2025-06-15',
      custoMedio: 15.75,
      valorTotalEstoque: 787.50,
      status: 'Disponível'
    },
    {
      skuId: 'ABC003',
      depositoId: 1,
      quantidadeAtual: 0,
      quantidadeReservada: 0,
      quantidadeDisponivel: 0,
      localizacao: 'C-03-05',
      lote: 'LOTE2024003',
      dataValidade: '2024-12-01',
      custoMedio: 30.00,
      valorTotalEstoque: 0.00,
      status: 'Esgotado'
    }
  ];

  const handleImport = async (data: any[], mappings: any[]) => {
    setIsImporting(true);

    try {
      const response = await fetch('/api/estoque/bulk-import', {
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
                <h1 className="text-3xl font-bold text-gray-900">Upload de Estoque em Massa</h1>
                <p className="text-gray-600">Importe múltiplos registros de estoque através de arquivo CSV</p>
              </div>
            </div>
            <Link href="/cadastro/estoque">
              <Button variant="outline">
                ← Voltar para Estoque
              </Button>
            </Link>
          </div>
        </div>

        {/* CSV Upload Component */}
        <CSVUpload
          title="Importar Estoque via CSV"
          moduleName="estoque"
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
                <li>• Código SKU</li>
                <li>• Quantidade Atual</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Campos Opcionais</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• ID do Depósito</li>
                <li>• Quantidades reservada/disponível</li>
                <li>• Localização e Lote</li>
                <li>• Datas (validade, entrada, saída)</li>
                <li>• Valores (custo médio, total)</li>
                <li>• Status do estoque</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Dicas Importantes</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Use o botão "Baixar Exemplo CSV" para ver o formato correto</li>
              <li>• Certifique-se de que os códigos SKU existem no sistema</li>
              <li>• Valores numéricos devem usar ponto (.) como separador decimal</li>
              <li>• Datas devem estar no formato YYYY-MM-DD</li>
              <li>• Status pode ser: Disponível, Reservado, Esgotado, etc.</li>
              <li>• O sistema irá validar os dados antes da importação</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
