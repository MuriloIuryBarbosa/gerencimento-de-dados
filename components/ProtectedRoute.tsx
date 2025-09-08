"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireSuperAdmin?: boolean;
}

export default function ProtectedRoute({
  children,
  requireAdmin = false,
  requireSuperAdmin = false
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // Usuário não autenticado, redirecionar para login
        router.push('/login');
        return;
      }

      // Verificar permissões se necessário
      if (requireSuperAdmin && !user?.isSuperAdmin) {
        router.push('/unauthorized');
        return;
      }

      if (requireAdmin && !user?.isAdmin && !user?.isSuperAdmin) {
        router.push('/unauthorized');
        return;
      }
    }
  }, [isAuthenticated, isLoading, user, requireAdmin, requireSuperAdmin, router]);

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Se não estiver autenticado, não renderizar nada (vai redirecionar)
  if (!isAuthenticated) {
    return null;
  }

  // Verificar permissões
  if (requireSuperAdmin && !user?.isSuperAdmin) {
    return null;
  }

  if (requireAdmin && !user?.isAdmin && !user?.isSuperAdmin) {
    return null;
  }

  return <>{children}</>;
}