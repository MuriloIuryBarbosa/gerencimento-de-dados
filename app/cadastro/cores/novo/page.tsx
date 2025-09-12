"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette, Save, X, ArrowLeft } from 'lucide-react';

export default function NovaCor() {
  const [formData, setFormData] = useState({
    nome: "",
    legado: ""
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/cores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          ativo: true
        }),
      });

      if (response.ok) {
        alert('Cor criada com sucesso!');
        setFormData({
          nome: "",
          legado: ""
        });
      } else {
        throw new Error('Erro ao criar cor');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao criar cor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl">
                <ArrowLeft className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Nova Cor</h1>
                <p className="text-gray-600">Cadastrar uma nova cor no sistema</p>
              </div>
            </div>
            <Link href="/cadastro/cores">
              <Button variant="outline">
                ← Voltar para Cores
              </Button>
            </Link>
          </div>
        </div>

        {/* Form */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Dados da Cor
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nome da Cor */}
              <div className="space-y-2">
                <Label htmlFor="nome" className="text-sm font-medium text-gray-700">
                  Nome da Cor *
                </Label>
                <Input
                  id="nome"
                  type="text"
                  value={formData.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  placeholder="Ex: Azul Marinho, Vermelho Cereja, Branco Puro"
                  className="h-12 border-gray-300 focus:border-green-500 focus:ring-green-500"
                  required
                />
                <p className="text-sm text-gray-500">
                  Digite o nome completo e descritivo da cor
                </p>
              </div>

              {/* Código Legado */}
              <div className="space-y-2">
                <Label htmlFor="legado" className="text-sm font-medium text-gray-700">
                  Código Legado
                </Label>
                <Input
                  id="legado"
                  type="text"
                  value={formData.legado}
                  onChange={(e) => handleInputChange('legado', e.target.value)}
                  placeholder="Ex: 38-AZUL, 15-VERMELHO, BRANCO-001"
                  className="h-12 border-gray-300 focus:border-green-500 focus:ring-green-500"
                />
                <p className="text-sm text-gray-500">
                  Código de referência do sistema legado (opcional)
                </p>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-4 pt-6 border-t">
                <Link href="/cadastro/cores">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 px-8 border-gray-300 hover:bg-gray-50"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                </Link>
                <Button
                  type="submit"
                  className="h-12 px-8 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                  disabled={loading}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Salvando...' : 'Salvar Cor'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Dicas para Cadastro</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Nome da Cor</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Use nomes descritivos e completos</li>
                  <li>• Inclua variações quando necessário</li>
                  <li>• Mantenha consistência na nomenclatura</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Código Legado</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Referência ao sistema anterior</li>
                  <li>• Ajuda na migração de dados</li>
                  <li>• Facilita rastreabilidade histórica</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
