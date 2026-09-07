'use client';

import React, { useState, useMemo } from 'react';
import { PreRegisteredGuest } from '@/lib/types';
import { 
  getConvidados, 
  deleteConvidado, 
  resetConfirmacao,
  addConvidadoManual,
  isSupabaseConfigured 
} from '@/lib/supabaseClient';
import PrintView from './PrintView';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Clock,
  Printer, 
  Download, 
  Plus, 
  Search, 
  Trash2, 
  RotateCcw,
  MessageSquare, 
  Phone, 
  LogOut,
  Database,
  Trophy,
  ExternalLink,
  Send,
  X
} from 'lucide-react';

interface AdminDashboardProps {
  initialData: PreRegisteredGuest[];
  onLogout: () => void;
}

export default function AdminDashboard({ initialData, onLogout }: AdminDashboardProps) {
  const [data, setData] = useState<PreRegisteredGuest[]>(initialData);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'todos' | 'confirmados' | 'pendentes' | 'recusados' | 'jade' | 'benicio'>('todos');
  const [isPrintMode, setIsPrintMode] = useState(false);

  // Modal de mensagem
  const [selectedMessage, setSelectedMessage] = useState<{ nome: string; mensagem: string } | null>(null);

  // Modal de novo convidado
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newNome, setNewNome] = useState('');
  const [newLimite, setNewLimite] = useState(1);

  const refreshData = async () => {
    const updated = await getConvidados();
    setData(updated);
  };

  // Métricas
  const totalConfirmados = data.filter(c => c.status === 'confirmado');
  const totalPendentes = data.filter(c => c.status === 'pendente');
  const totalRecusados = data.filter(c => c.status === 'recusado');

  const totalPessoasConfirmadas = totalConfirmados.reduce((acc, curr) => acc + (curr.total_confirmados || 1), 0);

  const votosJade = data.filter(c => c.palpite === 'jade').length;
  const votosBenicio = data.filter(c => c.palpite === 'benicio').length;
  const totalVotos = votosJade + votosBenicio;
  const percentJade = totalVotos > 0 ? Math.round((votosJade / totalVotos) * 100) : 50;
  const percentBenicio = totalVotos > 0 ? 100 - percentJade : 50;

  // Filtragem
  const filteredGuests = useMemo(() => {
    return data.filter(guest => {
      const acompanhantesText = (guest.acompanhantes_nomes || []).join(' ');
      const matchSearch = 
        guest.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (guest.telefone && guest.telefone.includes(searchTerm)) ||
        acompanhantesText.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchSearch) return false;

      if (filterType === 'confirmados') return guest.status === 'confirmado';
      if (filterType === 'pendentes') return guest.status === 'pendente';
      if (filterType === 'recusados') return guest.status === 'recusado';
      if (filterType === 'jade') return guest.palpite === 'jade';
      if (filterType === 'benicio') return guest.palpite === 'benicio';

      return true;
    });
  }, [data, searchTerm, filterType]);

  // Excluir Convidado
  const handleDelete = async (id: string, nome: string) => {
    if (confirm(`Tem certeza que deseja excluir "${nome}" da lista?`)) {
      await deleteConvidado(id);
      await refreshData();
    }
  };

  // Resetar Confirmação
  const handleReset = async (id: string, nome: string) => {
    if (confirm(`Deseja reiniciar a confirmação de "${nome}" para o status Pendente?`)) {
      await resetConfirmacao(id);
      await refreshData();
    }
  };

  // Adicionar Convidado Manual
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNome.trim()) return;

    await addConvidadoManual(newNome, newLimite);
    setIsAddModalOpen(false);
    setNewNome('');
    setNewLimite(1);
    await refreshData();
  };

  // Exportar para CSV com compatibilidade Excel
  const exportCsv = () => {
    const headers = [
      'Nome do Convidado',
      'Limite de Acompanhantes',
      'Status',
      'Total de Pessoas Confirmadas',
      'Acompanhantes Confirmados',
      'Telefone',
      'Palpite',
      'Mensagem',
      'Data da Confirmação'
    ];

    const rows = data.map(c => [
      `"${c.nome.replace(/"/g, '""')}"`,
      c.limite_acompanhantes,
      c.status === 'confirmado' ? 'Confirmado' : c.status === 'recusado' ? 'Não vai' : 'Pendente',
      c.status === 'confirmado' ? (c.total_confirmados || 1) : 0,
      `"${(c.acompanhantes_nomes || []).join(', ').replace(/"/g, '""')}"`,
      `"${c.telefone || ''}"`,
      c.palpite === 'jade' ? 'Jade (Menina)' : c.palpite === 'benicio' ? 'Benício (Menino)' : '-',
      `"${(c.mensagem || '').replace(/"/g, '""')}"`,
      c.confirmado_em ? new Date(c.confirmado_em).toLocaleString('pt-BR') : '-'
    ]);

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `convidados_cha_revelacao_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isPrintMode) {
    return <PrintView convidados={data} onBack={() => setIsPrintMode(false)} />;
  }

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem' }}>
      <div className="container-wide">
        {/* Barra Superior do Admin */}
        <div 
          className="glass-card" 
          style={{ 
            padding: '1.25rem 1.5rem', 
            borderRadius: '20px', 
            marginBottom: '1.75rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              <h1 className="font-serif" style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0 }}>
                Painel Administrativo dos Pais
              </h1>
              {isSupabaseConfigured ? (
                <span className="badge badge-green">
                  <Database size={12} /> Supabase Conectado
                </span>
              ) : (
                <span className="badge badge-gold">
                  <Database size={12} /> Modo Local (58 Convidados)
                </span>
              )}
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              Chá Revelação: Jade ou Benício • 10 de Outubro às 14h • Salão Alê diversões
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            <a href="/" className="btn btn-secondary" style={{ fontSize: '0.85rem', padding: '0.6rem 1rem' }}>
              <ExternalLink size={15} /> Ver Site do Convidado
            </a>
            <button onClick={onLogout} className="btn btn-secondary" style={{ fontSize: '0.85rem', padding: '0.6rem 1rem' }}>
              <LogOut size={15} /> Sair
            </button>
          </div>
        </div>

        {/* Cards de Métricas */}
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
            gap: '1.25rem', 
            marginBottom: '1.75rem' 
          }}
        >
          {/* Confirmados */}
          <div className="glass-card" style={{ padding: '1.4rem', borderRadius: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                  Pessoas Confirmadas
                </div>
                <div className="font-serif" style={{ fontSize: '2.4rem', fontWeight: 700, color: 'var(--leaf-green)', lineHeight: 1.1, marginTop: '0.3rem' }}>
                  {totalPessoasConfirmadas}
                </div>
              </div>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: 'var(--leaf-light)', color: 'var(--leaf-green)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={22} />
              </div>
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.75rem' }}>
              De <strong>{totalConfirmados.length}</strong> convites respondidos com Sim
            </div>
          </div>

          {/* Pendentes */}
          <div className="glass-card" style={{ padding: '1.4rem', borderRadius: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                  Aguardando Resposta
                </div>
                <div className="font-serif" style={{ fontSize: '2.4rem', fontWeight: 700, color: 'var(--gold-accent)', lineHeight: 1.1, marginTop: '0.3rem' }}>
                  {totalPendentes.length}
                </div>
              </div>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: 'var(--gold-light)', color: 'var(--gold-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={22} />
              </div>
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.75rem' }}>
              Convidados que ainda não confirmaram
            </div>
          </div>

          {/* Recusados */}
          <div className="glass-card" style={{ padding: '1.4rem', borderRadius: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                  Não Poderão Comparecer
                </div>
                <div className="font-serif" style={{ fontSize: '2.4rem', fontWeight: 700, color: 'var(--danger)', lineHeight: 1.1, marginTop: '0.3rem' }}>
                  {totalRecusados.length}
                </div>
              </div>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#fde8e8', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <UserX size={22} />
              </div>
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.75rem' }}>
              Ausências justificadas
            </div>
          </div>

          {/* Placar do Bolão */}
          <div className="glass-card" style={{ padding: '1.4rem', borderRadius: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                  Placar do Bolão
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.3rem' }}>
                  <span style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--girl-primary)' }}>
                    👗 {percentJade}%
                  </span>
                  <span style={{ color: 'var(--text-muted)' }}>x</span>
                  <span style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--boy-primary)' }}>
                    👖 {percentBenicio}%
                  </span>
                </div>
              </div>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#f5eff8', color: '#8e44ad', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Trophy size={22} />
              </div>
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.75rem' }}>
              {votosJade} votos Jade • {votosBenicio} votos Benício
            </div>
          </div>
        </div>

        {/* Barra de Ferramentas: Busca, Filtros, Impressão e Exportação */}
        <div 
          className="glass-card" 
          style={{ 
            padding: '1.25rem', 
            borderRadius: '20px', 
            marginBottom: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}
        >
          <div 
            style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              gap: '0.75rem' 
            }}
          >
            {/* Campo de Busca */}
            <div style={{ position: 'relative', minWidth: '280px', flex: 1 }}>
              <Search size={17} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
              <input
                type="text"
                placeholder="Buscar por convidado, acompanhante ou telefone..."
                className="form-input"
                style={{ paddingLeft: '2.3rem', fontSize: '0.9rem' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Ações */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="btn btn-secondary"
                style={{ fontSize: '0.85rem', padding: '0.65rem 1rem' }}
              >
                <Plus size={16} /> Novo Convidado
              </button>

              <button
                onClick={exportCsv}
                className="btn btn-secondary"
                style={{ fontSize: '0.85rem', padding: '0.65rem 1rem' }}
              >
                <Download size={16} /> Exportar Excel
              </button>

              <button
                onClick={() => setIsPrintMode(true)}
                className="btn btn-primary-jade"
                style={{ fontSize: '0.85rem', padding: '0.65rem 1.2rem' }}
              >
                <Printer size={16} /> Imprimir Lista (Portaria)
              </button>
            </div>
          </div>

          {/* Filtros em Pílulas */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {[
              { id: 'todos', label: `Todos (${data.length})` },
              { id: 'confirmados', label: `Confirmados (${totalConfirmados.length})` },
              { id: 'pendentes', label: `Pendentes (${totalPendentes.length})` },
              { id: 'recusados', label: `Não Vão (${totalRecusados.length})` },
              { id: 'jade', label: `Time Jade (${votosJade})` },
              { id: 'benicio', label: `Time Benício (${votosBenicio})` },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id as any)}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: '9999px',
                  border: filterType === f.id ? '1.5px solid var(--boy-primary)' : '1px solid var(--border-soft)',
                  backgroundColor: filterType === f.id ? 'var(--boy-primary)' : '#ffffff',
                  color: filterType === f.id ? '#ffffff' : 'var(--text-secondary)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tabela de Convidados */}
        <div 
          className="glass-card" 
          style={{ 
            borderRadius: '20px', 
            overflow: 'hidden',
            boxShadow: 'var(--shadow-md)'
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.92rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-parchment-subtle)', borderBottom: '1.5px solid var(--border-soft)' }}>
                  <th style={{ padding: '0.9rem 1rem', fontWeight: 700 }}>Convidado Principal</th>
                  <th style={{ padding: '0.9rem 1rem', fontWeight: 700, textAlign: 'center' }}>Direito a</th>
                  <th style={{ padding: '0.9rem 1rem', fontWeight: 700 }}>Acompanhante(s) Confirmado(s)</th>
                  <th style={{ padding: '0.9rem 1rem', fontWeight: 700, textAlign: 'center' }}>Total Pessoas</th>
                  <th style={{ padding: '0.9rem 1rem', fontWeight: 700, textAlign: 'center' }}>Status</th>
                  <th style={{ padding: '0.9rem 1rem', fontWeight: 700, textAlign: 'center' }}>Palpite</th>
                  <th style={{ padding: '0.9rem 1rem', fontWeight: 700 }}>Contato</th>
                  <th style={{ padding: '0.9rem 1rem', fontWeight: 700, textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredGuests.map((guest, idx) => {
                  const acompanhantesList = guest.acompanhantes_nomes || [];
                  const whatsappClean = guest.telefone ? guest.telefone.replace(/\D/g, '') : '';

                  return (
                    <tr 
                      key={guest.id}
                      style={{ 
                        borderBottom: '1px solid #f0e8dc',
                        backgroundColor: idx % 2 === 0 ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.45)'
                      }}
                    >
                      {/* Nome do Convidado */}
                      <td style={{ padding: '0.9rem 1rem' }}>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                          {guest.nome}
                        </div>
                        {guest.mensagem && (
                          <button
                            onClick={() => setSelectedMessage({ nome: guest.nome, mensagem: guest.mensagem! })}
                            style={{ 
                              border: 'none', 
                              background: 'none', 
                              color: 'var(--girl-primary)', 
                              fontSize: '0.78rem', 
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              marginTop: '0.2rem',
                              padding: 0
                            }}
                          >
                            <MessageSquare size={12} /> Ler recado
                          </button>
                        )}
                      </td>

                      {/* Limite de Acompanhantes */}
                      <td style={{ padding: '0.9rem 1rem', textAlign: 'center' }}>
                        {guest.limite_acompanhantes === 0 ? (
                          <span className="badge" style={{ backgroundColor: '#f0f0f0', color: '#666', fontSize: '0.75rem' }}>
                            Individual
                          </span>
                        ) : (
                          <span className="badge badge-gold" style={{ fontSize: '0.75rem' }}>
                            +{guest.limite_acompanhantes} {guest.limite_acompanhantes > 1 ? 'acomp.' : 'acomp.'}
                          </span>
                        )}
                      </td>

                      {/* Acompanhantes Confirmados */}
                      <td style={{ padding: '0.9rem 1rem' }}>
                        {acompanhantesList.length > 0 ? (
                          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                            {acompanhantesList.map((name, i) => (
                              <span key={i} className="badge badge-benicio" style={{ fontSize: '0.75rem' }}>
                                {name}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span style={{ color: '#aaa', fontSize: '0.82rem' }}>
                            {guest.status === 'confirmado' ? 'Nenhum' : '-'}
                          </span>
                        )}
                      </td>

                      {/* Total Pessoas */}
                      <td style={{ padding: '0.9rem 1rem', textAlign: 'center', fontWeight: 700 }}>
                        {guest.status === 'confirmado' ? (guest.total_confirmados || 1) : '-'}
                      </td>

                      {/* Status */}
                      <td style={{ padding: '0.9rem 1rem', textAlign: 'center' }}>
                        {guest.status === 'confirmado' ? (
                          <span className="badge badge-green">Confirmado</span>
                        ) : guest.status === 'recusado' ? (
                          <span className="badge" style={{ backgroundColor: '#fde8e8', color: '#9b1c1c' }}>Não vai</span>
                        ) : (
                          <span className="badge badge-gold">Pendente</span>
                        )}
                      </td>

                      {/* Palpite */}
                      <td style={{ padding: '0.9rem 1rem', textAlign: 'center' }}>
                        {guest.palpite === 'jade' ? (
                          <span className="badge badge-jade">👗 Jade</span>
                        ) : guest.palpite === 'benicio' ? (
                          <span className="badge badge-benicio">👖 Benício</span>
                        ) : (
                          <span style={{ color: '#aaa', fontSize: '0.8rem' }}>-</span>
                        )}
                      </td>

                      {/* Contato WhatsApp */}
                      <td style={{ padding: '0.9rem 1rem' }}>
                        {guest.telefone ? (
                          <a 
                            href={`https://wa.me/55${whatsappClean}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ 
                              color: '#128c7e', 
                              textDecoration: 'none', 
                              fontWeight: 600,
                              fontSize: '0.85rem',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem'
                            }}
                          >
                            <Phone size={13} />
                            <span>{guest.telefone}</span>
                          </a>
                        ) : (
                          <span style={{ color: '#bbb', fontSize: '0.8rem' }}>Não informado</span>
                        )}
                      </td>

                      {/* Ações */}
                      <td style={{ padding: '0.9rem 1rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.3rem' }}>
                          {guest.status !== 'pendente' && (
                            <button
                              onClick={() => handleReset(guest.id, guest.nome)}
                              style={{
                                border: 'none',
                                background: 'none',
                                color: 'var(--gold-accent)',
                                cursor: 'pointer',
                                padding: '0.35rem',
                                borderRadius: '6px'
                              }}
                              title="Resetar para Pendente"
                            >
                              <RotateCcw size={15} />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(guest.id, guest.nome)}
                            style={{
                              border: 'none',
                              background: 'none',
                              color: 'var(--danger)',
                              cursor: 'pointer',
                              padding: '0.35rem',
                              borderRadius: '6px'
                            }}
                            title="Excluir Convidado"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredGuests.length === 0 && (
            <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              Nenhum convidado encontrado para a busca ou filtro selecionado.
            </div>
          )}
        </div>
      </div>

      {/* Modal de Leitura de Mensagem */}
      {selectedMessage && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem',
            zIndex: 9999
          }}
        >
          <div className="glass-card" style={{ maxWidth: '480px', width: '100%', padding: '2rem', borderRadius: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h4 className="font-serif" style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0 }}>
                Recado de {selectedMessage.nome}
              </h4>
              <button onClick={() => setSelectedMessage(null)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#666' }}>
                <X size={20} />
              </button>
            </div>
            <p style={{ fontSize: '1rem', fontStyle: 'italic', lineHeight: 1.6, backgroundColor: 'var(--bg-parchment)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-soft)' }}>
              &ldquo;{selectedMessage.mensagem}&rdquo;
            </p>
            <div style={{ textAlign: 'right', marginTop: '1.25rem' }}>
              <button onClick={() => setSelectedMessage(null)} className="btn btn-secondary">
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Novo Convidado */}
      {isAddModalOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem',
            zIndex: 9999
          }}
        >
          <div className="glass-card" style={{ maxWidth: '450px', width: '100%', padding: '2rem', borderRadius: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h4 className="font-serif" style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>
                Adicionar Convidado
              </h4>
              <button onClick={() => setIsAddModalOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#666' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit}>
              <div className="form-group">
                <label className="form-label">Nome Completo do Convidado *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: João Victor Silva"
                  className="form-input"
                  value={newNome}
                  onChange={e => setNewNome(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Limite de Acompanhantes Permitidos</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  className="form-input"
                  value={newLimite}
                  onChange={e => setNewLimite(Number(e.target.value))}
                />
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  (0 = Convite individual, 1 = +1 acompanhante, etc.)
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="btn btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary-jade">
                  Cadastrar Convidado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
