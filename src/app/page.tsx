'use client';

import React, { useState, useEffect } from 'react';
import HeaderHero from '@/components/HeaderHero';
import PalpiteMeter from '@/components/PalpiteMeter';
import EventInfo from '@/components/EventInfo';
import RsvpForm from '@/components/RsvpForm';
import { getConvidados } from '@/lib/supabaseClient';
import { PreRegisteredGuest } from '@/lib/types';
import { Lock, Heart } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [convidados, setConvidados] = useState<PreRegisteredGuest[]>([]);

  const loadData = async () => {
    const list = await getConvidados();
    setConvidados(list);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <main style={{ minHeight: '100vh', paddingBottom: '3rem' }}>
      <div className="container">
        {/* Hero do Chá Revelação com Moldura Artística e Contagem */}
        <HeaderHero />

        {/* Termômetro Interativo do Bolão (Jade vs Benício) */}
        <PalpiteMeter convidados={convidados} />

        {/* Informações da Comemoração (Data, Local, Traje, Presentes) */}
        <EventInfo />

        {/* Formulário Nominal de Confirmação de Presença */}
        <RsvpForm convidados={convidados} onSuccess={loadData} />

        {/* Rodapé com acesso aos Pais */}
        <footer 
          style={{ 
            marginTop: '3.5rem', 
            textAlign: 'center', 
            paddingTop: '2rem', 
            borderTop: '1px solid var(--border-soft)',
            color: 'var(--text-muted)',
            fontSize: '0.85rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', marginBottom: '0.75rem' }}>
            <span>Feito com todo carinho para receber a</span>
            <strong style={{ color: 'var(--girl-primary)' }}>Jade</strong>
            <span>ou o</span>
            <strong style={{ color: 'var(--boy-primary)' }}>Benício</strong>
            <Heart size={14} color="var(--girl-primary)" fill="var(--girl-primary)" />
          </div>

          <div>
            <Link 
              href="/admin" 
              style={{ 
                color: 'var(--text-secondary)', 
                textDecoration: 'none', 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.35rem',
                fontSize: '0.8rem',
                padding: '0.4rem 0.8rem',
                borderRadius: '9999px',
                backgroundColor: 'rgba(255,255,255,0.6)',
                border: '1px solid var(--border-soft)'
              }}
            >
              <Lock size={12} /> Área dos Pais (Gerenciar os 58 Convidados)
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
