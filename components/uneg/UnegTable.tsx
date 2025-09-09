'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Edit, Trash2, Eye, Building2, Plus } from 'lucide-react'
import Link from 'next/link'

interface Uneg {
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

export function UnegTable() {
  const [unegs, setUneg] = useState<Uneg[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUneg()
  }, [])

  const fetchUneg = async () => {
    try {
      const response = await fetch('/api/uneg')
      if (response.ok) {
        const data = await response.json()
        setUneg(data)
      }
    } catch (error) {
      console.error('Erro ao buscar UNEGs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta UNEG?')) return

    try {
      const response = await fetch(`/api/uneg/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setUneg(unegs.filter(u => u.id !== id))
      }
    } catch (error) {
      console.error('Erro ao excluir UNEG:', error)
    }
  }

  if (loading) {
    return <div>Carregando UNEGs...</div>
  }

  return (
    <div className="space-y-4">
      {unegs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma UNEG cadastrada
            </h3>
            <p className="text-gray-500 text-center mb-4">
              Comece criando sua primeira unidade de negócio
            </p>
            <Link href="/executivo/uneg/nova">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeira UNEG
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {unegs.map((uneg) => (
            <Card key={uneg.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{uneg.nome}</h3>
                      <Badge variant={uneg.ativo ? 'default' : 'secondary'}>
                        {uneg.ativo ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Código: {uneg.codigo}
                    </p>
                    {uneg.descricao && (
                      <p className="text-sm text-gray-700 mb-2">
                        {uneg.descricao}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>SKUs: {uneg._count?.skus || 0}</span>
                      <span>Criado em: {new Date(uneg.createdAt).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/executivo/uneg/${uneg.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/executivo/uneg/${uneg.id}/editar`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(uneg.id)}
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
