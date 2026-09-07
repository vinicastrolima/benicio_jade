'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Calendar, Clock, Heart, Sparkles } from 'lucide-react';

export default function HeaderHero() {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Data do evento: 10 de Outubro de 2026 às 13:30
    const targetDate = new Date('2026-10-10T13:30:00-03:00').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToRsvp = () => {
    const el = document.getElementById('rsvp-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="hero-section" style={{ textAlign: 'center', padding: '2rem 1rem 1.5rem' }}>
      {/* Título Principal estilo Caligrafia & Serif clássico */}
      <h2 
        className="font-serif" 
        style={{ 
          fontSize: 'clamp(2.4rem, 6vw, 4.2rem)', 
          fontWeight: 600, 
          letterSpacing: '0.06em', 
          color: 'var(--text-primary)',
          lineHeight: 1.1,
          textTransform: 'uppercase',
          marginBottom: '0.5rem'
        }}
      >
        Chá Revelação
      </h2>

      {/* Destaque Jade ou Benício */}
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '0.6rem',
          flexWrap: 'wrap',
          marginBottom: '1.5rem'
        }}
      >
        <span 
          className="font-serif" 
          style={{ 
            fontSize: 'clamp(2rem, 5.5vw, 3.4rem)', 
            color: 'var(--girl-primary)', 
            fontWeight: 700,
            textShadow: '0 2px 10px rgba(203, 107, 92, 0.15)'
          }}
        >
          Jade
        </span>
        <span 
          className="font-script" 
          style={{ 
            fontSize: 'clamp(2.2rem, 5vw, 3rem)', 
            color: 'var(--gold-accent)',
            margin: '0 0.2rem'
          }}
        >
          ou
        </span>
        <span 
          className="font-serif" 
          style={{ 
            fontSize: 'clamp(2rem, 5.5vw, 3.4rem)', 
            color: 'var(--boy-primary)', 
            fontWeight: 700,
            textShadow: '0 2px 10px rgba(61, 106, 137, 0.15)'
          }}
        >
          Benício?
        </span>
      </div>

      {/* Cartão de Imagem da Ilustração com Moldura Artística */}
      <div 
        className="glass-card" 
        style={{ 
          maxWidth: '520px', 
          margin: '0 auto 2rem', 
          padding: '0.85rem',
          borderRadius: '24px',
          position: 'relative',
          overflow: 'hidden',
          border: '1.5px solid rgba(215, 198, 180, 0.65)'
        }}
      >
        <div 
          style={{ 
            position: 'relative', 
            width: '100%', 
            aspectRatio: '1 / 1', 
            borderRadius: '18px', 
            overflow: 'hidden',
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.05)'
          }}
        >
          <Image
            src="/convite.jpg"
            alt="Convite Chá Revelação Jade ou Benício"
            fill
            sizes="(max-width: 600px) 100vw, 520px"
            priority
            style={{ objectFit: 'cover' }}
          />
        </div>

        {/* Efeito sutil de etiqueta flutuante */}
        <div 
          style={{
            marginTop: '0.85rem',
            padding: '0.4rem 0.8rem',
            fontSize: '0.88rem',
            color: 'var(--text-secondary)',
            fontStyle: 'italic',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem'
          }}
        >
          <Heart size={14} color="var(--girl-primary)" fill="var(--girl-primary)" />
          <span>Mamãe e Papai estão muito felizes e ansiosos para descobrirem!</span>
          <Heart size={14} color="var(--boy-primary)" fill="var(--boy-primary)" />
        </div>
      </div>

      {/* Contagem Regressiva */}
      <div 
        className="glass-card-subtle"
        style={{ 
          maxWidth: '480px', 
          margin: '0 auto 1.75rem', 
          padding: '1.25rem 1rem',
          borderRadius: '16px'
        }}
      >
        <p style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.8rem', fontWeight: 600 }}>
          ⏳ Faltam para a grande revelação:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.6rem' }}>
          {[
            { label: 'Dias', value: timeLeft.days },
            { label: 'Horas', value: timeLeft.hours },
            { label: 'Minutos', value: timeLeft.minutes },
            { label: 'Segundos', value: timeLeft.seconds },
          ].map((item, index) => (
            <div 
              key={index}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid var(--border-soft)',
                borderRadius: '12px',
                padding: '0.6rem 0.2rem',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div 
                className="font-serif" 
                style={{ 
                  fontSize: 'clamp(1.5rem, 4vw, 2rem)', 
                  fontWeight: 700, 
                  color: index % 2 === 0 ? 'var(--girl-primary)' : 'var(--boy-primary)',
                  lineHeight: 1
                }}
              >
                {String(item.value).padStart(2, '0')}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '0.3rem', fontWeight: 600 }}>
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Botão de Chamada para Ação */}
      <div>
        <button 
          onClick={scrollToRsvp} 
          className="btn btn-primary-jade"
          style={{ 
            fontSize: '1.05rem', 
            padding: '1rem 2.2rem',
            background: 'linear-gradient(135deg, var(--girl-primary) 0%, #b55648 40%, var(--boy-primary) 100%)',
            boxShadow: '0 8px 24px rgba(90, 70, 60, 0.18)'
          }}
        >
          <Sparkles size={18} />
          Confirmar Presença no Chá
        </button>
      </div>
    </header>
  );
}
