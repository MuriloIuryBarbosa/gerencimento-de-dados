"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import CSVUpload from '@/components/CSVUpload';

export default function UploadDepositos() {
  const [isImporting, setIsImporting] = useState(false);

  const availableFields = [
    { key: 'codigo', label: 'Código', required: true, type: 'string' as const },
    { key: 'nome', label: 'Nome', required: true, type: 'string' as const },
    { key: 'endereco', label: 'Endereço', required: false, type: 'string' as const },
    { key: 'cidade', label: 'Cidade', required: false, type: 'string' as const },
    { key: 'estado', label: 'Estado', required: false, type: 'string' as const },
    { key: 'cep', label: 'CEP', required: false, type: 'string' as const },
    { key: 'telefone', label: 'Telefone', required: false, type: 'string' as const },
    { key: 'responsavel', label: 'Responsável', required: false, type: 'string' as const },
    { key: 'capacidade', label: 'Capacidade (m³)', required: false, type: 'number' as const },
    { key: 'tipo', label: 'Tipo', required: false, type: 'string' as const },
    { key: 'ativo', label: 'Ativo', required: false, type: 'boolean' as const }
  ];

  const sampleData = [
    {
      codigo: 'DEP001',
      nome: 'Depósito Central São Paulo',
      endereco: 'Rua das Indústrias, 123',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01234-567',
      telefone: '(11) 3456-7890',
      responsavel: 'João Silva',
      capacidade: 5000,
      tipo: 'Centro de Distribuição',
      ativo: true
    },
    {
      codigo: 'DEP002',
      nome: 'Armazém Rio de Janeiro',
      endereco: 'Av. Brasil, 456',
      cidade: 'Rio de Janeiro',
      estado: 'RJ',
      cep: '20000-000',
      telefone: '(21) 2345-6789',
      responsavel: 'Maria Santos',
      capacidade: 3000,
      tipo: 'Armazém',
      ativo: true
    },
    {
      codigo: 'DEP003',
      nome: 'Depósito Belo Horizonte',
      endereco: 'Rua dos Tecidos, 789',
      cidade: 'Belo Horizonte',
      estado: 'MG',
      cep: '30123-456',
      telefone: '(31) 3456-7890',
      responsavel: 'Pedro Oliveira',
      capacidade: 2500,
      tipo: 'Armazém',
      ativo: true
    }
  ];

  const handleImport = async (data: any[], mappings: any[]) => {
    setIsImporting(true);

    try {
      const response = await fetch('/api/depositos/bulk-import', {
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
                <h1 className="text-3xl font-bold text-gray-900">Upload de Depósitos em Massa</h1>
                <p className="text-gray-600">Importe múltiplos depósitos através de arquivo CSV</p>
              </div>
            </div>
            <Link href="/cadastro/depositos">
              <Button variant="outline">
                ← Voltar para Depósitos
              </Button>
            </Link>
          </div>
        </div>

        {/* CSV Upload Component */}
        <CSVUpload
          title="Importar Depósitos via CSV"
          moduleName="depositos"
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
                <li>• Nome do Depósito</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Campos Opcionais</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Endereço completo</li>
                <li>• Cidade, Estado, CEP</li>
                <li>• Telefone e Responsável</li>
                <li>• Capacidade e Tipo</li>
                <li>• Status Ativo</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Dicas Importantes</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Use o botão "Baixar Exemplo CSV" para ver o formato correto</li>
              <li>• Certifique-se de que os códigos são únicos</li>
              <li>• Capacidade deve ser um número (metros cúbicos)</li>
              <li>• Para campos booleanos, use: true/false, 1/0, sim/não</li>
              <li>• O sistema irá validar os dados antes da importação</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
