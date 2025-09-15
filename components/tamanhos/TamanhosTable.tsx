'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Edit, Trash2, Eye, Ruler, Plus } from 'lucide-react'
import Link from 'next/link'

interface Tamanho {
  id: number
  nome: string
  legado: string | null
  ativo: boolean
  createdAt: string
  updatedAt: string
  _count?: {
    skus: number
  }
}

export function TamanhosTable() {
  const [tamanhos, setTamanhos] = useState<Tamanho[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTamanhos()
  }, [])

  const fetchTamanhos = async () => {
    try {
      const response = await fetch('/api/tamanhos')
      if (response.ok) {
        const data = await response.json()
        setTamanhos(data)
      }
    } catch (error) {
      console.error('Erro ao buscar tamanhos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este tamanho?')) return

    try {
      const response = await fetch(`/api/tamanhos/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setTamanhos(tamanhos.filter(t => t.id !== id))
      }
    } catch (error) {
      console.error('Erro ao excluir tamanho:', error)
    }
  }

  if (loading) {
    return <div>Carregando tamanhos...</div>
  }

  return (
    <div className="space-y-4">
      {tamanhos.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Ruler className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum tamanho cadastrado
            </h3>
            <p className="text-gray-500 text-center mb-4">
              Comece criando seu primeiro tamanho
            </p>
            <Link href="/executivo/tamanhos/nova">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Tamanho
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {tamanhos.map((tamanho) => (
            <Card key={tamanho.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{tamanho.nome}</h3>
                      <Badge variant={tamanho.ativo ? 'default' : 'secondary'}>
                        {tamanho.ativo ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                    {tamanho.legado && (
                      <p className="text-sm text-gray-600 mb-2">
                        Código Legado: {tamanho.legado}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>SKUs: {tamanho._count?.skus || 0}</span>
                      <span>Criado em: {new Date(tamanho.createdAt).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/executivo/tamanhos/${tamanho.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/executivo/tamanhos/${tamanho.id}/editar`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(tamanho.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
