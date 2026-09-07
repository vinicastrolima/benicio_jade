'use client';

import React, { useState, useMemo } from 'react';
import { PreRegisteredGuest, BabyGuess } from '@/lib/types';
import { confirmarPresenca } from '@/lib/supabaseClient';
import { triggerCelebration } from './ConfettiEffect';
import { 
  Search, 
  UserCheck, 
  CheckCircle2, 
  XCircle, 
  Heart, 
  Send, 
  UserPlus, 
  Users, 
  Sparkles,
  ArrowLeft,
  Check
} from 'lucide-react';

interface RsvpFormProps {
  convidados: PreRegisteredGuest[];
  onSuccess: () => void;
}

export default function RsvpForm({ convidados, onSuccess }: RsvpFormProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGuest, setSelectedGuest] = useState<PreRegisteredGuest | null>(null);

  // Campos do formulário
  const [status, setStatus] = useState<'confirmado' | 'recusado'>('confirmado');
  const [acompanhantes, setAcompanhantes] = useState<string[]>([]);
  const [palpite, setPalpite] = useState<BabyGuess>('jade');
  const [mensagem, setMensagem] = useState('');

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Filtragem da lista para busca inicial
  const filteredList = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const term = searchTerm.toLowerCase().trim();
    return convidados.filter(g => g.nome.toLowerCase().includes(term));
  }, [convidados, searchTerm]);

  // Ao selecionar um convidado
  const handleSelectGuest = (guest: PreRegisteredGuest) => {
    setSelectedGuest(guest);
    setStatus(guest.status === 'recusado' ? 'recusado' : 'confirmado');
    setPalpite(guest.palpite || 'jade');
    setMensagem(guest.mensagem || '');
    
    // Inicializar caixas de texto com os acompanhantes já salvos ou vazios até o limite permitido
    const initialAcompanhantes: string[] = [];
    for (let i = 0; i < guest.limite_acompanhantes; i++) {
      initialAcompanhantes.push(guest.acompanhantes_nomes?.[i] || '');
    }
    setAcompanhantes(initialAcompanhantes);
    setSubmitted(false);
    setErrorMessage('');
  };

  const handleAcompanhanteChange = (index: number, val: string) => {
    const updated = [...acompanhantes];
    updated[index] = val;
    setAcompanhantes(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGuest) return;
    setErrorMessage('');

    setLoading(true);

    try {
      const res = await confirmarPresenca(selectedGuest.id, {
        status,
        telefone: selectedGuest.telefone || '',
        acompanhantes_nomes: acompanhantes.filter(name => name.trim().length > 0),
        palpite,
        mensagem
      });

      if (!res.success && res.error) {
        setErrorMessage(`Não foi possível salvar: ${res.error}`);
        setLoading(false);
        return;
      }

      setSubmitted(true);
      if (status === 'confirmado') {
        triggerCelebration(palpite);
      }
      onSuccess();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Erro ao processar confirmação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleVoltar = () => {
    setSelectedGuest(null);
    setSearchTerm('');
    setSubmitted(false);
    setErrorMessage('');
  };

  return (
    <section id="rsvp-section" style={{ margin: '2.5rem 0', scrollMarginTop: '20px' }}>
      <div 
        className="glass-card" 
        style={{ 
          padding: 'clamp(1.5rem, 5vw, 2.5rem)', 
          borderRadius: '28px',
          border: '1.5px solid rgba(215, 198, 180, 0.75)',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        {/* Cabeçalho */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
            <span className="badge badge-green">
              <UserCheck size={14} /> Confirmação de Presença
            </span>
          </div>
          <h3 
            className="font-serif" 
            style={{ 
              fontSize: 'clamp(1.9rem, 4.8vw, 2.6rem)', 
              fontWeight: 700, 
              color: 'var(--text-primary)',
              lineHeight: 1.15
            }}
          >
            Localize seu Nome no Convite
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.35rem' }}>
            Digite o seu nome para confirmar sua presença e registrar o seu palpite
          </p>
        </div>

        {/* ETAPA 1: NENHUM CONVIDADO SELECIONADO AINDA */}
        {!selectedGuest && (
          <div>
            {/* Campo de Busca por Nome */}
            <div style={{ position: 'relative', maxWidth: '520px', margin: '0 auto 1.5rem' }}>
              <Search 
                size={20} 
                style={{ 
                  position: 'absolute', 
                  left: '16px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  color: 'var(--text-muted)' 
                }} 
              />
              <input
                type="text"
                placeholder="Digite seu nome ou sobrenome..."
                className="form-input"
                style={{ 
                  paddingLeft: '3rem', 
                  paddingTop: '1rem', 
                  paddingBottom: '1rem', 
                  fontSize: '1.05rem',
                  borderRadius: '16px',
                  boxShadow: 'var(--shadow-sm)'
                }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Resultados da Busca */}
            {searchTerm.trim().length > 0 ? (
              <div style={{ maxWidth: '540px', margin: '0 auto' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem', fontWeight: 600 }}>
                  {filteredList.length === 0 
                    ? 'Nenhum convite encontrado com este nome.' 
                    : `Clique no seu nome para confirmar (${filteredList.length} encontrado${filteredList.length > 1 ? 's' : ''}):`}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {filteredList.map((guest) => {
                    const isConfirmed = guest.status === 'confirmado';
                    const isRecused = guest.status === 'recusado';

                    return (
                      <button
                        key={guest.id}
                        type="button"
                        onClick={() => handleSelectGuest(guest)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '1rem 1.25rem',
                          borderRadius: '16px',
                          border: '1.5px solid var(--border-soft)',
                          backgroundColor: '#ffffff',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.2s',
                          boxShadow: 'var(--shadow-sm)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = 'var(--boy-primary)';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'var(--border-soft)';
                          e.currentTarget.style.transform = 'none';
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                            {guest.nome}
                          </div>
                          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                            {guest.limite_acompanhantes === 0 
                              ? 'Convite Individual' 
                              : `Direito a +${guest.limite_acompanhantes} acompanhante${guest.limite_acompanhantes > 1 ? 's' : ''}`}
                          </div>
                        </div>

                        <div>
                          {isConfirmed ? (
                            <span className="badge badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                              <Check size={12} /> Confirmado • Editar
                            </span>
                          ) : isRecused ? (
                            <span className="badge" style={{ backgroundColor: '#fde8e8', color: '#9b1c1c' }}>
                              Não vai • Alterar
                            </span>
                          ) : (
                            <span className="badge badge-gold">
                              Confirmar Presença →
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Dica inicial */
              <div 
                style={{ 
                  textAlign: 'center', 
                  padding: '2rem 1rem', 
                  color: 'var(--text-muted)',
                  fontSize: '0.92rem'
                }}
              >
                <p>Comece a digitar seu nome acima para acessar seu convite nominal.</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                  <span className="badge badge-gold">58 Convidados Cadastrados</span>
                  <span className="badge badge-jade">Vagas com Acompanhante</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ETAPA 2: CONVIDADO SELECIONADO & FORMULÁRIO */}
        {selectedGuest && !submitted && (
          <div style={{ maxWidth: '580px', margin: '0 auto' }}>
            {/* Botão de Trocar Convidado */}
            <div style={{ marginBottom: '1.25rem' }}>
              <button
                type="button"
                onClick={handleVoltar}
                className="btn btn-secondary"
                style={{ fontSize: '0.85rem', padding: '0.45rem 0.9rem' }}
              >
                <ArrowLeft size={15} /> Escolher outro nome
              </button>
            </div>

            {/* Cartão de Identificação do Convidado */}
            <div 
              style={{ 
                backgroundColor: 'var(--bg-parchment-subtle)', 
                border: '1.5px solid var(--border-soft)', 
                borderRadius: '18px', 
                padding: '1.25rem',
                marginBottom: '1.5rem',
                textAlign: 'center'
              }}
            >
              <span className="font-script" style={{ fontSize: '1.6rem', color: 'var(--gold-accent)', display: 'block' }}>
                Bem-vindo(a)
              </span>
              <h4 className="font-serif" style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0.1rem 0' }}>
                {selectedGuest.nome}
              </h4>
              
              <div style={{ marginTop: '0.6rem' }}>
                {selectedGuest.limite_acompanhantes === 0 ? (
                  <span className="badge badge-gold" style={{ fontSize: '0.85rem', padding: '0.35rem 0.85rem' }}>
                    Convite Individual
                  </span>
                ) : (
                  <span className="badge badge-green" style={{ fontSize: '0.85rem', padding: '0.35rem 0.85rem' }}>
                    Seu convite dá direito a até {selectedGuest.limite_acompanhantes} acompanhante{selectedGuest.limite_acompanhantes > 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>

            {/* Banner de Edição para Convidado já Confirmado */}
            {selectedGuest.status === 'confirmado' && (
              <div 
                style={{
                  backgroundColor: '#f0f9f2',
                  border: '1px solid #b7e4c7',
                  borderRadius: '16px',
                  padding: '0.9rem 1.15rem',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  fontSize: '0.88rem',
                  color: '#2d6a4f',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <Sparkles size={20} style={{ flexShrink: 0, color: 'var(--leaf-green)' }} />
                <div>
                  <strong>Presença já confirmada!</strong> Você pode alterar ou adicionar os nomes dos seus acompanhantes abaixo e salvar as alterações a qualquer momento.
                </div>
              </div>
            )}

            {/* Formulário */}
            <form onSubmit={handleSubmit}>
              {errorMessage && (
                <div 
                  style={{ 
                    backgroundColor: '#fde8e8', 
                    border: '1px solid #f8b4b4', 
                    color: '#9b1c1c', 
                    padding: '0.75rem 1rem', 
                    borderRadius: '12px', 
                    fontSize: '0.9rem',
                    marginBottom: '1.25rem',
                    textAlign: 'center'
                  }}
                >
                  {errorMessage}
                </div>
              )}

              {/* Você vai ou não? */}
              <div className="form-group">
                <label className="form-label">
                  Você poderá comparecer ao Chá? *
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.3rem' }}>
                  <button
                    type="button"
                    onClick={() => setStatus('confirmado')}
                    style={{
                      padding: '0.9rem 0.5rem',
                      borderRadius: '14px',
                      border: status === 'confirmado' ? '2px solid var(--leaf-green)' : '1.5px solid var(--border-soft)',
                      backgroundColor: status === 'confirmado' ? '#f0f9f2' : '#ffffff',
                      color: status === 'confirmado' ? 'var(--leaf-green)' : 'var(--text-secondary)',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.3rem',
                      transition: 'all 0.2s'
                    }}
                  >
                    <CheckCircle2 size={22} color={status === 'confirmado' ? 'var(--leaf-green)' : '#aaa'} />
                    <span style={{ fontSize: '0.92rem' }}>Sim, estarei lá!</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStatus('recusado')}
                    style={{
                      padding: '0.9rem 0.5rem',
                      borderRadius: '14px',
                      border: status === 'recusado' ? '2px solid var(--girl-primary)' : '1.5px solid var(--border-soft)',
                      backgroundColor: status === 'recusado' ? 'var(--girl-soft)' : '#ffffff',
                      color: status === 'recusado' ? 'var(--girl-primary)' : 'var(--text-secondary)',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.3rem',
                      transition: 'all 0.2s'
                    }}
                  >
                    <XCircle size={22} color={status === 'recusado' ? 'var(--girl-primary)' : '#aaa'} />
                    <span style={{ fontSize: '0.92rem' }}>Não poderei ir</span>
                  </button>
                </div>
              </div>

              {/* SE CONFIRMADO: ACOMPANHANTES */}
              {status === 'confirmado' && selectedGuest.limite_acompanhantes > 0 && (
                    <div 
                      style={{ 
                        backgroundColor: '#ffffff', 
                        border: '1.5px dashed var(--boy-border)', 
                        padding: '1.25rem', 
                        borderRadius: '18px', 
                        margin: '1.25rem 0' 
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.95rem', color: 'var(--boy-primary)', marginBottom: '0.25rem' }}>
                        <UserPlus size={18} /> Nome dos Acompanhantes
                      </div>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                        Informe o nome completo de quem irá com você. Se não for levar todos os {selectedGuest.limite_acompanhantes} acompanhante(s), deixe o campo em branco:
                      </p>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                        {Array.from({ length: selectedGuest.limite_acompanhantes }).map((_, index) => (
                          <div key={index}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.3rem', color: 'var(--text-secondary)' }}>
                              Acompanhante {index + 1}:
                            </label>
                            <input
                              type="text"
                              placeholder={`Nome completo do acompanhante ${index + 1}`}
                              className="form-input"
                              value={acompanhantes[index] || ''}
                              onChange={(e) => handleAcompanhanteChange(index, e.target.value)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

              {/* Palpite Jade ou Benício */}
              <div className="form-group" style={{ marginTop: '1.25rem' }}>
                <label className="form-label">
                  Deixe seu palpite no Bolão: *
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginTop: '0.3rem' }}>
                  <button
                    type="button"
                    onClick={() => setPalpite('jade')}
                    style={{
                      padding: '1rem 0.5rem',
                      borderRadius: '16px',
                      border: palpite === 'jade' ? '2.5px solid var(--girl-primary)' : '1.5px solid var(--border-soft)',
                      backgroundColor: palpite === 'jade' ? 'var(--girl-soft)' : '#ffffff',
                      cursor: 'pointer',
                      textAlign: 'center',
                      boxShadow: palpite === 'jade' ? '0 4px 14px var(--girl-glow)' : 'var(--shadow-sm)',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ fontSize: '2rem', marginBottom: '0.15rem' }}>👗</div>
                    <div className="font-serif" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--girl-primary)' }}>
                      Time Jade
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      Vestidinho Rosa
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPalpite('benicio')}
                    style={{
                      padding: '1rem 0.5rem',
                      borderRadius: '16px',
                      border: palpite === 'benicio' ? '2.5px solid var(--boy-primary)' : '1.5px solid var(--border-soft)',
                      backgroundColor: palpite === 'benicio' ? 'var(--boy-soft)' : '#ffffff',
                      cursor: 'pointer',
                      textAlign: 'center',
                      boxShadow: palpite === 'benicio' ? '0 4px 14px var(--boy-glow)' : 'var(--shadow-sm)',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ fontSize: '2rem', marginBottom: '0.15rem' }}>👖</div>
                    <div className="font-serif" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--boy-primary)' }}>
                      Time Benício
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      Jardineira Jeans
                    </div>
                  </button>
                </div>
              </div>

              {/* Mensagem Carinhosa */}
              <div className="form-group" style={{ marginTop: '1.25rem' }}>
                <label className="form-label" htmlFor="input-msg">
                  Deixe um recado carinhoso para os papais e o bebê (opcional)
                </label>
                <textarea
                  id="input-msg"
                  rows={3}
                  placeholder="Escreva seus votos de amor, saúde e felicidade..."
                  className="form-textarea"
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                />
              </div>

              {/* Botão de Envio */}
              <div style={{ marginTop: '1.75rem' }}>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn"
                  style={{
                    width: '100%',
                    padding: '1.1rem',
                    fontSize: '1.1rem',
                    background: palpite === 'jade' 
                      ? 'linear-gradient(135deg, var(--girl-primary), var(--girl-hover))'
                      : 'linear-gradient(135deg, var(--boy-primary), var(--boy-hover))',
                    color: '#ffffff',
                    boxShadow: palpite === 'jade' ? '0 6px 20px var(--girl-glow)' : '0 6px 20px var(--boy-glow)',
                    opacity: loading ? 0.7 : 1
                  }}
                >
                  {loading ? (
                    <span>{selectedGuest.status === 'confirmado' ? 'Salvando alterações...' : 'Salvando confirmação...'}</span>
                  ) : (
                    <>
                      <Send size={18} />
                      <span>{selectedGuest.status === 'confirmado' ? 'Atualizar Confirmação & Acompanhantes' : 'Confirmar Presença'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ETAPA 3: CONFIRMAÇÃO REALIZADA COM SUCESSO */}
        {selectedGuest && submitted && (
          <div 
            style={{ 
              textAlign: 'center', 
              padding: '2.5rem 1rem', 
              backgroundColor: status === 'confirmado' ? 'rgba(235, 245, 238, 0.7)' : 'rgba(250, 240, 240, 0.7)',
              borderRadius: '20px',
              border: status === 'confirmado' ? '1.5px solid var(--leaf-green)' : '1.5px solid #e2b4b4',
              maxWidth: '560px',
              margin: '0 auto'
            }}
          >
            <div style={{ marginBottom: '1rem' }}>
              {status === 'confirmado' ? (
                <div 
                  style={{ 
                    width: '68px', 
                    height: '68px', 
                    borderRadius: '50%', 
                    backgroundColor: '#d6edd9', 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: 'var(--leaf-green)'
                  }}
                >
                  <CheckCircle2 size={38} />
                </div>
              ) : (
                <div 
                  style={{ 
                    width: '68px', 
                    height: '68px', 
                    borderRadius: '50%', 
                    backgroundColor: '#fce4e4', 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: 'var(--girl-primary)'
                  }}
                >
                  <Heart size={38} />
                </div>
              )}
            </div>

            <h4 className="font-serif" style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              {status === 'confirmado' 
                ? (selectedGuest.status === 'confirmado' ? 'Confirmação e Acompanhantes Atualizados!' : 'Presença Confirmada!') 
                : 'Resposta Registrada!'}
            </h4>

            <p style={{ fontSize: '1.05rem', color: 'var(--text-primary)', margin: '0 auto 1.25rem' }}>
              {status === 'confirmado' ? (
                <>
                  Que felicidade, <strong>{selectedGuest.nome}</strong>! Sua presença está garantida no Chá Revelação e o seu voto no <strong>Time {palpite === 'jade' ? 'Jade' : 'Benício'}</strong> foi somado ao placar!
                </>
              ) : (
                <>
                  Sentiremos sua falta, <strong>{selectedGuest.nome}</strong>! Obrigado por nos avisar com antecedência.
                </>
              )}
            </p>

            {/* Resumo de Acompanhantes */}
            {status === 'confirmado' && acompanhantes.filter(n => n.trim().length > 0).length > 0 && (
              <div 
                style={{ 
                  backgroundColor: '#ffffff', 
                  padding: '0.85rem 1.25rem', 
                  borderRadius: '12px', 
                  display: 'inline-block',
                  marginBottom: '1.5rem',
                  fontSize: '0.9rem',
                  border: '1px solid #d4e7d7',
                  textAlign: 'left'
                }}
              >
                <div style={{ fontWeight: 700, color: 'var(--leaf-green)', marginBottom: '0.25rem' }}>
                  Acompanhante(s) confirmados:
                </div>
                <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
                  {acompanhantes.filter(n => n.trim().length > 0).map((name, idx) => (
                    <li key={idx}><strong>{name}</strong></li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <button onClick={handleVoltar} className="btn btn-secondary">
                Confirmar Outro Convidado
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
