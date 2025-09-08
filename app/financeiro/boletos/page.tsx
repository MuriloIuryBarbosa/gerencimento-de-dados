"use client";

import Link from "next/link";
import { useState } from "react";
import { FileText, Plus, Search, Filter, Download, Eye, Edit, Trash2, ArrowLeft, Calendar, DollarSign, AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface Boleto {
  id: string;
  numero: string;
  valor: number;
  vencimento: string;
  status: 'pendente' | 'pago' | 'vencido' | 'cancelado';
  cliente: string;
  descricao: string;
  dataEmissao: string;
  dataPagamento?: string;
}

export default function GestaoBoletosPage() {
  const [boletos, setBoletos] = useState<Boleto[]>([
    {
      id: '1',
      numero: '00123456789012345678',
      valor: 1500.00,
      vencimento: '2025-09-15',
      status: 'pendente',
      cliente: 'Empresa ABC Ltda',
      descricao: 'Pagamento de serviços - Agosto 2025',
      dataEmissao: '2025-09-01'
    },
    {
      id: '2',
      numero: '00123456789012345679',
      valor: 2500.00,
      vencimento: '2025-08-20',
      status: 'pago',
      cliente: 'Tech Solutions S.A.',
      descricao: 'Pagamento de produtos',
      dataEmissao: '2025-08-01',
      dataPagamento: '2025-08-18'
    },
    {
      id: '3',
      numero: '00123456789012345680',
      valor: 800.00,
      vencimento: '2025-08-10',
      status: 'vencido',
      cliente: 'Comércio XYZ Ltda',
      descricao: 'Pagamento de manutenção',
      dataEmissao: '2025-07-15'
    }
  ]);

  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [busca, setBusca] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pago': return 'bg-green-100 text-green-800 border-green-200';
      case 'pendente': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'vencido': return 'bg-red-100 text-red-800 border-red-200';
      case 'cancelado': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pago': return <CheckCircle size={16} />;
      case 'pendente': return <Clock size={16} />;
      case 'vencido': return <AlertCircle size={16} />;
      case 'cancelado': return <Trash2 size={16} />;
      default: return <FileText size={16} />;
    }
  };

  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const boletosFiltrados = boletos.filter(boleto => {
    const matchBusca = boleto.numero.toLowerCase().includes(busca.toLowerCase()) ||
                       boleto.cliente.toLowerCase().includes(busca.toLowerCase()) ||
                       boleto.descricao.toLowerCase().includes(busca.toLowerCase());

    const matchStatus = filtroStatus === 'todos' || boleto.status === filtroStatus;

    return matchBusca && matchStatus;
  });

  const calcularTotais = () => {
    const totais = {
      total: boletosFiltrados.reduce((sum, b) => sum + b.valor, 0),
      pago: boletosFiltrados.filter(b => b.status === 'pago').reduce((sum, b) => sum + b.valor, 0),
      pendente: boletosFiltrados.filter(b => b.status === 'pendente').reduce((sum, b) => sum + b.valor, 0),
      vencido: boletosFiltrados.filter(b => b.status === 'vencido').reduce((sum, b) => sum + b.valor, 0)
    };
    return totais;
  };

  const totais = calcularTotais();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-blue-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-full">
                <FileText size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Gestão de Boletos</h1>
                <p className="mt-1 text-green-100">
                  Controle completo de boletos e pagamentos
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/financeiro"
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full transition-colors duration-200"
              >
                ← Voltar
              </Link>
              <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full transition-colors duration-200 flex items-center space-x-2">
                <Plus size={18} />
                <span>Novo Boleto</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        {/* Cards de Totais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 border-l-8 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Geral</p>
                <p className="text-2xl font-bold text-gray-900">{formatarValor(totais.total)}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <DollarSign size={24} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border-l-8 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pago</p>
                <p className="text-2xl font-bold text-green-600">{formatarValor(totais.pago)}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle size={24} className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border-l-8 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pendente</p>
                <p className="text-2xl font-bold text-yellow-600">{formatarValor(totais.pendente)}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <Clock size={24} className="text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border-l-8 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Vencido</p>
                <p className="text-2xl font-bold text-red-600">{formatarValor(totais.vencido)}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <AlertCircle size={24} className="text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filtros e Busca */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por número, cliente ou descrição..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Filter size={20} className="text-gray-400" />
              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="todos">Todos os Status</option>
                <option value="pendente">Pendente</option>
                <option value="pago">Pago</option>
                <option value="vencido">Vencido</option>
                <option value="cancelado">Cancelado</option>
              </select>

              <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-xl transition-colors duration-200 flex items-center space-x-2">
                <Download size={18} />
                <span>Exportar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tabela de Boletos */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Boleto
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vencimento
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {boletosFiltrados.map((boleto) => (
                  <tr key={boleto.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {boleto.numero}
                        </div>
                        <div className="text-sm text-gray-500">
                          Emissão: {formatarData(boleto.dataEmissao)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{boleto.cliente}</div>
                      <div className="text-sm text-gray-500">{boleto.descricao}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatarValor(boleto.valor)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar size={16} className="text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          {formatarData(boleto.vencimento)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(boleto.status)}`}>
                        {getStatusIcon(boleto.status)}
                        <span className="ml-1 capitalize">{boleto.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye size={18} />
                        </button>
                        <button className="text-yellow-600 hover:text-yellow-900">
                          <Edit size={18} />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {boletosFiltrados.length === 0 && (
            <div className="text-center py-12">
              <FileText size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum boleto encontrado
              </h3>
              <p className="text-gray-500">
                Tente ajustar os filtros ou criar um novo boleto.
              </p>
            </div>
          )}
        </div>

        {/* Paginação */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Mostrando <span className="font-medium">1</span> a <span className="font-medium">{boletosFiltrados.length}</span> de{' '}
            <span className="font-medium">{boletosFiltrados.length}</span> resultados
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50">
              Anterior
            </button>
            <button className="px-3 py-2 bg-green-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-green-700">
              1
            </button>
            <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50">
              Próximo
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}