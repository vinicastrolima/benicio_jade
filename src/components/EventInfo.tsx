'use client';

import React, { useState } from 'react';
import { Calendar, MapPin, Gift, Shirt, Phone, Copy, Check, ExternalLink } from 'lucide-react';

export default function EventInfo() {
  const [copiedLocation, setCopiedLocation] = useState(false);

  const eventLocation = "Salão Me Diversões";
  
  // Link para Google Agenda
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent("Chá Revelação: Jade ou Benício?")}&dates=20261010T170000Z/20261010T220000Z&details=${encodeURIComponent("Celebração do Chá Revelação de Jade ou Benício! Traje sugerido: Branco. Fraldas M/G/GG Huggies, Pampers ou Babysec.")}&location=${encodeURIComponent(eventLocation)}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(eventLocation);
    setCopiedLocation(true);
    setTimeout(() => setCopiedLocation(false), 2500);
  };

  return (
    <section style={{ margin: '2.5rem 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
        <h3 
          className="font-serif" 
          style={{ 
            fontSize: 'clamp(1.8rem, 4.5vw, 2.4rem)', 
            fontWeight: 700, 
            color: 'var(--text-primary)',
            marginBottom: '0.3rem' 
          }}
        >
          Informações da Comemoração
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Tudo o que você precisa saber para celebrar esse dia inesquecível
        </p>
      </div>

      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', 
          gap: '1.25rem' 
        }}
      >
        {/* Card 1: Data e Hora */}
        <div 
          className="glass-card" 
          style={{ 
            padding: '1.5rem', 
            borderRadius: '20px', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            textAlign: 'center' 
          }}
        >
          <div 
            style={{ 
              width: '52px', 
              height: '52px', 
              borderRadius: '50%', 
              backgroundColor: 'var(--gold-light)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'var(--gold-accent)',
              marginBottom: '1rem' 
            }}
          >
            <Calendar size={26} />
          </div>
          <h4 className="font-serif" style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.35rem' }}>
            Data & Horário
          </h4>
          <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
            10 de Outubro
          </p>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '1.2rem' }}>
            Às 14h00 em ponto
          </p>

          <a 
            href={googleCalendarUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn btn-secondary"
            style={{ fontSize: '0.85rem', padding: '0.55rem 1.1rem', width: '100%', marginTop: 'auto' }}
          >
            <Calendar size={15} /> Adicionar à Agenda
          </a>
        </div>

        {/* Card 2: Localização */}
        <div 
          className="glass-card" 
          style={{ 
            padding: '1.5rem', 
            borderRadius: '20px', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            textAlign: 'center' 
          }}
        >
          <div 
            style={{ 
              width: '52px', 
              height: '52px', 
              borderRadius: '50%', 
              backgroundColor: 'var(--boy-soft)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'var(--boy-primary)',
              marginBottom: '1rem' 
            }}
          >
            <MapPin size={26} />
          </div>
          <h4 className="font-serif" style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.35rem' }}>
            Localização
          </h4>
          <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
            {eventLocation}
          </p>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.2rem' }}>
            Espaço preparado para receber todos com carinho
          </p>

          <div style={{ display: 'flex', gap: '0.5rem', width: '100%', marginTop: 'auto' }}>
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(eventLocation)}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-secondary"
              style={{ fontSize: '0.82rem', padding: '0.55rem 0.8rem', flex: 1 }}
            >
              <ExternalLink size={14} /> Como Chegar
            </a>
            <button 
              onClick={copyToClipboard} 
              className="btn btn-secondary"
              style={{ fontSize: '0.82rem', padding: '0.55rem 0.8rem' }}
              title="Copiar Nome do Local"
            >
              {copiedLocation ? <Check size={14} color="green" /> : <Copy size={14} />}
            </button>
          </div>
        </div>

        {/* Card 3: Traje Sugerido */}
        <div 
          className="glass-card" 
          style={{ 
            padding: '1.5rem', 
            borderRadius: '20px', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            textAlign: 'center' 
          }}
        >
          <div 
            style={{ 
              width: '52px', 
              height: '52px', 
              borderRadius: '50%', 
              backgroundColor: '#f6f6f6', 
              border: '1px solid #e0e0e0',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: '#555',
              marginBottom: '1rem' 
            }}
          >
            <Shirt size={26} />
          </div>
          <h4 className="font-serif" style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.35rem' }}>
            Traje dos Convidados
          </h4>
          <span 
            className="badge" 
            style={{ 
              backgroundColor: '#ffffff', 
              color: '#333333', 
              border: '1px solid #dcdcdc', 
              fontSize: '1rem',
              padding: '0.4rem 1rem',
              marginBottom: '0.6rem',
              fontWeight: 700
            }}
          >
            ⚪ Branco
          </span>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: 'auto' }}>
            Para deixar as fotos e a harmonia da revelação ainda mais luminosas e especiais!
          </p>
        </div>

        {/* Card 4: Sugestão de Presente */}
        <div 
          className="glass-card" 
          style={{ 
            padding: '1.5rem', 
            borderRadius: '20px', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            textAlign: 'center' 
          }}
        >
          <div 
            style={{ 
              width: '52px', 
              height: '52px', 
              borderRadius: '50%', 
              backgroundColor: 'var(--girl-soft)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'var(--girl-primary)',
              marginBottom: '1rem' 
            }}
          >
            <Gift size={26} />
          </div>
          <h4 className="font-serif" style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.35rem' }}>
            Sugestão de Presente
          </h4>
          <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.6rem' }}>
            <span className="badge badge-jade">Tam. M</span>
            <span className="badge badge-benicio">Tam. G</span>
            <span className="badge badge-gold">Tam. GG</span>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', fontWeight: 600, marginBottom: '0.2rem' }}>
            Huggies • Pampers • Babysec
          </p>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: 'auto' }}>
            + um mimo carinhoso para o bebê
          </p>
        </div>
      </div>

      {/* Contato Rápido no WhatsApp com Mamãe e Papai */}
      <div 
        className="glass-card-subtle" 
        style={{ 
          marginTop: '1.75rem', 
          padding: '1.25rem 1.5rem', 
          borderRadius: '18px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div 
            style={{ 
              width: '42px', 
              height: '42px', 
              borderRadius: '50%', 
              backgroundColor: '#25d366', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: '#ffffff'
            }}
          >
            <Phone size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.98rem' }}>Alguma dúvida sobre o evento?</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Fale diretamente com os futuros papais pelo WhatsApp</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <a 
            href="https://wa.me/55998378606?text=Oi%20Mam%C3%A3e!%20Tudo%20bem?%20Tenho%20uma%20d%C3%BAvida%20sobre%20o%20Ch%C3%A1%20Revela%C3%A7%C3%A3o" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn btn-whatsapp"
            style={{ fontSize: '0.85rem', padding: '0.6rem 1.1rem' }}
          >
            Mamãe (99837-8606)
          </a>
          <a 
            href="https://wa.me/55996677227?text=Oi%20Papai!%20Tudo%20bem?%20Tenho%20uma%20d%C3%BAvida%20sobre%20o%20Ch%C3%A1%20Revela%C3%A7%C3%A3o" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn btn-whatsapp"
            style={{ fontSize: '0.85rem', padding: '0.6rem 1.1rem' }}
          >
            Papai (99667-7227)
          </a>
        </div>
      </div>
    </section>
  );
}
