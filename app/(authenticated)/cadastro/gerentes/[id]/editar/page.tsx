'use client';

import { useParams } from 'next/navigation';

export default function EditarGerente() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Editar Gerente</h1>
      <p>ID do gerente: {id}</p>
      <p className="text-gray-500 mt-4">Página em desenvolvimento...</p>
    </div>
  );
}
