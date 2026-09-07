import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { PreRegisteredGuest, ConfirmacaoPayload } from './types';
import { generateInitialGuestList } from './convidadosData';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project-id') &&
  supabaseUrl.startsWith('https://')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

const STORAGE_KEY = 'benicio_jade_convidados_v3';

function getLocalConvidados(): PreRegisteredGuest[] {
  if (typeof window === 'undefined') return generateInitialGuestList();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = generateInitialGuestList();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Erro ao ler do localStorage:', err);
    return generateInitialGuestList();
  }
}

function saveLocalConvidados(data: PreRegisteredGuest[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Erro ao salvar no localStorage:', err);
  }
}

export async function getConvidados(): Promise<PreRegisteredGuest[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('convidados')
        .select('*')
        .order('nome', { ascending: true });

      if (error) {
        console.warn('Erro ao consultar Supabase, usando dados locais:', error.message);
        return getLocalConvidados();
      }

      if (!data || data.length === 0) {
        // Tabela criada mas ainda sem dados: popula os iniciais
        const initials = generateInitialGuestList();
        await supabase.from('convidados').insert(initials);
        return initials;
      }

      return data as PreRegisteredGuest[];
    } catch (e) {
      console.warn('Falha na requisição Supabase:', e);
      return getLocalConvidados();
    }
  }

  return getLocalConvidados();
}

export async function confirmarPresenca(
  guestId: string, 
  payload: ConfirmacaoPayload
): Promise<{ success: boolean; error?: string; guest?: PreRegisteredGuest }> {
  const cleanAcompanhantes = payload.status === 'confirmado' 
    ? (payload.acompanhantes_nomes || []).filter(n => n.trim().length > 0)
    : [];

  const total = payload.status === 'confirmado' ? 1 + cleanAcompanhantes.length : 0;

  const updateFields: Partial<PreRegisteredGuest> = {
    status: payload.status,
    telefone: payload.telefone.trim(),
    acompanhantes_nomes: cleanAcompanhantes,
    total_confirmados: total,
    palpite: payload.palpite,
    mensagem: payload.mensagem?.trim() || '',
    confirmado_em: new Date().toISOString()
  };

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('convidados')
        .update(updateFields)
        .eq('id', guestId)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar no Supabase:', error);
        // Fallback local
        const current = getLocalConvidados();
        const updatedList = current.map(item => item.id === guestId ? { ...item, ...updateFields } : item);
        saveLocalConvidados(updatedList);
        return { success: false, error: error.message };
      }

      // Sincroniza localmente
      const current = getLocalConvidados();
      const updatedList = current.map(item => item.id === guestId ? (data as PreRegisteredGuest) : item);
      saveLocalConvidados(updatedList);

      return { success: true, guest: data as PreRegisteredGuest };
    } catch (e: any) {
      console.error('Falha de rede no Supabase:', e);
      return { success: false, error: e?.message || 'Erro de conexão com o banco' };
    }
  }

  // Modo local
  const current = getLocalConvidados();
  let updatedGuest: PreRegisteredGuest | undefined;
  const updatedList = current.map(item => {
    if (item.id === guestId) {
      updatedGuest = { ...item, ...updateFields };
      return updatedGuest;
    }
    return item;
  });

  saveLocalConvidados(updatedList);
  return { success: true, guest: updatedGuest };
}

export async function resetConfirmacao(guestId: string): Promise<boolean> {
  const resetFields: Partial<PreRegisteredGuest> = {
    status: 'pendente',
    telefone: '',
    acompanhantes_nomes: [],
    total_confirmados: 0,
    palpite: undefined,
    mensagem: '',
    confirmado_em: undefined
  };

  if (supabase) {
    try {
      await supabase.from('convidados').update(resetFields).eq('id', guestId);
    } catch (e) {
      console.error('Erro ao resetar no Supabase:', e);
    }
  }

  const current = getLocalConvidados();
  const updated = current.map(item => item.id === guestId ? { ...item, ...resetFields } : item);
  saveLocalConvidados(updated);
  return true;
}

export async function addConvidadoManual(nome: string, limite: number): Promise<PreRegisteredGuest> {
  const newGuest: PreRegisteredGuest = {
    id: `guest-${Date.now()}`,
    nome: nome.trim(),
    limite_acompanhantes: Math.max(0, limite),
    status: 'pendente',
    telefone: '',
    acompanhantes_nomes: [],
    total_confirmados: 0,
  };

  if (supabase) {
    try {
      await supabase.from('convidados').insert([newGuest]);
    } catch (e) {
      console.error('Erro ao inserir convidado no Supabase:', e);
    }
  }

  const current = getLocalConvidados();
  const updated = [...current, newGuest].sort((a, b) => a.nome.localeCompare(b.nome));
  saveLocalConvidados(updated);
  return newGuest;
}

export async function deleteConvidado(id: string): Promise<boolean> {
  if (supabase) {
    try {
      await supabase.from('convidados').delete().eq('id', id);
    } catch (e) {
      console.error('Erro ao deletar no Supabase:', e);
    }
  }

  const current = getLocalConvidados();
  saveLocalConvidados(current.filter(item => item.id !== id));
  return true;
}
