"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, Save, X, AlertCircle, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NovoFornecedor() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nome: "",
    cnpj: "",
    endereco: "",
    telefone: "",
    email: "",
    contatoPrincipal: "",
    condicoesPagamento: "",
    prazoEntregaPadrao: ""
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.nome.trim()) {
      setError('Nome do fornecedor é obrigatório');
      return false;
    }
    if (formData.cnpj && !/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(formData.cnpj)) {
      setError('CNPJ deve estar no formato 00.000.000/0000-00');
      return false;
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('E-mail deve ter um formato válido');
      return false;
    }
    if (formData.prazoEntregaPadrao && parseInt(formData.prazoEntregaPadrao) < 0) {
      setError('Prazo de entrega não pode ser negativo');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      const dataToSend = {
        ...formData,
        prazoEntregaPadrao: formData.prazoEntregaPadrao ? parseInt(formData.prazoEntregaPadrao) : null
      };

      const response = await fetch('/api/fornecedores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar fornecedor');
      }

      setSuccess('Fornecedor criado com sucesso!');

      // Reset form
      setFormData({
        nome: "",
        cnpj: "",
        endereco: "",
        telefone: "",
        email: "",
        contatoPrincipal: "",
        condicoesPagamento: "",
        prazoEntregaPadrao: ""
      });

      // Redirect after success
      setTimeout(() => {
        router.push('/cadastro/fornecedores');
      }, 2000);

    } catch (error) {
      console.error('Erro:', error);
      setError(error instanceof Error ? error.message : 'Erro ao criar fornecedor');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/cadastro/fornecedores');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
              <Truck className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Cadastrar Novo Fornecedor</h1>
              <p className="text-gray-600">Preencha os dados do novo fornecedor</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Dados do Fornecedor
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <p className="text-green-600 text-sm">{success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nome e CNPJ */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nome" className="text-sm font-medium text-gray-700">
                    Nome do Fornecedor *
                  </Label>
                  <Input
                    id="nome"
                    type="text"
                    value={formData.nome}
                    onChange={(e) => handleInputChange('nome', e.target.value)}
                    placeholder="Digite o nome do fornecedor"
                    className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cnpj" className="text-sm font-medium text-gray-700">
                    CNPJ
                  </Label>
                  <Input
                    id="cnpj"
                    type="text"
                    value={formData.cnpj}
                    onChange={(e) => handleInputChange('cnpj', e.target.value)}
                    placeholder="00.000.000/0000-00"
                    className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Endereço */}
              <div className="space-y-2">
                <Label htmlFor="endereco" className="text-sm font-medium text-gray-700">
                  Endereço
                </Label>
                <Textarea
                  id="endereco"
                  value={formData.endereco}
                  onChange={(e) => handleInputChange('endereco', e.target.value)}
                  placeholder="Digite o endereço completo do fornecedor"
                  className="min-h-24 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              {/* Contato */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="telefone" className="text-sm font-medium text-gray-700">
                    Telefone
                  </Label>
                  <Input
                    id="telefone"
                    type="tel"
                    value={formData.telefone}
                    onChange={(e) => handleInputChange('telefone', e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    E-mail
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="fornecedor@email.com"
                    className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Contato Principal */}
              <div className="space-y-2">
                <Label htmlFor="contatoPrincipal" className="text-sm font-medium text-gray-700">
                  Contato Principal
                </Label>
                <Input
                  id="contatoPrincipal"
                  type="text"
                  value={formData.contatoPrincipal}
                  onChange={(e) => handleInputChange('contatoPrincipal', e.target.value)}
                  placeholder="Nome da pessoa de contato"
                  className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              {/* Condições Comerciais */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="condicoesPagamento" className="text-sm font-medium text-gray-700">
                    Condições de Pagamento
                  </Label>
                  <select
                    id="condicoesPagamento"
                    value={formData.condicoesPagamento}
                    onChange={(e) => handleInputChange('condicoesPagamento', e.target.value)}
                    className="h-12 w-full px-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 bg-white"
                  >
                    <option value="">Selecione as condições</option>
                    <option value="avista">À Vista</option>
                    <option value="30dias">30 Dias</option>
                    <option value="60dias">60 Dias</option>
                    <option value="90dias">90 Dias</option>
                    <option value="120dias">120 Dias</option>
                    <option value="personalizado">Personalizado</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prazoEntregaPadrao" className="text-sm font-medium text-gray-700">
                    Prazo de Entrega Padrão (dias)
                  </Label>
                  <Input
                    id="prazoEntregaPadrao"
                    type="number"
                    value={formData.prazoEntregaPadrao}
                    onChange={(e) => handleInputChange('prazoEntregaPadrao', e.target.value)}
                    placeholder="30"
                    min="1"
                    className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-4 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="h-12 px-8 border-gray-300 hover:bg-gray-50"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-12 px-8 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Salvar Fornecedor
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
