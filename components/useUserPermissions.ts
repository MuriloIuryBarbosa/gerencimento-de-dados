"use client";

import { useState, useEffect } from 'react';

interface UserPermissions {
  isAdmin: boolean;
  isSuperAdmin: boolean;
  permissions: string[];
}

export function useUserPermissions() {
  const [permissions, setPermissions] = useState<UserPermissions>({
    isAdmin: false,
    isSuperAdmin: false,
    permissions: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        // Verificar se estamos no cliente
        if (typeof window === 'undefined') {
          setLoading(false);
          return;
        }

        // Buscar permissões do usuário via API
        const response = await fetch('/api/admin/check-access');

        if (response.ok) {
          const data = await response.json();
          setPermissions({
            isAdmin: data.isAdmin || false,
            isSuperAdmin: data.isSuperAdmin || false,
            permissions: data.permissions || []
          });
        } else if (response.status === 401) {
          // Usuário não autenticado
          setPermissions({
            isAdmin: false,
            isSuperAdmin: false,
            permissions: []
          });
        } else {
          console.error('Erro ao verificar permissões');
          setPermissions({
            isAdmin: false,
            isSuperAdmin: false,
            permissions: []
          });
        }
      } catch (error) {
        console.error('Erro ao verificar permissões:', error);
        setPermissions({
          isAdmin: false,
          isSuperAdmin: false,
          permissions: []
        });
      } finally {
        setLoading(false);
      }
    };

    checkPermissions();
  }, []);

  const hasPermission = (permissionName: string) => {
    return permissions.isSuperAdmin ||
           permissions.permissions.includes(permissionName) ||
           permissions.permissions.includes('*') ||
           (permissionName === 'admin.access' && permissions.isAdmin);
  };

  const hasAnyPermission = (permissionNames: string[]) => {
    return permissionNames.some(permission => hasPermission(permission));
  };

  return {
    ...permissions,
    loading,
    hasPermission,
    hasAnyPermission,
    canAccessAdmin: permissions.isAdmin || permissions.isSuperAdmin || permissions.permissions.includes('admin.full_access') || permissions.permissions.includes('*')
  };
}
