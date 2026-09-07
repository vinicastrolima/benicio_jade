'use client';

import React, { useState } from 'react';
import { PreRegisteredGuest } from '@/lib/types';
import { Printer, ArrowLeft, Filter } from 'lucide-react';

interface PrintViewProps {
  convidados: PreRegisteredGuest[];
  onBack: () => void;
}

export default function PrintView({ convidados, onBack }: PrintViewProps) {
  const [filterMode, setFilterMode] = useState<'apenas_confirmados' | 'todos'>('apenas_confirmados');

  // Ordenados alfabeticamente
  const sortedGuests = [...convidados].sort((a, b) => a.nome.localeCompare(b.nome));

  const displayedGuests = filterMode === 'apenas_confirmados'
    ? sortedGuests.filter(g => g.status === 'confirmado')
    : sortedGuests;

  const totalConfirmados = convidados.filter(g => g.status === 'confirmado');
  const totalPessoasConfirmadas = totalConfirmados.reduce((acc, curr) => acc + (curr.total_confirmados || 1), 0);
  const totalPendentes = convidados.filter(g => g.status === 'pendente').length;
  const totalRecusados = convidados.filter(g => g.status === 'recusado').length;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ padding: '1.5rem', minHeight: '100vh', backgroundColor: '#ffffff' }}>
      {/* Barra de Ações na Tela - Oculta ao Imprimir */}
      <div 
        className="no-print" 
        style={{ 
          maxWidth: '1050px', 
          margin: '0 auto 1.5rem', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          padding: '1rem',
          backgroundColor: '#f8f4ee',
          borderRadius: '12px',
          border: '1px solid #dfd5c6'
        }}
      >
        <button onClick={onBack} className="btn btn-secondary" style={{ fontSize: '0.9rem' }}>
          <ArrowLeft size={16} /> Voltar ao Painel
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', color: '#555', fontWeight: 600 }}>Visualizar:</span>
          <button
            onClick={() => setFilterMode('apenas_confirmados')}
            className={filterMode === 'apenas_confirmados' ? 'btn btn-primary-jade' : 'btn btn-secondary'}
            style={{ fontSize: '0.82rem', padding: '0.45rem 0.85rem' }}
          >
            Apenas Confirmados ({totalConfirmados.length})
          </button>
          <button
            onClick={() => setFilterMode('todos')}
            className={filterMode === 'todos' ? 'btn btn-primary-benicio' : 'btn btn-secondary'}
            style={{ fontSize: '0.82rem', padding: '0.45rem 0.85rem' }}
          >
            Todos os 58 Convidados
          </button>
        </div>

        <button onClick={handlePrint} className="btn btn-primary-jade" style={{ fontSize: '0.9rem' }}>
          <Printer size={16} /> Imprimir Agora (A4)
        </button>
      </div>

      {/* Conteúdo Imprimível */}
      <div className="print-container" style={{ maxWidth: '1050px', margin: '0 auto', color: '#000' }}>
        {/* Cabeçalho da Folha de Impressão */}
        <div style={{ textAlign: 'center', borderBottom: '2px solid #222', paddingBottom: '12px', marginBottom: '16px' }}>
          <h1 style={{ fontSize: '20pt', fontFamily: 'serif', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Chá Revelação: Jade ou Benício?
          </h1>
          <h2 style={{ fontSize: '13pt', fontWeight: 'normal', margin: '4px 0', color: '#333' }}>
            Lista Oficial de Entrada & Portaria ({filterMode === 'apenas_confirmados' ? 'Confirmados' : 'Lista Completa'})
          </h2>
          <div style={{ fontSize: '10pt', color: '#666', marginTop: '4px' }}>
            Data: 10 de Outubro • Horário: 14h00 • Local: Salão Alê diversões • Traje: Branco
          </div>
        </div>

        {/* Resumo de Números no Topo */}
        <div className="print-summary-box" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '8.5pt', textTransform: 'uppercase', color: '#555' }}>Total de Pessoas Confirmadas</div>
            <div style={{ fontSize: '16pt', fontWeight: 'bold' }}>{totalPessoasConfirmadas}</div>
          </div>
          <div>
            <div style={{ fontSize: '8.5pt', textTransform: 'uppercase', color: '#555' }}>Convites Confirmados</div>
            <div style={{ fontSize: '16pt', fontWeight: 'bold' }}>{totalConfirmados.length} / 58</div>
          </div>
          <div>
            <div style={{ fontSize: '8.5pt', textTransform: 'uppercase', color: '#555' }}>Pendentes de Resposta</div>
            <div style={{ fontSize: '16pt', fontWeight: 'bold' }}>{totalPendentes}</div>
          </div>
          <div>
            <div style={{ fontSize: '8.5pt', textTransform: 'uppercase', color: '#555' }}>Ausências Justificadas</div>
            <div style={{ fontSize: '16pt', fontWeight: 'bold' }}>{totalRecusados}</div>
          </div>
        </div>

        {/* Tabela de Convidados com Checkbox de Entrada */}
        <table className="print-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '9pt' }}>
          <thead>
            <tr>
              <th style={{ width: '38px', textAlign: 'center' }}>[ ✓ ]</th>
              <th style={{ textAlign: 'left' }}>Nome do Convidado</th>
              <th style={{ width: '70px', textAlign: 'center' }}>Direito a</th>
              <th style={{ textAlign: 'left' }}>Acompanhante(s) Confirmado(s)</th>
              <th style={{ width: '60px', textAlign: 'center' }}>Pessoas</th>
              <th style={{ width: '85px', textAlign: 'center' }}>Status</th>
              <th style={{ width: '110px', textAlign: 'left' }}>WhatsApp</th>
              <th style={{ width: '80px', textAlign: 'center' }}>Palpite</th>
            </tr>
          </thead>
          <tbody>
            {displayedGuests.map((guest) => {
              const acompanhantesStr = guest.acompanhantes_nomes && guest.acompanhantes_nomes.length > 0
                ? guest.acompanhantes_nomes.join(', ')
                : '-';

              return (
                <tr key={guest.id}>
                  <td style={{ textAlign: 'center' }}>
                    <div className="print-checkbox"></div>
                  </td>
                  <td style={{ fontWeight: 600 }}>{guest.nome}</td>
                  <td style={{ textAlign: 'center', fontSize: '8.5pt' }}>
                    {guest.limite_acompanhantes === 0 ? 'Individual' : `+${guest.limite_acompanhantes}`}
                  </td>
                  <td style={{ fontSize: '8.5pt' }}>{acompanhantesStr}</td>
                  <td style={{ textAlign: 'center', fontWeight: 'bold' }}>
                    {guest.status === 'confirmado' ? guest.total_confirmados || 1 : '-'}
                  </td>
                  <td style={{ textAlign: 'center', textTransform: 'capitalize', fontSize: '8pt', fontWeight: 600 }}>
                    {guest.status === 'confirmado' ? 'Confirmado' : guest.status === 'recusado' ? 'Não vai' : 'Pendente'}
                  </td>
                  <td style={{ fontSize: '8pt' }}>{guest.telefone || '-'}</td>
                  <td style={{ textAlign: 'center', fontSize: '8pt' }}>
                    {guest.palpite === 'jade' ? 'Jade 👗' : guest.palpite === 'benicio' ? 'Benício 👖' : '-'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {displayedGuests.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#666', fontStyle: 'italic' }}>
            Nenhum convidado para exibir nesta seleção.
          </div>
        )}

        {/* Rodapé da Recepção */}
        <div style={{ marginTop: '28px', borderTop: '1px dashed #777', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '8.5pt' }}>
          <div>
            Responsável pelo Check-in / Portaria: ___________________________________
          </div>
          <div>
            Total de presentes conferidos: ________ pessoas
          </div>
        </div>
      </div>
    </div>
  );
}
