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
  const [importResult, setImportResult] = useState<{ success: boolean; message: string; imported: number; errors: string[] } | null>(null);
  const [currentStep, setCurrentStep] = useState<'upload' | 'mapping' | 'preview' | 'importing'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      parseCSV(selectedFile);
    } else {
      alert('Por favor, selecione um arquivo CSV válido.');
    }
  };

  const parseCSV = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          alert('Erro ao processar o arquivo CSV: ' + results.errors[0].message);
          return;
        }

        setCsvData(results.data);
        setCsvHeaders(results.meta.fields || []);
        setCurrentStep('mapping');

        // Inicializar mapeamentos automáticos
        const autoMappings: ColumnMapping[] = [];
        availableFields.forEach(field => {
          const matchingHeader = results.meta.fields?.find(header =>
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
      alert('Por favor, mapeie todos os campos obrigatórios antes de continuar.');
      return;
    }

    setCurrentStep('preview');
  };

  const handleImport = async () => {
    if (!csvData.length) return;

    setIsUploading(true);
    setUploadProgress(0);
    setCurrentStep('importing');

    try {
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

      const result = await onImport(transformedData, columnMappings);
      setImportResult(result);
      setUploadProgress(100);

    } catch (error) {
      setImportResult({
        success: false,
        message: 'Erro durante a importação',
        imported: 0,
        errors: [error instanceof Error ? error.message : 'Erro desconhecido']
      });
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
          {/* Step Indicator */}
          <div className="flex items-center justify-center mb-8">
            {['upload', 'mapping', 'preview', 'importing'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep === step ? 'bg-blue-500 text-white' :
                  ['upload', 'mapping', 'preview', 'importing'].indexOf(currentStep) > index ? 'bg-green-500 text-white' :
                  'bg-gray-200 text-gray-600'
                }`}>
                  {index + 1}
                </div>
                <span className={`ml-2 text-sm ${
                  currentStep === step ? 'text-blue-600 font-medium' : 'text-gray-500'
                }`}>
                  {step === 'upload' ? 'Upload' :
                   step === 'mapping' ? 'Mapeamento' :
                   step === 'preview' ? 'Preview' : 'Importando'}
                </span>
                {index < 3 && (
                  <div className={`w-12 h-0.5 mx-4 ${
                    ['upload', 'mapping', 'preview', 'importing'].indexOf(currentStep) > index ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: File Upload */}
          {currentStep === 'upload' && (
            <div className="text-center">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-4">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  Arraste e solte um arquivo CSV aqui ou clique para selecionar
                </p>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
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
                    <div key={header} className="flex items-center gap-4 p-4 border rounded-lg">
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
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um campo" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableFields.map(field => (
                              <SelectItem key={field.key} value={field.key}>
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
              <p className="text-gray-600 mb-6">
                Revise os primeiros registros antes de importar. Serão importados {csvData.length} registros.
              </p>

              <div className="overflow-x-auto mb-6">
                <table className="min-w-full border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      {columnMappings.map(mapping => {
                        const field = availableFields.find(f => f.key === mapping.dbField);
                        return (
                          <th key={mapping.dbField} className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                            {field?.label} {field?.required && '*'}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {csvData.slice(0, 5).map((row, index) => (
                      <tr key={index} className="border-b">
                        {columnMappings.map(mapping => (
                          <td key={mapping.dbField} className="px-4 py-2 text-sm text-gray-900">
                            {row[mapping.csvColumn]?.toString().slice(0, 50)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep('mapping')}>
                  Voltar
                </Button>
                <Button onClick={handleImport} disabled={isUploading}>
                  {isUploading ? 'Importando...' : `Importar ${csvData.length} registros`}
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Importing */}
          {currentStep === 'importing' && (
            <div className="text-center">
              <div className="mb-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              </div>
              <p className="text-gray-600 mb-2">Importando dados...</p>
              <p className="text-sm text-gray-500">{uploadProgress}% concluído</p>
            </div>
          )}

          {/* Import Result */}
          {importResult && (
            <Alert className={`mt-6 ${importResult.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
              <div className="flex items-start gap-3">
                {importResult.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                )}
                <div className="flex-1">
                  <AlertDescription className="font-medium mb-2">
                    {importResult.message}
                  </AlertDescription>
                  <p className="text-sm mb-2">
                    Registros importados: {importResult.imported}
                  </p>
                  {importResult.errors.length > 0 && (
                    <div className="text-sm">
                      <p className="font-medium mb-1">Erros encontrados:</p>
                      <ul className="list-disc list-inside space-y-1">
                        {importResult.errors.slice(0, 5).map((error, index) => (
                          <li key={index} className="text-red-600">{error}</li>
                        ))}
                        {importResult.errors.length > 5 && (
                          <li className="text-gray-500">... e mais {importResult.errors.length - 5} erros</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </Alert>
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
