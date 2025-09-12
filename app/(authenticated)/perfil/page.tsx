"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Mail, Briefcase, Shield, Save, Edit } from 'lucide-react';
import { useLanguage } from '../../components/LanguageContext';
import { useUsuarioAtual } from '../../components/useUsuarioAtual';

interface UsuarioPerfil {
  id: number;
  nome: string;
  email: string;
  cargo?: string;
  telefone?: string;
  departamento?: string;
  dataCriacao: string;
  ultimoAcesso: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  permissoes: string[];
}

export default function PerfilPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { usuario: usuarioAtual, loading: userLoading } = useUsuarioAtual();
  const [usuario, setUsuario] = useState<UsuarioPerfil | null>(null);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cargo: '',
    telefone: '',
    departamento: ''
  });

  useEffect(() => {
    const carregarPerfil = async () => {
      try {
        // Simulação de dados do perfil
        const mockPerfil: UsuarioPerfil = {
          id: 1,
          nome: "João Silva",
          email: "joao.silva@empresa.com",
          cargo: "Gerente de TI",
          telefone: "(11) 99999-9999",
          departamento: "Tecnologia da Informação",
          dataCriacao: "2024-01-15",
          ultimoAcesso: "2024-12-19 14:30:00",
          isAdmin: true,
          isSuperAdmin: false,
          permissoes: [
            "admin.usuarios.visualizar",
            "admin.permissoes.gerenciar",
            "sistema.logs.visualizar",
            "ordem-compra.criar",
            "proforma.visualizar"
          ]
        };

        setUsuario(mockPerfil);
        setFormData({
          nome: mockPerfil.nome,
          email: mockPerfil.email,
          cargo: mockPerfil.cargo || '',
          telefone: mockPerfil.telefone || '',
          departamento: mockPerfil.departamento || ''
        });

        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!userLoading) {
      carregarPerfil();
    }
  }, [userLoading]);

  const handleSalvar = async () => {
    try {
      // Simulação de atualização
      await new Promise(resolve => setTimeout(resolve, 1000));

      setUsuario(prev => prev ? {
        ...prev,
        nome: formData.nome,
        email: formData.email,
        cargo: formData.cargo,
        telefone: formData.telefone,
        departamento: formData.departamento
      } : null);

      setEditando(false);
      alert('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      alert('Erro ao salvar perfil. Tente novamente.');
    }
  };

  const handleCancelar = () => {
    if (usuario) {
      setFormData({
        nome: usuario.nome,
        email: usuario.email,
        cargo: usuario.cargo || '',
        telefone: usuario.telefone || '',
        departamento: usuario.departamento || ''
      });
    }
    setEditando(false);
  };

  if (loading || userLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Perfil não encontrado</h2>
          <button
            onClick={() => router.back()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Meu Perfil</h1>
            </div>
            <div className="flex items-center space-x-3">
              {!editando ? (
                <button
                  onClick={() => setEditando(true)}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit size={16} />
                  <span>Editar</span>
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSalvar}
                    className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Save size={16} />
                    <span>Salvar</span>
                  </button>
                  <button
                    onClick={handleCancelar}
                    className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <span>Cancelar</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informações Principais */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Informações Pessoais</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo
                  </label>
                  {editando ? (
                    <input
                      type="text"
                      value={formData.nome}
                      onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <User size={20} className="text-gray-400" />
                      <span className="text-gray-900">{usuario.nome}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-mail
                  </label>
                  {editando ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Mail size={20} className="text-gray-400" />
                      <span className="text-gray-900">{usuario.email}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cargo
                  </label>
                  {editando ? (
                    <input
                      type="text"
                      value={formData.cargo}
                      onChange={(e) => setFormData(prev => ({ ...prev, cargo: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Briefcase size={20} className="text-gray-400" />
                      <span className="text-gray-900">{usuario.cargo || 'Não informado'}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone
                  </label>
                  {editando ? (
                    <input
                      type="tel"
                      value={formData.telefone}
                      onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <User size={20} className="text-gray-400" />
                      <span className="text-gray-900">{usuario.telefone || 'Não informado'}</span>
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Departamento
                  </label>
                  {editando ? (
                    <input
                      type="text"
                      value={formData.departamento}
                      onChange={(e) => setFormData(prev => ({ ...prev, departamento: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Briefcase size={20} className="text-gray-400" />
                      <span className="text-gray-900">{usuario.departamento || 'Não informado'}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Informações do Sistema */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Informações do Sistema</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data de Criação
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg text-gray-900">
                    {new Date(usuario.dataCriacao).toLocaleDateString('pt-BR')}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Último Acesso
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg text-gray-900">
                    {new Date(usuario.ultimoAcesso).toLocaleString('pt-BR')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar com permissões e status */}
          <div className="space-y-6">
            {/* Status do Usuário */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Status</h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tipo de Usuário:</span>
                  <div className="flex items-center space-x-2">
                    <Shield size={16} className={usuario.isSuperAdmin ? 'text-yellow-500' : usuario.isAdmin ? 'text-green-500' : 'text-gray-400'} />
                    <span className="text-sm font-medium">
                      {usuario.isSuperAdmin ? 'Super Admin' : usuario.isAdmin ? 'Administrador' : 'Usuário'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status da Conta:</span>
                  <span className="text-sm font-medium text-green-600">Ativa</span>
                </div>
              </div>
            </div>

            {/* Permissões */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Permissões Ativas</h3>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {usuario.permissoes.map((permissao, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">{permissao}</span>
                  </div>
                ))}
              </div>

              {usuario.permissoes.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  Nenhuma permissão ativa
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
