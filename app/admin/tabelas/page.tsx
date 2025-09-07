"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useLanguage } from "../../../components/LanguageContext";

interface TabelaDinamica {
  id: number;
  nome: string;
  descricao: string | null;
  empresa: {
    nome: string;
  };
  campos: CampoDinamico[];
  _count: {
    registros: number;
  };
}

interface CampoDinamico {
  id: number;
  nome: string;
  tipo: string;
  obrigatorio: boolean;
  unico: boolean;
}

export default function GerenciarTabelas() {
  const { t } = useLanguage();
  const [tabelas, setTabelas] = useState<TabelaDinamica[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    campos: [{ nome: "", tipo: "TEXT", obrigatorio: false, unico: false }]
  });

  useEffect(() => {
    fetchTabelas();
  }, []);

  const fetchTabelas = async () => {
    try {
      const response = await fetch('/api/admin/tabelas');
      if (response.ok) {
        const data = await response.json();
        setTabelas(data);
      }
    } catch (error) {
      console.error('Erro ao buscar tabelas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCampoChange = (index: number, field: string, value: any) => {
    const newCampos = [...formData.campos];
    newCampos[index] = { ...newCampos[index], [field]: value };
    setFormData(prev => ({
      ...prev,
      campos: newCampos
    }));
  };

  const addCampo = () => {
    setFormData(prev => ({
      ...prev,
      campos: [...prev.campos, { nome: "", tipo: "TEXT", obrigatorio: false, unico: false }]
    }));
  };

  const removeCampo = (index: number) => {
    setFormData(prev => ({
      ...prev,
      campos: prev.campos.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/tabelas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          empresaId: 1 // TODO: Pegar da empresa do usuário logado
        }),
      });

      if (response.ok) {
        alert('Tabela criada com sucesso!');
        setFormData({
          nome: "",
          descricao: "",
          campos: [{ nome: "", tipo: "TEXT", obrigatorio: false, unico: false }]
        });
        setShowCreateForm(false);
        fetchTabelas();
      } else {
        throw new Error('Erro ao criar tabela');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao criar tabela');
    } finally {
      setLoading(false);
    }
  };

  const deleteTabela = async (id: number, nome: string) => {
    if (!confirm(`Tem certeza que deseja excluir a tabela "${nome}"? Todos os dados serão perdidos!`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/tabelas/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Tabela excluída com sucesso!');
        fetchTabelas();
      } else {
        throw new Error('Erro ao excluir tabela');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao excluir tabela');
    }
  };

  if (loading && tabelas.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando tabelas...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Gerenciar Tabelas Dinâmicas</h1>
              <p className="mt-1 text-sm text-gray-500">
                Crie e gerencie tabelas customizadas para sua empresa
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
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                + Nova Tabela
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Formulário de Criação */}
        {showCreateForm && (
          <div className="bg-white shadow rounded-lg mb-8">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Criar Nova Tabela
              </h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Nome da Tabela *
                    </label>
                    <input
                      type="text"
                      name="nome"
                      value={formData.nome}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="ex: produtos_customizados"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Descrição
                    </label>
                    <input
                      type="text"
                      name="descricao"
                      value={formData.descricao}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Campos da Tabela */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-md font-medium text-gray-900">Campos da Tabela</h4>
                    <button
                      type="button"
                      onClick={addCampo}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                    >
                      + Adicionar Campo
                    </button>
                  </div>

                  {formData.campos.map((campo, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Nome *
                          </label>
                          <input
                            type="text"
                            value={campo.nome}
                            onChange={(e) => handleCampoChange(index, 'nome', e.target.value)}
                            required
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Tipo *
                          </label>
                          <select
                            value={campo.tipo}
                            onChange={(e) => handleCampoChange(index, 'tipo', e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="TEXT">Texto</option>
                            <option value="NUMBER">Número</option>
                            <option value="DATE">Data</option>
                            <option value="BOOLEAN">Verdadeiro/Falso</option>
                            <option value="SELECT">Seleção</option>
                          </select>
                        </div>
                        <div className="flex items-center">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={campo.obrigatorio}
                              onChange={(e) => handleCampoChange(index, 'obrigatorio', e.target.checked)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">Obrigatório</span>
                          </label>
                        </div>
                        <div className="flex items-center">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={campo.unico}
                              onChange={(e) => handleCampoChange(index, 'unico', e.target.checked)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">Único</span>
                          </label>
                        </div>
                        <div className="flex items-center">
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => removeCampo(index)}
                              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                            >
                              Remover
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Criando...' : 'Criar Tabela'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Lista de Tabelas */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Tabelas Existentes
            </h3>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome da Tabela
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descrição
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Empresa
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Campos
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Registros
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tabelas.map((tabela) => (
                    <tr key={tabela.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {tabela.nome}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {tabela.descricao || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {tabela.empresa.nome}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {tabela.campos.length}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {tabela._count.registros}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <Link
                          href={`/admin/tabelas/${tabela.id}/dados`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Ver Dados
                        </Link>
                        <Link
                          href={`/admin/tabelas/${tabela.id}/editar`}
                          className="text-green-600 hover:text-green-900"
                        >
                          Editar
                        </Link>
                        <button
                          onClick={() => deleteTabela(tabela.id, tabela.nome)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {tabelas.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhuma tabela dinâmica encontrada.</p>
                <p className="text-sm text-gray-400 mt-2">
                  Clique em "Nova Tabela" para criar sua primeira tabela customizada.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
