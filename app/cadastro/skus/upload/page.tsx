"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import CSVUpload from '@/components/CSVUpload';

export default function UploadSKUs() {
  const [isImporting, setIsImporting] = useState(false);

  const availableFields = [
    { key: 'id', label: 'CHAVE SKU', required: true, type: 'string' as const },
    { key: 'nome', label: 'Nome do Produto', required: false, type: 'string' as const },
    { key: 'unegNome', label: 'Uneg', required: false, type: 'string' as const },
    { key: 'unegCodigo', label: 'Codigo Uneg', required: false, type: 'string' as const },
    { key: 'familiaCodigo', label: 'Codigo Familia', required: false, type: 'string' as const },
    { key: 'familiaNome', label: 'Familia', required: false, type: 'string' as const },
    { key: 'corCodigo', label: 'Codigo Cor', required: false, type: 'string' as const },
    { key: 'corNome', label: 'Cor', required: false, type: 'string' as const },
    { key: 'tamanhoCodigo', label: 'Codigo Tam', required: false, type: 'string' as const },
    { key: 'tamanhoNome', label: 'Tamanho', required: false, type: 'string' as const },
    { key: 'estoqueMinimo', label: 'PE', required: false, type: 'number' as const },
    { key: 'ativo', label: 'Ativo', required: false, type: 'boolean' as const },
    { key: 'curvaOrdem', label: 'CURVA ORDEM', required: false, type: 'string' as const },
    { key: 'curvaOrdemCurta', label: 'CURVA ORDEM CURTA', required: false, type: 'string' as const },
    { key: 'subgrupo', label: 'Subgrupo', required: false, type: 'string' as const },
    { key: 'item', label: 'ITEM', required: false, type: 'string' as const },
    { key: 'destino', label: 'Destino', required: false, type: 'string' as const },
    { key: 'leadTimeReposicao', label: 'Lead_time_reposicao', required: false, type: 'number' as const },
    { key: 'unidade', label: 'Unidade', required: true, type: 'string' as const },
    { key: 'exclusivo', label: 'Exclusivo', required: false, type: 'string' as const },
    { key: 'precoVenda', label: 'Preço de Venda', required: false, type: 'number' as const },
    { key: 'custoMedio', label: 'Custo Médio', required: false, type: 'number' as const },
    { key: 'estoqueMaximo', label: 'Estoque Máximo', required: false, type: 'number' as const }
  ];

  const sampleData = [
    {
      id: '4565380',
      nome: 'MICROFIBRA 65G/M2 2.40M ESTAMPADA',
      unegNome: 'MICROFIBRA',
      unegCodigo: '55',
      familiaCodigo: '4565',
      familiaNome: 'MICROFIBRA 65G/M2 2.40M ESTAMPADA',
      corCodigo: '38',
      corNome: 'ESTAMPADA',
      tamanhoCodigo: '0',
      tamanhoNome: '0',
      estoqueMinimo: 0,
      ativo: true,
      subgrupo: 'MICROFIBRA ESTAMPADA',
      item: 'ARTIGO DE PRODUÇÃO',
      destino: 'PRODUÇÃO',
      leadTimeReposicao: 209,
      unidade: 'MT',
      exclusivo: 'NAO',
      precoVenda: 29.90,
      custoMedio: 15.50,
      estoqueMaximo: 100
    },
    {
      id: '109810',
      nome: 'VOIL 3.00M',
      unegNome: 'DECORACAO',
      unegCodigo: '25',
      familiaCodigo: '1098',
      familiaNome: 'VOIL 3.00M',
      corCodigo: '1',
      corNome: 'BRANCO',
      tamanhoCodigo: '0',
      tamanhoNome: '0',
      estoqueMinimo: 0,
      ativo: true,
      subgrupo: 'VOIL LISO IMPORTADO',
      item: 'VENDA',
      destino: 'VENDA',
      leadTimeReposicao: 164,
      unidade: 'MT',
      exclusivo: 'NAO',
      precoVenda: 45.00,
      custoMedio: 22.00,
      estoqueMaximo: 50
    }
  ];

  const handleImport = async (data: any[], mappings: any[]) => {
    setIsImporting(true);

    try {
      const response = await fetch('/api/skus/bulk-import', {
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
                <h1 className="text-3xl font-bold text-gray-900">Upload de SKUs em Massa</h1>
                <p className="text-gray-600">Importe múltiplos SKUs através de arquivo CSV</p>
              </div>
            </div>
            <Link href="/cadastro/skus">
              <Button variant="outline">
                ← Voltar para SKUs
              </Button>
            </Link>
          </div>
        </div>

        {/* CSV Upload Component */}
        <CSVUpload
          title="Importar SKUs via CSV"
          moduleName="skus"
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
                <li>• Código SKU (único)</li>
                <li>• Unidade de Medida</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Campos Opcionais</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Nome do Produto</li>
                <li>• Preço de Venda</li>
                <li>• Custo Médio</li>
                <li>• Estoque Mínimo</li>
                <li>• Estoque Máximo</li>
                <li>• Status Ativo</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Dicas Importantes</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Use o botão "Baixar Exemplo CSV" para ver o formato correto</li>
              <li>• Certifique-se de que os códigos SKU são únicos</li>
              <li>• Valores numéricos devem usar ponto (.) como separador decimal</li>
              <li>• Para campos booleanos, use: true/false, 1/0, sim/não</li>
              <li>• O sistema irá validar os dados antes da importação</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
