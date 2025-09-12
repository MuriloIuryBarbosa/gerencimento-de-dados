"use client";

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileText, CheckCircle, AlertTriangle, X, Download } from 'lucide-react';
import Papa from 'papaparse';

interface ColumnMapping {
  csvColumn: string;
  dbField: string;
  required: boolean;
}

interface CSVUploadProps {
  title: string;
  moduleName: string;
  availableFields: Array<{
    key: string;
    label: string;
    required: boolean;
    type: 'string' | 'number' | 'date' | 'boolean';
  }>;
  onImport: (data: any[], mappings: ColumnMapping[]) => Promise<{ success: boolean; message: string; imported: number; errors: string[] }>;
  sampleData?: any[];
}

export default function CSVUpload({ title, moduleName, availableFields, onImport, sampleData }: CSVUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<any[]>([]);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [columnMappings, setColumnMappings] = useState<ColumnMapping[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processedRecords, setProcessedRecords] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentStatus, setCurrentStatus] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [importResult, setImportResult] = useState<{ success: boolean; message: string; imported: number; errors: string[] } | null>(null);
  const [currentStep, setCurrentStep] = useState<'upload' | 'mapping' | 'preview' | 'importing'>('upload');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estado para notificações
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
    timestamp: number;
  }>>([]);

  // Função para adicionar notificação
  const addNotification = (type: 'success' | 'error' | 'info' | 'warning', message: string) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, type, message, timestamp: Date.now() }]);

    // Remover notificação automaticamente após 5 segundos
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  // Função para remover notificação
  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && (selectedFile.type === 'text/csv' || selectedFile.name.toLowerCase().endsWith('.csv'))) {
      setFile(selectedFile);
      parseCSV(selectedFile);
    } else {
      addNotification('error', 'Por favor, selecione um arquivo CSV válido.');
      alert('Por favor, selecione um arquivo CSV válido.');
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);

    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const selectedFile = files[0];
      if (selectedFile.type === 'text/csv' || selectedFile.name.toLowerCase().endsWith('.csv')) {
        setFile(selectedFile);
        parseCSV(selectedFile);
      } else {
        addNotification('error', 'Por favor, arraste um arquivo CSV válido.');
        alert('Por favor, arraste um arquivo CSV válido.');
      }
    }
  };

  const parseCSV = (file: File) => {
    addNotification('info', `Processando arquivo: ${file.name}`);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      encoding: 'UTF-8',
      transformHeader: (header: string) => header.trim(),
      transform: (value: string) => value?.trim(),
      complete: (results: Papa.ParseResult<any>) => {
        if (results.errors.length > 0) {
          console.error('Erros no parsing CSV:', results.errors);
          addNotification('error', `Erro ao processar o arquivo CSV: ${results.errors[0].message}`);
          alert(`Erro ao processar o arquivo CSV: ${results.errors[0].message}\n\nVerifique se o arquivo está no formato correto e salvo com encoding UTF-8.`);
          return;
        }

        if (!results.data || results.data.length === 0) {
          addNotification('warning', 'O arquivo CSV está vazio ou não contém dados válidos.');
          alert('O arquivo CSV está vazio ou não contém dados válidos.');
          return;
        }

        if (!results.meta.fields || results.meta.fields.length === 0) {
          addNotification('warning', 'O arquivo CSV não contém cabeçalhos válidos.');
          alert('O arquivo CSV não contém cabeçalhos válidos.');
          return;
        }

        setCsvData(results.data);
        setCsvHeaders(results.meta.fields);
        setCurrentStep('mapping');

        // Inicializar mapeamentos automáticos
        const autoMappings: ColumnMapping[] = [];
        availableFields.forEach(field => {
          const matchingHeader = results.meta.fields?.find((header: string) =>
            header.toLowerCase().includes(field.key.toLowerCase()) ||
            header.toLowerCase().includes(field.label.toLowerCase())
          );
          if (matchingHeader) {
            autoMappings.push({
              csvColumn: matchingHeader,
              dbField: field.key,
              required: field.required
            });
          }
        });
        setColumnMappings(autoMappings);
        addNotification('success', `Arquivo processado com sucesso! ${results.data.length} registros encontrados.`);
      },
      error: (error) => {
        console.error('Erro crítico no parsing:', error);
        addNotification('error', 'Erro ao ler o arquivo CSV. Verifique se o arquivo não está corrompido.');
        alert('Erro ao ler o arquivo CSV. Verifique se o arquivo não está corrompido e está salvo com encoding UTF-8.');
      }
    });
  };

  const handleMappingChange = (csvColumn: string, dbField: string) => {
    setColumnMappings(prev => {
      const existing = prev.find(m => m.csvColumn === csvColumn);
      if (existing) {
        return prev.map(m =>
          m.csvColumn === csvColumn
            ? { ...m, dbField, required: availableFields.find(f => f.key === dbField)?.required || false }
            : m
        );
      } else {
        return [...prev, {
          csvColumn,
          dbField,
          required: availableFields.find(f => f.key === dbField)?.required || false
        }];
      }
    });
  };

  const removeMapping = (csvColumn: string) => {
    setColumnMappings(prev => prev.filter(m => m.csvColumn !== csvColumn));
  };

  const proceedToPreview = () => {
    // Validar mapeamentos obrigatórios
    const requiredFields = availableFields.filter(f => f.required);
    const mappedRequiredFields = requiredFields.filter(field =>
      columnMappings.some(m => m.dbField === field.key)
    );

    if (mappedRequiredFields.length < requiredFields.length) {
      addNotification('warning', 'Por favor, mapeie todos os campos obrigatórios antes de continuar.');
      alert('Por favor, mapeie todos os campos obrigatórios antes de continuar.');
      return;
    }

    setCurrentStep('preview');
    addNotification('success', 'Mapeamento concluído! Revise os dados no preview antes de importar.');
  };

  const handleImport = async () => {
    if (!csvData.length) return;

    setIsUploading(true);
    setUploadProgress(0);
    setProcessedRecords(0);
    setTotalRecords(csvData.length);
    setCurrentStatus('Iniciando importação...');
    setStartTime(Date.now());
    setCurrentStep('importing');

    addNotification('info', `Iniciando importação de ${csvData.length} registros...`);

    try {
      // Fase 1: Preparação dos dados
      setCurrentStatus('Preparando dados para importação...');
      setUploadProgress(10);

      await new Promise(resolve => setTimeout(resolve, 500)); // Simular tempo de preparação

      // Fase 2: Validação dos dados
      setCurrentStatus('Validando dados...');
      setUploadProgress(20);

      // Transformar dados baseado nos mapeamentos
      const transformedData = csvData.map((row, index) => {
        const transformedRow: any = {};
        columnMappings.forEach(mapping => {
          const fieldConfig = availableFields.find(f => f.key === mapping.dbField);
          let value = row[mapping.csvColumn];

          // Conversão de tipos
          if (fieldConfig?.type === 'number' && value) {
            value = parseFloat(value.toString().replace(',', '.'));
          } else if (fieldConfig?.type === 'boolean') {
            value = ['true', '1', 'sim', 'yes'].includes(value?.toString().toLowerCase());
          }

          transformedRow[mapping.dbField] = value;
        });
        return transformedRow;
      });

      // Fase 3: Envio para processamento
      setCurrentStatus('Enviando dados para processamento...');
      setUploadProgress(30);

      // Simular processamento em lotes para melhor feedback visual
      const batchSize = Math.max(1, Math.floor(transformedData.length / 20)); // Dividir em 20 lotes para mais feedback
      let processed = 0;

      setCurrentStatus(`Preparando ${transformedData.length} registros...`);
      setUploadProgress(35);

      // Pequena pausa para visualização
      await new Promise(resolve => setTimeout(resolve, 200));

      setCurrentStatus(`Processando registros... (0/${transformedData.length})`);
      setUploadProgress(40);

      // Processar em lotes simulados para feedback visual
      for (let i = 0; i < transformedData.length; i += batchSize) {
        const batch = transformedData.slice(i, i + batchSize);
        processed += batch.length;
        setProcessedRecords(processed);

        const progressPercent = 40 + Math.floor((processed / transformedData.length) * 45); // 40-85%
        setUploadProgress(progressPercent);
        setCurrentStatus(`Processando registros... (${processed}/${transformedData.length})`);

        // Pequena pausa para visualização do progresso
        await new Promise(resolve => setTimeout(resolve, 150));
      }

      // Fase 4: Finalização
      setCurrentStatus('Enviando para o servidor...');
      setUploadProgress(90);

      await new Promise(resolve => setTimeout(resolve, 300));

      setCurrentStatus('Aguardando resposta do servidor...');
      setUploadProgress(95);

      // Timeout de 6 minutos para a chamada da API
      const apiCallPromise = onImport(transformedData, columnMappings);
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout: A importação demorou mais de 6 minutos')), 360000);
      });

      const result = await Promise.race([apiCallPromise, timeoutPromise]) as {
        success: boolean;
        message: string;
        imported: number;
        errors: string[];
      };
      setImportResult(result);
      setUploadProgress(100);
      setCurrentStatus('Importação concluída!');

      if (result.success) {
        addNotification('success', `Importação concluída! ${result.imported} registros importados com sucesso.`);
      } else {
        addNotification('error', `Erro na importação: ${result.message}`);
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setImportResult({
        success: false,
        message: 'Erro durante a importação',
        imported: 0,
        errors: [errorMessage]
      });
      setCurrentStatus('Erro na importação');
      addNotification('error', `Erro durante a importação: ${errorMessage}`);
      console.error('Erro na importação:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setCsvData([]);
    setCsvHeaders([]);
    setColumnMappings([]);
    setImportResult(null);
    setCurrentStep('upload');
    setUploadProgress(0);
    setProcessedRecords(0);
    setTotalRecords(0);
    setCurrentStatus('');
    setStartTime(null);
    setIsDragOver(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadSampleCSV = () => {
    if (!sampleData || !availableFields.length) return;

    const headers = availableFields.map(f => f.label);
    const csvContent = [headers.join(',')];

    sampleData.forEach(row => {
      const csvRow = availableFields.map(field => {
        const value = row[field.key];
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`;
        }
        return value || '';
      });
      csvContent.push(csvRow.join(','));
    });

    const blob = new Blob([csvContent.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${moduleName}_exemplo.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Notifications */}
          {notifications.length > 0 && (
            <div className="mb-6 space-y-2">
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`flex items-center gap-3 p-4 rounded-lg border transition-all duration-300 ${
                    notification.type === 'success'
                      ? 'bg-green-50 border-green-200 text-green-800'
                      : notification.type === 'error'
                      ? 'bg-red-50 border-red-200 text-red-800'
                      : notification.type === 'warning'
                      ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
                      : 'bg-blue-50 border-blue-200 text-blue-800'
                  }`}
                >
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                    notification.type === 'success'
                      ? 'bg-green-500'
                      : notification.type === 'error'
                      ? 'bg-red-500'
                      : notification.type === 'warning'
                      ? 'bg-yellow-500'
                      : 'bg-blue-500'
                  }`}>
                    {notification.type === 'success' && <CheckCircle className="h-4 w-4 text-white" />}
                    {notification.type === 'error' && <AlertTriangle className="h-4 w-4 text-white" />}
                    {notification.type === 'warning' && <AlertTriangle className="h-4 w-4 text-white" />}
                    {notification.type === 'info' && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <p className="flex-1 text-sm font-medium">{notification.message}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeNotification(notification.id)}
                    className="flex-shrink-0 h-6 w-6 p-0 hover:bg-transparent"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          {/* Step Indicator */}
          <div className="flex items-center justify-center mb-8">
            {[
              { step: 'upload', label: 'Upload', desc: 'Selecionar arquivo' },
              { step: 'mapping', label: 'Mapeamento', desc: 'Associar colunas' },
              { step: 'preview', label: 'Preview', desc: 'Revisar dados' },
              { step: 'importing', label: 'Importação', desc: 'Processar dados' }
            ].map((stepInfo, index) => {
              const isActive = currentStep === stepInfo.step;
              const isCompleted = ['upload', 'mapping', 'preview', 'importing'].indexOf(currentStep) > index;
              const isAccessible = ['upload', 'mapping', 'preview', 'importing'].indexOf(currentStep) >= index;

              return (
                <div key={stepInfo.step} className="flex items-center">
                  <div className={`relative flex flex-col items-center`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      isCompleted
                        ? 'bg-green-500 text-white shadow-lg'
                        : isActive
                        ? 'bg-blue-500 text-white shadow-lg animate-pulse'
                        : isAccessible
                        ? 'bg-blue-100 text-blue-600 border-2 border-blue-300'
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {isCompleted ? '✓' : index + 1}
                    </div>
                    <div className="text-center mt-2">
                      <p className={`text-xs font-medium ${
                        isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        {stepInfo.label}
                      </p>
                      <p className={`text-xs ${
                        isActive ? 'text-blue-500' : 'text-gray-400'
                      }`}>
                        {stepInfo.desc}
                      </p>
                    </div>
                  </div>
                  {index < 3 && (
                    <div className={`w-16 h-0.5 mx-4 transition-all duration-500 ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Step 1: File Upload */}
          {currentStep === 'upload' && (
            <div className="text-center">
              <div
                className={`border-2 border-dashed rounded-lg p-8 mb-4 transition-colors cursor-pointer ${
                  isDragOver
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className={`h-12 w-12 mx-auto mb-4 transition-colors ${
                  isDragOver ? 'text-blue-500' : 'text-gray-400'
                }`} />
                <p className={`text-lg mb-2 transition-colors ${
                  isDragOver ? 'text-blue-600 font-medium' : 'text-gray-600'
                }`}>
                  {isDragOver ? 'Solte o arquivo aqui' : 'Arraste e solte um arquivo CSV aqui'}
                </p>
                <p className="text-gray-500 mb-4">ou</p>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="csv-upload"
                />
                <Label htmlFor="csv-upload">
                  <Button variant="outline" className="cursor-pointer">
                    <FileText className="h-4 w-4 mr-2" />
                    Selecionar Arquivo CSV
                  </Button>
                </Label>
                {file && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <p className="text-sm font-medium text-green-800">
                        Arquivo selecionado com sucesso!
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Nome:</span>
                        <p className="text-gray-900">{file.name}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Tamanho:</span>
                        <p className="text-gray-900">
                          {(file.size / 1024).toFixed(1)} KB
                          {file.size > 1024 * 1024 && ` (${(file.size / (1024 * 1024)).toFixed(1)} MB)`}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-green-700 mt-2">
                      ✅ Arquivo válido. Clique em "Continuar" para mapear as colunas.
                    </p>
                  </div>
                )}
              </div>

              {sampleData && (
                <Button variant="outline" onClick={downloadSampleCSV} className="mb-4">
                  <Download className="h-4 w-4 mr-2" />
                  Baixar Exemplo CSV
                </Button>
              )}

              <div className="text-sm text-gray-500">
                <p>• Arquivo deve estar no formato CSV</p>
                <p>• Primeira linha deve conter os cabeçalhos das colunas</p>
                <p>• Use vírgula (,) como separador</p>
              </div>
            </div>
          )}

          {/* Step 2: Column Mapping */}
          {currentStep === 'mapping' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Mapeamento de Colunas</h3>
              <p className="text-gray-600 mb-6">
                Associe as colunas do seu CSV com os campos do sistema. Campos obrigatórios estão marcados com *.
              </p>

              <div className="space-y-4">
                {csvHeaders.map(header => {
                  const mapping = columnMappings.find(m => m.csvColumn === header);
                  return (
                    <div key={header} className="flex items-center gap-4 p-4 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors">
                      <div className="flex-1">
                        <Label className="text-sm font-medium">Coluna CSV: {header}</Label>
                        <p className="text-xs text-gray-500">Amostra: {csvData[0]?.[header]?.toString().slice(0, 50)}...</p>
                      </div>

                      <div className="flex-1">
                        <Label className="text-sm font-medium">Campo do Sistema</Label>
                        <Select
                          value={mapping?.dbField || ''}
                          onValueChange={(value) => handleMappingChange(header, value)}
                        >
                          <SelectTrigger className="bg-white border-gray-300">
                            <SelectValue placeholder="Selecione um campo" />
                          </SelectTrigger>
                          <SelectContent className="bg-white border border-gray-300 shadow-lg">
                            {availableFields.map(field => (
                              <SelectItem key={field.key} value={field.key} className="bg-white hover:bg-gray-100">
                                {field.label} {field.required && '*'}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {mapping && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeMapping(header)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={resetUpload}>
                  Voltar
                </Button>
                <Button onClick={proceedToPreview}>
                  Continuar para Preview
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Preview */}
          {currentStep === 'preview' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Preview dos Dados</h3>

              {/* Resumo dos Dados */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{csvData.length}</p>
                    <p className="text-sm text-blue-800">Total de Registros</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{columnMappings.length}</p>
                    <p className="text-sm text-green-800">Colunas Mapeadas</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">
                      {availableFields.filter(f => f.required).length}
                    </p>
                    <p className="text-sm text-orange-800">Campos Obrigatórios</p>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 mb-6">
                Revise os primeiros registros antes de importar. Clique em "Importar" para processar todos os {csvData.length} registros.
              </p>

              <div className="overflow-x-auto mb-6">
                <table className="min-w-full border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      {columnMappings.map(mapping => {
                        const field = availableFields.find(f => f.key === mapping.dbField);
                        return (
                          <th key={mapping.dbField} className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                            {field?.label} {field?.required && <span className="text-red-500">*</span>}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {csvData.slice(0, 5).map((row, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        {columnMappings.map(mapping => (
                          <td key={mapping.dbField} className="px-4 py-2 text-sm text-gray-900">
                            {row[mapping.csvColumn]?.toString().slice(0, 50)}
                            {row[mapping.csvColumn]?.toString().length > 50 && '...'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mostrar mais registros se houver */}
              {csvData.length > 5 && (
                <p className="text-sm text-gray-500 text-center mb-4">
                  ... e mais {csvData.length - 5} registros
                </p>
              )}

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep('mapping')}>
                  Voltar
                </Button>
                <Button onClick={handleImport} disabled={isUploading} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                  {isUploading ? 'Importando...' : `Importar ${csvData.length} registros`}
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Importing */}
          {currentStep === 'importing' && (
            <div className="text-center">
              <div className="mb-6">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>

                {/* Barra de Progresso Melhorada */}
                <div className="w-full bg-gray-200 rounded-full h-4 mb-4 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>

                {/* Informações de Progresso Detalhadas */}
                <div className="space-y-3">
                  <p className="text-lg font-semibold text-gray-800">
                    {uploadProgress}% concluído
                  </p>

                  {totalRecords > 0 && (
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="bg-blue-50 rounded-lg p-2">
                        <p className="font-medium text-blue-600">{processedRecords}</p>
                        <p className="text-blue-800">Processados</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-2">
                        <p className="font-medium text-green-600">{Math.floor((processedRecords / totalRecords) * 100)}%</p>
                        <p className="text-green-800">Completo</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2">
                        <p className="font-medium text-gray-600">{totalRecords - processedRecords}</p>
                        <p className="text-gray-800">Restantes</p>
                      </div>
                    </div>
                  )}

                  <p className="text-sm text-blue-600 font-medium">
                    {currentStatus}
                  </p>

                  {/* Estimativa de Tempo Restante */}
                  {startTime && processedRecords > 0 && processedRecords < totalRecords && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                      <p className="text-sm font-medium text-blue-800">
                        ⏱️ Tempo estimado restante: {(() => {
                          const elapsed = Date.now() - startTime;
                          const remaining = (elapsed / processedRecords) * (totalRecords - processedRecords);
                          const seconds = Math.ceil(remaining / 1000);
                          if (seconds < 60) return `${seconds}s`;
                          const minutes = Math.floor(seconds / 60);
                          const remainingSeconds = seconds % 60;
                          return `${minutes}m ${remainingSeconds}s`;
                        })()}
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        📊 Velocidade: {(() => {
                          const elapsed = (Date.now() - startTime) / 1000; // segundos
                          const rate = processedRecords / elapsed;
                          return `${rate.toFixed(1)} registros/segundo`;
                        })()}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Etapas do Processo Visual */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
                {[
                  { step: 1, label: 'Preparação', desc: 'Validando dados', completed: uploadProgress >= 20 },
                  { step: 2, label: 'Validação', desc: 'Verificando estrutura', completed: uploadProgress >= 40 },
                  { step: 3, label: 'Processamento', desc: 'Importando registros', completed: uploadProgress >= 90 },
                  { step: 4, label: 'Finalização', desc: 'Completando operação', completed: uploadProgress >= 100 }
                ].map(({ step, label, desc, completed }) => (
                  <div key={step} className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                    completed
                      ? 'border-green-300 bg-green-50 shadow-md'
                      : uploadProgress >= (step - 1) * 25
                      ? 'border-blue-300 bg-blue-50 shadow-sm'
                      : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-2 transition-all duration-300 ${
                      completed
                        ? 'bg-green-500 text-white shadow-lg'
                        : uploadProgress >= (step - 1) * 25
                        ? 'bg-blue-500 text-white shadow-lg animate-pulse'
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      {completed ? '✓' : step}
                    </div>
                    <p className={`text-sm font-medium text-center mb-1 ${
                      completed ? 'text-green-700' : 'text-gray-700'
                    }`}>
                      {label}
                    </p>
                    <p className={`text-xs text-center ${
                      completed ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Import Result */}
          {importResult && (
            <div className={`mt-6 rounded-lg border-2 p-6 transition-all duration-300 ${
              importResult.success
                ? 'border-green-300 bg-green-50 shadow-lg'
                : 'border-red-300 bg-red-50 shadow-lg'
            }`}>
              <div className="flex items-start gap-4">
                {importResult.success ? (
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                      <AlertTriangle className="h-6 w-6 text-white" />
                    </div>
                  </div>
                )}

                <div className="flex-1">
                  <h4 className="text-xl font-bold mb-3 flex items-center gap-2">
                    {importResult.success ? (
                      <>
                        <span className="text-green-700">Importação Concluída com Sucesso!</span>
                        <span className="text-2xl">🎉</span>
                      </>
                    ) : (
                      <>
                        <span className="text-red-700">Erro na Importação</span>
                        <span className="text-2xl">⚠️</span>
                      </>
                    )}
                  </h4>

                  <AlertDescription className="font-medium mb-4 text-base text-gray-800">
                    {importResult.message}
                  </AlertDescription>

                  {/* Estatísticas Detalhadas */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-lg p-4 text-center border border-gray-200 shadow-sm">
                      <div className="text-3xl font-bold text-blue-600 mb-1">{totalRecords}</div>
                      <div className="text-sm font-medium text-gray-700">Total Processado</div>
                      <div className="text-xs text-gray-500">registros analisados</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center border border-gray-200 shadow-sm">
                      <div className="text-3xl font-bold text-green-600 mb-1">{importResult.imported}</div>
                      <div className="text-sm font-medium text-gray-700">Importados</div>
                      <div className="text-xs text-green-600">com sucesso</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center border border-gray-200 shadow-sm">
                      <div className="text-3xl font-bold text-red-600 mb-1">{importResult.errors.length}</div>
                      <div className="text-sm font-medium text-gray-700">Erros</div>
                      <div className="text-xs text-red-600">registros com falha</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center border border-gray-200 shadow-sm">
                      <div className="text-3xl font-bold text-purple-600 mb-1">
                        {totalRecords > 0 ? Math.round((importResult.imported / totalRecords) * 100) : 0}%
                      </div>
                      <div className="text-sm font-medium text-gray-700">Taxa de Sucesso</div>
                      <div className="text-xs text-purple-600">eficiência</div>
                    </div>
                  </div>

                  {/* Tempo Total e Performance */}
                  {startTime && (
                    <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-700">
                            {(() => {
                              const totalTime = Date.now() - startTime;
                              const seconds = Math.floor(totalTime / 1000);
                              if (seconds < 60) return `${seconds}s`;
                              const minutes = Math.floor(seconds / 60);
                              const remainingSeconds = seconds % 60;
                              return `${minutes}m ${remainingSeconds}s`;
                            })()}
                          </div>
                          <div className="text-sm text-gray-600">Tempo Total</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600">
                            {totalRecords > 0 ? ((Date.now() - startTime) / totalRecords / 1000).toFixed(2) : 0}s
                          </div>
                          <div className="text-sm text-gray-600">Tempo por Registro</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600">
                            {totalRecords > 0 ? (totalRecords / ((Date.now() - startTime) / 1000)).toFixed(1) : 0}
                          </div>
                          <div className="text-sm text-gray-600">Registros/Segundo</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Lista de Erros */}
                  {importResult.errors.length > 0 && (
                    <div className="mt-4">
                      <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        <p className="font-semibold text-red-700">Detalhes dos erros ({importResult.errors.length})</p>
                      </div>
                      <div className="bg-white rounded-lg border border-red-200 max-h-48 overflow-y-auto shadow-sm">
                        <ul className="divide-y divide-red-100">
                          {importResult.errors.slice(0, 15).map((error, index) => (
                            <li key={index} className="px-4 py-3 text-sm text-red-700 hover:bg-red-50 transition-colors">
                              <div className="flex items-start gap-2">
                                <span className="text-red-500 font-mono text-xs mt-0.5">#{index + 1}</span>
                                <span>{error}</span>
                              </div>
                            </li>
                          ))}
                        </ul>
                        {importResult.errors.length > 15 && (
                          <div className="px-4 py-3 text-sm text-gray-500 bg-gray-50 border-t border-red-100">
                            ... e mais {importResult.errors.length - 15} erros
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Mensagem de Sucesso */}
                  {importResult.success && importResult.errors.length === 0 && (
                    <div className="mt-4 bg-green-100 border border-green-300 rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <p className="text-green-800 font-medium">
                          🎉 Todos os registros foram importados com sucesso! Não houve nenhum erro durante o processo.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {(currentStep === 'preview' || importResult) && (
            <div className="flex justify-center mt-6">
              <Button variant="outline" onClick={resetUpload}>
                Fazer Novo Upload
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
