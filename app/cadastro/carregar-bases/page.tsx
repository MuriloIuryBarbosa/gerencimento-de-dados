"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileText, CheckCircle, XCircle, AlertCircle, History, RefreshCw } from 'lucide-react';

interface ArquivoProcessado {
  nome: string;
  status: 'pendente' | 'processando' | 'concluido' | 'erro';
  progresso: number;
  totalRegistros: number;
  registrosValidos: number;
  registrosInvalidos: number;
  skusCriados?: number;
  skusAtualizados?: number;
  erros?: string[];
}

interface ArquivoHistorico {
  id: number;
  nomeArquivo: string;
  empresa: string;
  dataProcessamento: Date;
  totalRegistros: number;
  registrosValidos: number;
  registrosInvalidos: number;
  status: string;
  erros?: string;
  usuario?: {
    nome: string;
    email: string;
  };
}

interface EstatisticasHistorico {
  totalArquivos: number;
  totalRegistros: number;
  totalValidos: number;
  totalInvalidos: number;
}

export default function CarregarBasesPage() {
  const [arquivosSelecionados, setArquivosSelecionados] = useState<File[]>([]);
  const [arquivosProcessados, setArquivosProcessados] = useState<ArquivoProcessado[]>([]);
  const [processando, setProcessando] = useState(false);
  const [historico, setHistorico] = useState<ArquivoHistorico[]>([]);
  const [estatisticasHistorico, setEstatisticasHistorico] = useState<EstatisticasHistorico | null>(null);
  const [carregandoHistorico, setCarregandoHistorico] = useState(false);

  useEffect(() => {
    carregarHistorico();
  }, []);

  const carregarHistorico = async () => {
    setCarregandoHistorico(true);
    try {
      const response = await fetch('/api/estoque/arquivos-processados');
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setHistorico(result.data.arquivos);
          setEstatisticasHistorico(result.data.estatisticas);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    } finally {
      setCarregandoHistorico(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const arquivosValidos = files.filter(file =>
      file.name.endsWith('.txt') &&
      ['tecido01.txt', 'fatex01.txt', 'confec01.txt', 'estsc01.txt'].includes(file.name)
    );

    if (arquivosValidos.length !== files.length) {
      alert('Apenas arquivos .txt dos tipos: tecido01.txt, fatex01.txt, confec01.txt, estsc01.txt são aceitos.');
      return;
    }

    setArquivosSelecionados(arquivosValidos);
    setArquivosProcessados(arquivosValidos.map(file => ({
      nome: file.name,
      status: 'pendente',
      progresso: 0,
      totalRegistros: 0,
      registrosValidos: 0,
      registrosInvalidos: 0
    })));
  };

  const processarArquivo = async (file: File, index: number) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Atualizar status para processando
      setArquivosProcessados(prev => prev.map((item, i) =>
        i === index ? { ...item, status: 'processando' } : item
      ));

      const response = await fetch('/api/estoque/carregar-base', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setArquivosProcessados(prev => prev.map((item, i) =>
          i === index ? {
            ...item,
            status: 'concluido',
            progresso: 100,
            totalRegistros: result.totalRegistros,
            registrosValidos: result.registrosValidos,
            registrosInvalidos: result.registrosInvalidos,
            skusCriados: result.skusCriados,
            skusAtualizados: result.skusAtualizados
          } : item
        ));
      } else {
        setArquivosProcessados(prev => prev.map((item, i) =>
          i === index ? {
            ...item,
            status: 'erro',
            progresso: 0,
            erros: result.erros || ['Erro desconhecido']
          } : item
        ));
      }
    } catch (error) {
      setArquivosProcessados(prev => prev.map((item, i) =>
        i === index ? {
          ...item,
          status: 'erro',
          progresso: 0,
          erros: ['Erro de conexão']
        } : item
      ));
    }
  };

  const handleProcessarTodos = async () => {
    if (arquivosSelecionados.length === 0) return;

    setProcessando(true);

    for (let i = 0; i < arquivosSelecionados.length; i++) {
      await processarArquivo(arquivosSelecionados[i], i);
    }

    setProcessando(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'concluido':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'erro':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'processando':
        return <AlertCircle className="h-5 w-5 text-blue-500 animate-spin" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'concluido':
        return 'Concluído';
      case 'erro':
        return 'Erro';
      case 'processando':
        return 'Processando';
      default:
        return 'Pendente';
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Carregar Bases de Estoque</h1>
        <p className="text-gray-600 mt-2">
          Faça upload dos arquivos de estoque para processar e importar os dados para o sistema.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Card de Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Selecionar Arquivos
            </CardTitle>
            <CardDescription>
              Selecione os arquivos de estoque (.txt) para processamento.
              Arquivos aceitos: tecido01.txt, fatex01.txt, confec01.txt, estsc01.txt
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="file-upload">Arquivos de Estoque</Label>
                <Input
                  id="file-upload"
                  type="file"
                  multiple
                  accept=".txt"
                  onChange={handleFileSelect}
                  className="mt-1"
                />
              </div>

              {arquivosSelecionados.length > 0 && (
                <div className="flex gap-4">
                  <Button
                    onClick={handleProcessarTodos}
                    disabled={processando}
                    className="flex-1"
                  >
                    {processando ? 'Processando...' : 'Processar Todos os Arquivos'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setArquivosSelecionados([]);
                      setArquivosProcessados([]);
                    }}
                  >
                    Limpar
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Lista de Arquivos Processados */}
        {arquivosProcessados.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Status do Processamento</CardTitle>
              <CardDescription>
                Acompanhe o progresso do processamento dos arquivos selecionados.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {arquivosProcessados.map((arquivo, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(arquivo.status)}
                        <span className="font-medium">{arquivo.nome}</span>
                      </div>
                      <span className={`text-sm px-2 py-1 rounded ${
                        arquivo.status === 'concluido' ? 'bg-green-100 text-green-800' :
                        arquivo.status === 'erro' ? 'bg-red-100 text-red-800' :
                        arquivo.status === 'processando' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {getStatusText(arquivo.status)}
                      </span>
                    </div>

                    {arquivo.status === 'processando' && (
                      <Progress value={arquivo.progresso} className="mb-2" />
                    )}

                    {arquivo.status === 'concluido' && (
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>Total de registros: {arquivo.totalRegistros}</div>
                        <div>Registros válidos: {arquivo.registrosValidos}</div>
                        <div>Registros inválidos: {arquivo.registrosInvalidos}</div>
                        {arquivo.skusCriados !== undefined && (
                          <div className="text-green-600">SKUs criados: {arquivo.skusCriados}</div>
                        )}
                        {arquivo.skusAtualizados !== undefined && (
                          <div className="text-blue-600">SKUs atualizados: {arquivo.skusAtualizados}</div>
                        )}
                      </div>
                    )}

                    {arquivo.status === 'erro' && arquivo.erros && (
                      <Alert className="mt-2">
                        <AlertDescription>
                          <div className="font-medium mb-1">Erros encontrados:</div>
                          <ul className="list-disc list-inside text-sm">
                            {arquivo.erros.map((erro, i) => (
                              <li key={i}>{erro}</li>
                            ))}
                          </ul>
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Histórico de Processamento */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Histórico de Processamento
                </CardTitle>
                <CardDescription>
                  Arquivos de estoque processados anteriormente
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={carregarHistorico}
                disabled={carregandoHistorico}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${carregandoHistorico ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {estatisticasHistorico && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{estatisticasHistorico.totalArquivos}</div>
                  <div className="text-sm text-blue-600">Arquivos Processados</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{estatisticasHistorico.totalRegistros.toLocaleString()}</div>
                  <div className="text-sm text-green-600">Total de Registros</div>
                </div>
                <div className="text-center p-4 bg-emerald-50 rounded-lg">
                  <div className="text-2xl font-bold text-emerald-600">{estatisticasHistorico.totalValidos.toLocaleString()}</div>
                  <div className="text-sm text-emerald-600">Registros Válidos</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{estatisticasHistorico.totalInvalidos.toLocaleString()}</div>
                  <div className="text-sm text-orange-600">Registros Inválidos</div>
                </div>
              </div>
            )}

            {carregandoHistorico ? (
              <div className="text-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
                <p className="text-gray-600">Carregando histórico...</p>
              </div>
            ) : historico.length === 0 ? (
              <div className="text-center py-8">
                <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Nenhum arquivo processado ainda</p>
                <p className="text-sm text-gray-400">Os arquivos processados aparecerão aqui</p>
              </div>
            ) : (
              <div className="space-y-4">
                {historico.map((arquivo) => (
                  <div key={arquivo.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{arquivo.nomeArquivo}</h4>
                        <p className="text-sm text-gray-600">{arquivo.empresa}</p>
                      </div>
                      <div className="text-right">
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          arquivo.status === 'Concluido' ? 'bg-green-100 text-green-800' :
                          arquivo.status === 'Erro' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {arquivo.status === 'Concluido' ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : arquivo.status === 'Erro' ? (
                            <XCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <AlertCircle className="h-3 w-3 mr-1" />
                          )}
                          {arquivo.status}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(arquivo.dataProcessamento).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Total:</span>
                        <span className="font-medium ml-1">{arquivo.totalRegistros}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Válidos:</span>
                        <span className="font-medium text-green-600 ml-1">{arquivo.registrosValidos}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Inválidos:</span>
                        <span className="font-medium text-orange-600 ml-1">{arquivo.registrosInvalidos}</span>
                      </div>
                    </div>

                    {arquivo.usuario && (
                      <div className="mt-2 text-xs text-gray-500">
                        Processado por: {arquivo.usuario.nome}
                      </div>
                    )}

                    {arquivo.erros && (
                      <Alert className="mt-2">
                        <AlertDescription>
                          <div className="font-medium text-sm mb-1">Erros encontrados:</div>
                          <div className="text-xs text-gray-600 max-h-20 overflow-y-auto">
                            {arquivo.erros}
                          </div>
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
