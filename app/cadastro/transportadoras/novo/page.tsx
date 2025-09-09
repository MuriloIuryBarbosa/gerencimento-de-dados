"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Save, ArrowLeft, AlertCircle, CheckCircle, Truck } from 'lucide-react';
import Link from 'next/link';

export default function NovaTransportadora() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nome: "",
    cnpj: "",
    endereco: "",
    telefone: "",
    email: "",
    contato: "",
    prazoEntrega: "",
    valorFrete: "",
    ativo: true
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.nome.trim()) {
      setError('Nome da transportadora é obrigatório');
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
    if (formData.prazoEntrega && parseInt(formData.prazoEntrega) < 0) {
      setError('Prazo de entrega não pode ser negativo');
      return false;
    }
    if (formData.valorFrete && parseFloat(formData.valorFrete) < 0) {
      setError('Valor do frete não pode ser negativo');
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
        prazoEntrega: formData.prazoEntrega ? parseInt(formData.prazoEntrega) : null,
        valorFrete: formData.valorFrete ? parseFloat(formData.valorFrete) : 0
      };

      const response = await fetch('/api/transportadoras', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar transportadora');
      }

      setSuccess('Transportadora criada com sucesso!');

      // Reset form
      setFormData({
        nome: "",
        cnpj: "",
        endereco: "",
        telefone: "",
        email: "",
        contato: "",
        prazoEntrega: "",
        valorFrete: "",
        ativo: true
      });

      // Redirect after success
      setTimeout(() => {
        router.push('/cadastro/transportadoras');
      }, 2000);

    } catch (error) {
      console.error('Erro:', error);
      setError(error instanceof Error ? error.message : 'Erro ao criar transportadora');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/cadastro/transportadoras');
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-lg p-6 text-white mb-6">
        <div className="flex items-center gap-2">
          <Truck className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold">Nova Transportadora</h1>
            <p className="text-orange-100 mt-2">
              Cadastre uma nova transportadora para seu sistema
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Informações da Transportadora</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome e CNPJ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="nome" className="text-sm font-medium text-gray-700">
                  Nome da Transportadora *
                </Label>
                <Input
                  id="nome"
                  type="text"
                  value={formData.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  placeholder="Digite o nome da transportadora"
                  className="h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
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
                  className="h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
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
                  className="h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
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
                  placeholder="transportadora@email.com"
                  className="h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Contato Principal */}
            <div className="space-y-2">
              <Label htmlFor="contato" className="text-sm font-medium text-gray-700">
                Contato Principal
              </Label>
              <Input
                id="contato"
                type="text"
                value={formData.contato}
                onChange={(e) => handleInputChange('contato', e.target.value)}
                placeholder="Nome da pessoa de contato"
                className="h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              />
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
                placeholder="Digite o endereço completo da transportadora"
                className="min-h-24 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                rows={3}
              />
            </div>

            {/* Dados Comerciais */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="prazoEntrega" className="text-sm font-medium text-gray-700">
                  Prazo de Entrega (dias)
                </Label>
                <Input
                  id="prazoEntrega"
                  type="number"
                  value={formData.prazoEntrega}
                  onChange={(e) => handleInputChange('prazoEntrega', e.target.value)}
                  placeholder="30"
                  min="1"
                  className="h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="valorFrete" className="text-sm font-medium text-gray-700">
                  Valor do Frete (R$)
                </Label>
                <Input
                  id="valorFrete"
                  type="number"
                  value={formData.valorFrete}
                  onChange={(e) => handleInputChange('valorFrete', e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="ativo"
                checked={formData.ativo}
                onChange={(e) => handleInputChange('ativo', e.target.checked)}
                className="rounded border-gray-300"
              />
              <Label htmlFor="ativo" className="text-sm font-medium text-gray-700">
                Transportadora ativa
              </Label>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="h-12 px-8 border-gray-300 hover:bg-gray-50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="h-12 px-8 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Transportadora
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
