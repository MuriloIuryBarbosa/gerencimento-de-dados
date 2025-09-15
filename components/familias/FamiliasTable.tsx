'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Edit, Trash2, Eye, Package, Plus } from 'lucide-react'
import Link from 'next/link'

interface Familia {
  id: number
  codigo: string
  nome: string
  descricao: string | null
  ativo: boolean
  createdAt: string
  _count?: {
    skus: number
  }
}

export function FamiliasTable() {
  const [familias, setFamilias] = useState<Familia[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFamilias()
  }, [])

  const fetchFamilias = async () => {
    try {
      const response = await fetch('/api/familias')
      if (response.ok) {
        const data = await response.json()
        setFamilias(data)
      }
    } catch (error) {
      console.error('Erro ao buscar famílias:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta família?')) return

    try {
      const response = await fetch(`/api/familias/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setFamilias(familias.filter(f => f.id !== id))
      }
    } catch (error) {
      console.error('Erro ao excluir família:', error)
    }
  }

  if (loading) {
    return <div>Carregando famílias...</div>
  }

  return (
    <div className="space-y-4">
      {familias.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma família cadastrada
            </h3>
            <p className="text-gray-500 text-center mb-4">
              Comece criando sua primeira família de produtos
            </p>
            <Link href="/cadastro/familias/nova">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeira Família
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {familias.map((familia) => (
            <Card key={familia.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{familia.nome}</h3>
                      <Badge variant={familia.ativo ? 'default' : 'secondary'}>
                        {familia.ativo ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Código: {familia.codigo}
                    </p>
                    {familia.descricao && (
                      <p className="text-sm text-gray-700 mb-2">
                        {familia.descricao}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>SKUs: {familia._count?.skus || 0}</span>
                      <span>Criado em: {new Date(familia.createdAt).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/cadastro/familias/${familia.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/cadastro/familias/${familia.id}/editar`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(familia.id)}
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
