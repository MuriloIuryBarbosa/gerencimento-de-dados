import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Building2, Save, X, Search } from 'lucide-react';

interface EmpresaModalProps {
  isOpen: boolean;
  onSave: (empresa: any) => void;
  onCancel: () => void;
}

export default function EmpresaModal({ isOpen, onSave, onCancel }: EmpresaModalProps) {
  const [formData, setFormData] = useState({
    nome: '',
    cnpj: '',
    endereco: '',
    cidade: '',
    estado: '',
    cep: '',
    telefone: '',
    email: '',
    contato: '',
    observacoes: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCNPJSearch = async () => {
    if (!formData.cnpj) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/cnpj/${formData.cnpj}`);
      const result = await response.json();

      if (result.success) {
        const data = result.data;
        setFormData(prev => ({
          ...prev,
          nome: data.nome || prev.nome,
          endereco: data.endereco ? `${data.endereco}, ${data.numero}${data.complemento ? ', ' + data.complemento : ''}` : prev.endereco,
          cidade: data.cidade || prev.cidade,
          estado: data.estado || prev.estado,
          cep: data.cep || prev.cep,
          telefone: data.telefone || prev.telefone,
          email: data.email || prev.email
        }));
      } else {
        alert(result.error || 'Erro ao buscar CNPJ');
      }
    } catch (error) {
      console.error('Erro ao buscar CNPJ:', error);
      alert('Erro ao conectar com o serviço de CNPJ');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validação básica
    if (!formData.nome || !formData.cnpj) {
      alert('Nome e CNPJ são obrigatórios!');
      return;
    }

    // TODO: Implementar lógica de salvamento
    console.log('Salvando empresa:', formData);

    onSave(formData);

    // Reset form
    setFormData({
      nome: '',
      cnpj: '',
      endereco: '',
      cidade: '',
      estado: '',
      cep: '',
      telefone: '',
      email: '',
      contato: '',
      observacoes: ''
    });
  };

  const handleCancel = () => {
    setFormData({
      nome: '',
      cnpj: '',
      endereco: '',
      cidade: '',
      estado: '',
      cep: '',
      telefone: '',
      email: '',
      contato: '',
      observacoes: ''
    });
    onCancel();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Cadastrar Nova Empresa</h2>
              <p className="text-gray-600">Preencha os dados da empresa fornecedora</p>
            </div>
          </div>
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Nome da Empresa */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="nome" className="text-sm font-medium text-gray-700">
                Nome da Empresa *
              </Label>
              <Input
                id="nome"
                type="text"
                value={formData.nome}
                onChange={(e) => handleInputChange('nome', e.target.value)}
                placeholder="Digite o nome da empresa"
                className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cnpj" className="text-sm font-medium text-gray-700">
                CNPJ *
              </Label>
              <div className="flex gap-2">
                <Input
                  id="cnpj"
                  type="text"
                  value={formData.cnpj}
                  onChange={(e) => handleInputChange('cnpj', e.target.value)}
                  placeholder="00.000.000/0000-00"
                  className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
                <Button
                  type="button"
                  onClick={handleCNPJSearch}
                  disabled={isLoading || !formData.cnpj}
                  className="h-12 px-4 border-gray-300 hover:bg-gray-50"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div className="space-y-2">
            <Label htmlFor="endereco" className="text-sm font-medium text-gray-700">
              Endereço *
            </Label>
            <Input
              id="endereco"
              type="text"
              value={formData.endereco}
              onChange={(e) => handleInputChange('endereco', e.target.value)}
              placeholder="Digite o endereço completo"
              className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          {/* Cidade, Estado, CEP */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="cidade" className="text-sm font-medium text-gray-700">
                Cidade *
              </Label>
              <Input
                id="cidade"
                type="text"
                value={formData.cidade}
                onChange={(e) => handleInputChange('cidade', e.target.value)}
                placeholder="Digite a cidade"
                className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estado" className="text-sm font-medium text-gray-700">
                Estado *
              </Label>
              <Input
                id="estado"
                type="text"
                value={formData.estado}
                onChange={(e) => handleInputChange('estado', e.target.value)}
                placeholder="UF"
                className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cep" className="text-sm font-medium text-gray-700">
                CEP
              </Label>
              <Input
                id="cep"
                type="text"
                value={formData.cep}
                onChange={(e) => handleInputChange('cep', e.target.value)}
                placeholder="00000-000"
                className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
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
                placeholder="(00) 00000-0000"
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
                placeholder="empresa@email.com"
                className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
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
              placeholder="Nome do contato principal"
              className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="observacoes" className="text-sm font-medium text-gray-700">
              Observações
            </Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => handleInputChange('observacoes', e.target.value)}
              placeholder="Observações adicionais sobre a empresa"
              className="min-h-24 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              rows={4}
            />
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
              className="h-12 px-8 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              Salvar Empresa
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
