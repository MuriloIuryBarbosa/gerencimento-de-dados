"use client";

import { useState, useEffect } from 'react';

export function useUserPermissions() {
  const [permissions, setPermissions] = useState<{
    isAdmin: boolean;
    isSuperAdmin: boolean;
    permissions: string[];
  }>({
    isAdmin: false,
    isSuperAdmin: false,
    permissions: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        if (typeof window === 'undefined') {
          setLoading(false);
          return;
        }

        const response = await fetch('/api/admin/check-access');

        if (response.ok) {
          const data = await response.json();
          setPermissions({
            isAdmin: data.isAdmin || false,
            isSuperAdmin: data.isSuperAdmin || false,
            permissions: data.permissions || []
          });
        } else {
          setPermissions({
            isAdmin: false,
            isSuperAdmin: false,
            permissions: []
          });
        }
      } catch (error) {
        console.error('Erro ao buscar permissoes:', error);
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

  const canAccessMenu = (menuName: string): boolean => {
    if (permissions.isSuperAdmin) return true;
    return permissions.permissions.includes(`read:menu:${menuName}`);
  };

  const canAccessSubmenu = (submenuPath: string): boolean => {
    if (permissions.isSuperAdmin) return true;
    return permissions.permissions.includes(`read:submenu:${submenuPath}`);
  };

  const canAccessAdmin = permissions.isAdmin || permissions.isSuperAdmin || permissions.permissions.includes('admin.full_access') || permissions.permissions.includes('*');

  return {
    ...permissions,
    loading,
    canAccessMenu,
    canAccessSubmenu,
    canAccessAdmin
  };
}
