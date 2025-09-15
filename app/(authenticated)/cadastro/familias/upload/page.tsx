'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload, FileText, AlertCircle, CheckCircle, XCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Link from 'next/link'
import CSVUpload from '@/components/CSVUpload'

interface UploadResult {
  success: boolean
  imported: number
  errors: string[]
  duplicates: string[]
  message: string
  processingTime?: number
}

export default function FamiliasUploadPage() {
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  // Configuração dos campos disponíveis para famílias
  const availableFields = [
    {
      key: 'codigo',
      label: 'Código da Família',
      required: true,
      type: 'string' as const
    },
    {
      key: 'familia',
      label: 'Nome da Família',
      required: true,
      type: 'string' as const
    },
    {
      key: 'legado',
      label: 'Dados Legado',
      required: false,
      type: 'string' as const
    }
  ]

  // Função de importação
  const handleImport = async (data: any[], mappings: any[]) => {
    try {
      setIsUploading(true)
      setUploadResult(null)

      const response = await fetch('/api/familias/bulk-import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data, mappings }),
      })

      const result = await response.json()

      setUploadResult({
        success: result.success,
        imported: result.imported,
        errors: result.errors || [],
        duplicates: result.duplicates || [],
        message: result.message,
        processingTime: result.processingTime
      })

      setIsUploading(false)
      return result
    } catch (error) {
      console.error('Erro na importação:', error)
      const errorResult = {
        success: false,
        message: 'Erro ao conectar com o servidor',
        imported: 0,
        errors: ['Erro de conexão'],
        duplicates: []
      }
      setUploadResult(errorResult)
      setIsUploading(false)
      return errorResult
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Upload className="h-8 w-8" />
              Upload em Massa - Famílias
            </h1>
            <p className="text-purple-100 mt-2">
              Importe múltiplas famílias através de arquivo CSV
            </p>
          </div>
          <Link href="/cadastro/familias">
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              Voltar para Famílias
            </Button>
          </Link>
        </div>
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Instruções para Upload
          </CardTitle>
          <CardDescription>
            Siga estas instruções para importar famílias corretamente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Formato do CSV:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Arquivo deve estar em formato CSV (UTF-8)</li>
                <li>• Primeira linha deve conter os cabeçalhos</li>
                <li>• Use ponto e vírgula (;) ou vírgula (,) como separador</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Colunas obrigatórias:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <strong>Codigo Familia</strong>: Código da família (obrigatório)</li>
                <li>• <strong>Familia</strong>: Nome da família (obrigatório)</li>
                <li>• <strong>Familia</strong>: Nome legado (opcional)</li>
              </ul>
            </div>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Importante:</strong> Os campos "Codigo Familia" e "Familia" são obrigatórios.
              Registros duplicados (mesmo código) serão ignorados automaticamente.
            </AlertDescription>
          </Alert>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Exemplo de arquivo CSV:</h4>
            <pre className="text-xs text-gray-700 whitespace-pre-wrap">
{`CHAVE SKU;Codigo Familia;Familia
4565380;4565;MICROFIBRA 65G/M2 2.40M ESTAMPADA
4565370;4565;MICROFIBRA 65G/M2 2.40M ESTAMPADA
4565360;4565;MICROFIBRA 65G/M2 2.40M ESTAMPADA`}
            </pre>
            <div className="mt-3">
              <a
                href="/estoque/familias/famialias_mass_upload.csv"
                download
                className="inline-flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                <FileText className="h-4 w-4 mr-2" />
                Baixar Arquivo de Exemplo
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload Component */}
      <Card>
        <CardHeader>
          <CardTitle>Selecionar Arquivo CSV</CardTitle>
          <CardDescription>
            Escolha o arquivo CSV contendo as famílias a serem importadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CSVUpload
            title="Upload em Massa - Famílias"
            moduleName="familias"
            availableFields={availableFields}
            onImport={handleImport}
          />
        </CardContent>
      </Card>

      {/* Results */}
      {uploadResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {uploadResult.success ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              Resultado da Importação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className={uploadResult.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
              <AlertDescription className={uploadResult.success ? 'text-green-800' : 'text-red-800'}>
                {uploadResult.message}
                {uploadResult.processingTime && (
                  <span className="block mt-1 text-sm">
                    Tempo de processamento: {Math.round(uploadResult.processingTime / 1000)}s
                  </span>
                )}
              </AlertDescription>
            </Alert>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{uploadResult.imported}</div>
                <div className="text-sm text-blue-800">Importadas</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{uploadResult.duplicates.length}</div>
                <div className="text-sm text-yellow-800">Duplicadas</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{uploadResult.errors.length}</div>
                <div className="text-sm text-red-800">Erros</div>
              </div>
            </div>

            {uploadResult.duplicates.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2 text-yellow-800">Famílias duplicadas encontradas:</h4>
                <div className="max-h-32 overflow-y-auto bg-yellow-50 p-3 rounded border">
                  <ul className="text-sm text-yellow-800 space-y-1">
                    {uploadResult.duplicates.map((duplicate, index) => (
                      <li key={index}>• {duplicate}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {uploadResult.errors.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2 text-red-800">Erros encontrados:</h4>
                <div className="max-h-32 overflow-y-auto bg-red-50 p-3 rounded border">
                  <ul className="text-sm text-sm text-red-800 space-y-1">
                    {uploadResult.errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <Link href="/cadastro/familias">
                <Button>
                  Ver Famílias Cadastradas
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => {
                  setUploadResult(null)
                  setIsUploading(false)
                }}
              >
                Fazer Novo Upload
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
