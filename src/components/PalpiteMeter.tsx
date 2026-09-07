'use client';

import React from 'react';
import { PreRegisteredGuest } from '@/lib/types';
import { Trophy } from 'lucide-react';

interface PalpiteMeterProps {
  convidados: PreRegisteredGuest[];
}

export default function PalpiteMeter({ convidados }: PalpiteMeterProps) {
  // Contabilizar votos dos convidados que responderam
  const jadeVotes = convidados.filter(c => c.palpite === 'jade').length;
  const benicioVotes = convidados.filter(c => c.palpite === 'benicio').length;
  const totalVotes = jadeVotes + benicioVotes;

  const jadePercent = totalVotes > 0 ? Math.round((jadeVotes / totalVotes) * 100) : 50;
  const benicioPercent = totalVotes > 0 ? 100 - jadePercent : 50;

  return (
    <section style={{ margin: '2rem 0' }}>
      <div 
        className="glass-card" 
        style={{ 
          padding: '1.75rem 1.5rem', 
          borderRadius: '24px',
          textAlign: 'center',
          position: 'relative'
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.6rem' }}>
          <span className="badge badge-gold">
            <Trophy size={14} /> Bolão dos Convidados
          </span>
        </div>

        <h3 
          className="font-serif" 
          style={{ 
            fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', 
            fontWeight: 700, 
            marginBottom: '0.3rem',
            color: 'var(--text-primary)'
          }}
        >
          Qual é o seu palpite?
        </h3>
        <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Veja como está a torcida dos amigos e familiares para a revelação:
        </p>

        {/* Placar dos Dois Lados */}
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '1rem', 
            marginBottom: '1.2rem' 
          }}
        >
          {/* Lado Jade */}
          <div 
            style={{ 
              backgroundColor: 'var(--girl-soft)', 
              border: '1.5px solid var(--girl-border)', 
              borderRadius: '16px', 
              padding: '1rem 0.75rem',
              transition: 'transform var(--transition-fast)'
            }}
          >
            <div style={{ fontSize: '1.8rem', marginBottom: '0.2rem' }}>👗</div>
            <div className="font-serif" style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--girl-primary)' }}>
              Time Jade
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--girl-primary)', marginTop: '0.2rem' }}>
              {jadePercent}%
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {jadeVotes} {jadeVotes === 1 ? 'voto' : 'votos'}
            </div>
          </div>

          {/* Lado Benício */}
          <div 
            style={{ 
              backgroundColor: 'var(--boy-soft)', 
              border: '1.5px solid var(--boy-border)', 
              borderRadius: '16px', 
              padding: '1rem 0.75rem',
              transition: 'transform var(--transition-fast)'
            }}
          >
            <div style={{ fontSize: '1.8rem', marginBottom: '0.2rem' }}>👖</div>
            <div className="font-serif" style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--boy-primary)' }}>
              Time Benício
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--boy-primary)', marginTop: '0.2rem' }}>
              {benicioPercent}%
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {benicioVotes} {benicioVotes === 1 ? 'voto' : 'votos'}
            </div>
          </div>
        </div>

        {/* Barra de Progresso Bicolor */}
        <div 
          style={{ 
            height: '14px', 
            width: '100%', 
            backgroundColor: '#e8e0d5', 
            borderRadius: '9999px', 
            overflow: 'hidden',
            display: 'flex',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.08)'
          }}
        >
          <div 
            style={{ 
              width: `${jadePercent}%`, 
              backgroundColor: 'var(--girl-primary)', 
              transition: 'width 0.8s ease-in-out',
              borderRadius: '9999px 0 0 9999px'
            }} 
          />
          <div 
            style={{ 
              width: `${benicioPercent}%`, 
              backgroundColor: 'var(--boy-primary)', 
              transition: 'width 0.8s ease-in-out',
              borderRadius: '0 9999px 9999px 0'
            }} 
          />
        </div>

        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.85rem', fontStyle: 'italic' }}>
          Localize seu nome abaixo para confirmar sua presença e votar no bolão!
        </p>
      </div>
    </section>
  );
}
