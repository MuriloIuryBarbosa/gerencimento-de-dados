"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useLanguage } from "../../../components/LanguageContext";

interface Permissao {
  id: number;
  nome: string;
  descricao: string | null;
  categoria: string;
  ativo: boolean;
}

interface UsuarioPermissao {
  id: number;
  usuario: {
    id: number;
    nome: string;
    email: string;
  };
  permissao: {
    nome: string;
    categoria: string;
  };
  dataConcessao: string;
  dataExpiracao: string | null;
  ativo: boolean;
}

export default function GerenciarPermissoes() {
  const { t } = useLanguage();
  const [permissoes, setPermissoes] = useState<Permissao[]>([]);
  const [usuariosPermissoes, setUsuariosPermissoes] = useState<UsuarioPermissao[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGrantForm, setShowGrantForm] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [formData, setFormData] = useState({
    usuarioId: "",
    permissaoId: "",
    dataExpiracao: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [permissoesRes, usuariosPermissoesRes, usuariosRes] = await Promise.all([
        fetch('/api/admin/permissoes'),
        fetch('/api/admin/usuarios-permissoes'),
        fetch('/api/admin/usuarios')
      ]);

      if (permissoesRes.ok) {
        const permissoesData = await permissoesRes.json();
        setPermissoes(permissoesData);
      }

      if (usuariosPermissoesRes.ok) {
        const usuariosPermissoesData = await usuariosPermissoesRes.json();
        setUsuariosPermissoes(usuariosPermissoesData);
      }

      if (usuariosRes.ok) {
        const usuariosData = await usuariosRes.json();
        setUsuarios(usuariosData);
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/usuarios-permissoes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Permissão concedida com sucesso!');
        setFormData({
          usuarioId: "",
          permissaoId: "",
          dataExpiracao: ""
        });
        setShowGrantForm(false);
        fetchData();
      } else {
        throw new Error('Erro ao conceder permissão');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao conceder permissão');
    } finally {
      setLoading(false);
    }
  };

  const revokePermissao = async (id: number) => {
    if (!confirm('Tem certeza que deseja revogar esta permissão?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/usuarios-permissoes/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Permissão revogada com sucesso!');
        fetchData();
      } else {
        throw new Error('Erro ao revogar permissão');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao revogar permissão');
    }
  };

  const permissoesPorCategoria = permissoes.reduce((acc, permissao) => {
    if (!acc[permissao.categoria]) {
      acc[permissao.categoria] = [];
    }
    acc[permissao.categoria].push(permissao);
    return acc;
  }, {} as Record<string, Permissao[]>);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando permissões...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gerenciar Permissões</h1>
              <p className="mt-1 text-sm text-gray-500">
                Controle de acesso e permissões do sistema
              </p>
            </div>
            <div className="flex space-x-4">
              <Link
                href="/admin"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                ← Voltar ao Admin
              </Link>
              <button
                onClick={() => setShowGrantForm(!showGrantForm)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                + Conceder Permissão
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Formulário de Concessão */}
        {showGrantForm && (
          <div className="bg-white shadow rounded-lg mb-8">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Conceder Permissão
              </h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Usuário *
                    </label>
                    <select
                      name="usuarioId"
                      value={formData.usuarioId}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Selecione um usuário</option>
                      {usuarios.map((usuario: any) => (
                        <option key={usuario.id} value={usuario.id}>
                          {usuario.nome} ({usuario.email})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Permissão *
                    </label>
                    <select
                      name="permissaoId"
                      value={formData.permissaoId}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Selecione uma permissão</option>
                      {permissoes.map((permissao) => (
                        <option key={permissao.id} value={permissao.id}>
                          {permissao.nome} - {permissao.categoria}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Data de Expiração
                    </label>
                    <input
                      type="datetime-local"
                      name="dataExpiracao"
                      value={formData.dataExpiracao}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowGrantForm(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Concedendo...' : 'Conceder Permissão'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Lista de Permissões por Categoria */}
        <div className="space-y-8">
          {Object.entries(permissoesPorCategoria).map(([categoria, perms]) => (
            <div key={categoria} className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  {categoria}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {perms.map((permissao) => (
                    <div key={permissao.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">
                            {permissao.nome}
                          </h4>
                          <p className="text-sm text-gray-500 mt-1">
                            {permissao.descricao}
                          </p>
                        </div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          permissao.ativo
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {permissao.ativo ? 'Ativa' : 'Inativa'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Permissões Concedidas */}
        <div className="bg-white shadow rounded-lg mt-8">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Permissões Concedidas
            </h3>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usuário
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Permissão
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoria
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Concedida em
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expira em
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {usuariosPermissoes.map((up) => (
                    <tr key={up.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {up.usuario.nome}
                        <br />
                        <span className="text-gray-500">{up.usuario.email}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {up.permissao.nome}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {up.permissao.categoria}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(up.dataConcessao).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {up.dataExpiracao ? new Date(up.dataExpiracao).toLocaleDateString('pt-BR') : 'Nunca'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          up.ativo
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {up.ativo ? 'Ativa' : 'Inativa'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => revokePermissao(up.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Revogar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {usuariosPermissoes.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhuma permissão concedida ainda.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
