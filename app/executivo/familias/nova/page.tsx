import { Suspense } from 'react'
import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Package } from 'lucide-react'
import { FamiliaForm } from '@/components/familias/FamiliaForm'

export const metadata: Metadata = {
  title: 'Nova Família | Sistema de Gestão',
  description: 'Criar uma nova família de produtos',
}

export default function NovaFamiliaPage() {
  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white mb-6">
        <div className="flex items-center gap-2">
          <Package className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold">Nova Família</h1>
            <p className="text-blue-100 mt-2">
              Crie uma nova família de produtos para organizar seu catálogo
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Informações da Família</CardTitle>
          <CardDescription>
            Preencha os dados da nova família de produtos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Carregando formulário...</div>}>
            <FamiliaForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
