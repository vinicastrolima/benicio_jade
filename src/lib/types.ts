export type ConfirmationStatus = 'pendente' | 'confirmado' | 'recusado';
export type BabyGuess = 'jade' | 'benicio' | 'surpresa';

export interface PreRegisteredGuest {
  id: string;
  nome: string;
  limite_acompanhantes: number;
  status: ConfirmationStatus;
  telefone?: string;
  acompanhantes_nomes?: string[];
  total_confirmados?: number;
  palpite?: BabyGuess;
  mensagem?: string;
  confirmado_em?: string;
}

export interface ConfirmacaoPayload {
  status: 'confirmado' | 'recusado';
  telefone: string;
  acompanhantes_nomes: string[];
  palpite: BabyGuess;
  mensagem?: string;
}
