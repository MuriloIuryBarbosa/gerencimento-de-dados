'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Edit, Trash2, Eye, Warehouse, Plus, MapPin } from 'lucide-react'
import Link from 'next/link'

interface Deposito {
  id: number
  codigo: string
  nome: string
  empresa: {
    nome: string
  }
  endereco: string | null
  cidade: string | null
  estado: string | null
  tipo: string
  capacidade: number | null
  ativo: boolean
  createdAt: string
  _count?: {
    estoques: number
    movimentacoes: number
  }
}

export function DepositosTable() {
  const [depositos, setDepositos] = useState<Deposito[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDepositos()
  }, [])

  const fetchDepositos = async () => {
    try {
      const response = await fetch('/api/depositos')
      if (response.ok) {
        const data = await response.json()
        setDepositos(data)
      }
    } catch (error) {
      console.error('Erro ao buscar depósitos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este depósito?')) return

    try {
      const response = await fetch(`/api/depositos/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setDepositos(depositos.filter(d => d.id !== id))
      }
    } catch (error) {
      console.error('Erro ao excluir depósito:', error)
    }
  }

  if (loading) {
    return <div>Carregando depósitos...</div>
  }

  return (
    <div className="space-y-4">
      {depositos.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Warehouse className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum depósito cadastrado
            </h3>
            <p className="text-gray-500 text-center mb-4">
              Comece criando seu primeiro depósito
            </p>
            <Link href="/executivo/depositos/nova">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Depósito
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {depositos.map((deposito) => (
            <Card key={deposito.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{deposito.nome}</h3>
                      <Badge variant={deposito.ativo ? 'default' : 'secondary'}>
                        {deposito.ativo ? 'Ativo' : 'Inativo'}
                      </Badge>
                      <Badge variant="outline">
                        {deposito.tipo}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Código: {deposito.codigo} | Empresa: {deposito.empresa.nome}
                    </p>
                    {(deposito.endereco || deposito.cidade || deposito.estado) && (
                      <div className="flex items-center gap-1 text-sm text-gray-700 mb-2">
                        <MapPin className="h-4 w-4" />
                        <span>
                          {[deposito.endereco, deposito.cidade, deposito.estado]
                            .filter(Boolean)
                            .join(', ')}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Estoque: {deposito._count?.estoques || 0} itens</span>
                      <span>Movimentações: {deposito._count?.movimentacoes || 0}</span>
                      {deposito.capacidade && (
                        <span>Capacidade: {deposito.capacidade}m³</span>
                      )}
                      <span>Criado em: {new Date(deposito.createdAt).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/executivo/depositos/${deposito.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/executivo/depositos/${deposito.id}/editar`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(deposito.id)}
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
