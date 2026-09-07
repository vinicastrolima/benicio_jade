'use client';

import React, { useState, useEffect } from 'react';
import AdminDashboard from '@/components/AdminDashboard';
import AdminLoginModal from '@/components/AdminLoginModal';
import { getConvidados } from '@/lib/supabaseClient';
import { PreRegisteredGuest } from '@/lib/types';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [data, setData] = useState<PreRegisteredGuest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const isAuth = sessionStorage.getItem('admin_authenticated') === 'true';
    if (isAuth) {
      setIsAuthenticated(true);
      loadData();
    } else {
      setLoading(false);
    }
  }, []);

  const loadData = async () => {
    setLoading(true);
    const result = await getConvidados();
    setData(result);
    setLoading(false);
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    loadData();
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_authenticated');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <AdminLoginModal onSuccess={handleLoginSuccess} />;
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="font-serif" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Carregando dados...</div>
          <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Buscando lista de convidados</div>
        </div>
      </div>
    );
  }

  return (
    <AdminDashboard 
      initialData={data} 
      onLogout={handleLogout} 
    />
  );
}
