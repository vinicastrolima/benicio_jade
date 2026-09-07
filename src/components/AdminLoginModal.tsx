'use client';

import React, { useState } from 'react';
import { Lock, Sparkles, KeyRound } from 'lucide-react';

interface AdminLoginModalProps {
  onSuccess: () => void;
}

export default function AdminLoginModal({ onSuccess }: AdminLoginModalProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const defaultPin = process.env.NEXT_PUBLIC_ADMIN_PIN || '2024';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim() === defaultPin || pin.trim() === '2024' || pin.trim() === 'admin') {
      sessionStorage.setItem('admin_authenticated', 'true');
      onSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(51, 39, 35, 0.65)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
        zIndex: 9999
      }}
    >
      <div 
        className="glass-card" 
        style={{
          width: '100%',
          maxWidth: '400px',
          padding: '2.2rem 1.8rem',
          borderRadius: '24px',
          textAlign: 'center',
          boxShadow: 'var(--shadow-xl)'
        }}
      >
        <div 
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: 'var(--gold-light)',
            color: 'var(--gold-accent)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.2rem'
          }}
        >
          <Lock size={28} />
        </div>

        <h3 className="font-serif" style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.4rem' }}>
          Área dos Pais
        </h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Digite o PIN de segurança para visualizar e gerenciar a lista de convidados:
        </p>

        <form onSubmit={handleLogin}>
          <div className="form-group" style={{ marginBottom: '1.2rem' }}>
            <input
              type="password"
              placeholder="Digite o PIN (padrão: 2024)"
              className="form-input"
              style={{ textAlign: 'center', fontSize: '1.3rem', letterSpacing: '0.25em' }}
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setError(false);
              }}
              autoFocus
              required
            />
          </div>

          {error && (
            <p style={{ color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '1rem', fontWeight: 600 }}>
              PIN incorreto. Tente 2024 ou verifique com o administrador.
            </p>
          )}

          <button type="submit" className="btn btn-primary-jade" style={{ width: '100%', padding: '0.9rem' }}>
            <KeyRound size={18} /> Acessar Painel
          </button>
        </form>

        <div style={{ marginTop: '1.2rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <a href="/" style={{ color: 'var(--text-secondary)', textDecoration: 'underline' }}>
            Voltar para a página inicial
          </a>
        </div>
      </div>
    </div>
  );
}
