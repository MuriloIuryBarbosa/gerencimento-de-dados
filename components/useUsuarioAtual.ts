"use client";

import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface UsuarioAtual {
  id: number;
  nome: string;
  email: string;
  cargo?: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

export function useUsuarioAtual() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [usuario, setUsuario] = useState<UsuarioAtual | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && user) {
        // Usar dados do contexto de autenticação
        const usuarioAtual: UsuarioAtual = {
          id: user.id,
          nome: user.nome,
          email: user.email,
          cargo: user.cargo,
          isAdmin: user.isAdmin,
          isSuperAdmin: user.isSuperAdmin
        };
        setUsuario(usuarioAtual);
      } else {
        setUsuario(null);
      }
      setLoading(false);
    }
  }, [user, isAuthenticated, isLoading]);

  const getPapelUsuario = (): string => {
    if (!usuario) return 'Usuário';

    if (usuario.isSuperAdmin) return 'Super Administrador';
    if (usuario.isAdmin) return 'Administrador';
    return 'Usuário';
  };

  const getCargoUsuario = (): string => {
    return usuario?.cargo || 'Sem cargo definido';
  };

  return {
    usuario,
    loading,
    papel: getPapelUsuario(),
    cargo: getCargoUsuario()
  };
}
