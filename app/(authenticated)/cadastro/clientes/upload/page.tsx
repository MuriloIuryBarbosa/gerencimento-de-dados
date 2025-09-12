"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import CSVUpload from '@/components/CSVUpload';

export default function UploadClientes() {
  const [isImporting, setIsImporting] = useState(false);

  const availableFields = [
    { key: 'nome', label: 'Nome do Cliente', required: true, type: 'string' as const },
    { key: 'razaoSocial', label: 'Razão Social', required: false, type: 'string' as const },
    { key: 'cnpj', label: 'CNPJ', required: false, type: 'string' as const },
    { key: 'endereco', label: 'Endereço', required: false, type: 'string' as const },
    { key: 'telefone', label: 'Telefone', required: false, type: 'string' as const },
    { key: 'email', label: 'Email', required: false, type: 'string' as const },
    { key: 'contato', label: 'Contato Principal', required: false, type: 'string' as const },
    { key: 'ativo', label: 'Ativo', required: false, type: 'boolean' as const }
  ];

  const sampleData = [
    {
      nome: 'Cliente Exemplo Ltda',
      razaoSocial: 'Cliente Exemplo Ltda ME',
      cnpj: '12.345.678/0001-90',
      endereco: 'Rua das Flores, 123 - Centro',
      telefone: '(11) 99999-9999',
      email: 'contato@cliente.com',
      contato: 'João Silva',
      ativo: true
    },
    {
      nome: 'Empresa ABC S.A.',
      razaoSocial: 'Empresa ABC S.A.',
      cnpj: '98.765.432/0001-10',
      endereco: 'Av. Paulista, 456 - Bela Vista',
      telefone: '(11) 88888-8888',
      email: 'compras@empresaabc.com',
      contato: 'Maria Santos',
      ativo: true
    }
  ];

  const handleImport = async (data: any[], mappings: any[]) => {
    setIsImporting(true);

    try {
      const response = await fetch('/api/clientes/bulk-import', {
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
              <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl">
                <ArrowLeft className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Upload de Clientes em Massa</h1>
                <p className="text-gray-600">Importe múltiplos clientes através de arquivo CSV</p>
              </div>
            </div>
            <Link href="/cadastro/clientes">
              <Button variant="outline">
                ← Voltar para Clientes
              </Button>
            </Link>
          </div>
        </div>

        {/* CSV Upload Component */}
        <CSVUpload
          title="Importar Clientes via CSV"
          moduleName="clientes"
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
                <li>• Nome do Cliente</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Campos Opcionais</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Razão Social</li>
                <li>• CNPJ</li>
                <li>• Endereço</li>
                <li>• Telefone</li>
                <li>• Email</li>
                <li>• Contato Principal</li>
                <li>• Status Ativo</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-orange-50 rounded-lg">
            <h4 className="font-medium text-orange-900 mb-2">Dicas Importantes</h4>
            <ul className="text-sm text-orange-800 space-y-1">
              <li>• Use o botão "Baixar Exemplo CSV" para ver o formato correto</li>
              <li>• CNPJ deve estar no formato XX.XXX.XXX/XXXX-XX</li>
              <li>• Para campos booleanos, use: true/false, 1/0, sim/não</li>
              <li>• O sistema irá validar os dados antes da importação</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
