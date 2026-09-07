-- ==============================================================================
-- SCHEMA SUPABASE: CHÁ REVELAÇÃO JADE OU BENÍCIO (LISTA NOMINAL PRÉ-CADASTRADA)
-- Execute este script no SQL Editor do seu projeto Supabase (https://supabase.com)
-- ==============================================================================

-- 1. Criação da tabela de convidados com controle nominal de acompanhantes
create table if not exists public.convidados (
    id text primary key,
    nome text not null,
    limite_acompanhantes integer default 0 not null,
    status text default 'pendente' check (status in ('pendente', 'confirmado', 'recusado')),
    telefone text,
    acompanhantes_nomes jsonb default '[]'::jsonb,
    total_confirmados integer default 0,
    palpite text check (palpite in ('jade', 'benicio', 'surpresa')),
    mensagem text,
    confirmado_em timestamp with time zone
);

-- 2. Índices para performance
create index if not exists idx_convidados_nome on public.convidados(nome);
create index if not exists idx_convidados_status on public.convidados(status);

-- 3. Habilitar Row Level Security (RLS)
alter table public.convidados enable row level security;

-- 4. Políticas de Acesso
create policy "Permitir leitura anônima de convidados" 
on public.convidados for select using (true);

create policy "Permitir atualização da confirmação" 
on public.convidados for update using (true);

create policy "Permitir inserção e deleção" 
on public.convidados for all using (true);

-- 5. Inserção dos 58 convidados pré-cadastrados
insert into public.convidados (id, nome, limite_acompanhantes, status) values
('guest-1', 'Samylle Beltrão', 1, 'pendente'),
('guest-2', 'Vitoria Emilly', 2, 'pendente'),
('guest-3', 'Caroline Tâmega', 1, 'pendente'),
('guest-4', 'Thamires Félix', 1, 'pendente'),
('guest-5', 'Maria Letícia', 1, 'pendente'),
('guest-6', 'Vitória Francielle', 0, 'pendente'),
('guest-7', 'Maria Cecilia', 0, 'pendente'),
('guest-8', 'Anna Beatriz Melo', 0, 'pendente'),
('guest-9', 'Denya Fernanda', 1, 'pendente'),
('guest-10', 'Bárbara Santana', 4, 'pendente'),
('guest-11', 'Dayse Uchôa', 1, 'pendente'),
('guest-12', 'Giovanna Cabral', 1, 'pendente'),
('guest-13', 'Vera Lúcia', 5, 'pendente'),
('guest-14', 'Lucia Soares', 0, 'pendente'),
('guest-15', 'Joseane Soares', 1, 'pendente'),
('guest-16', 'Jordana Ranielle', 1, 'pendente'),
('guest-17', 'Josivania Pereira', 1, 'pendente'),
('guest-18', 'Genilsa Ferreira', 0, 'pendente'),
('guest-19', 'Simone Bernardo', 0, 'pendente'),
('guest-20', 'Andrea Demezio', 1, 'pendente'),
('guest-21', 'Esthefany Dmezio', 1, 'pendente'),
('guest-22', 'Graziela Borges', 1, 'pendente'),
('guest-23', 'Cris Cota', 0, 'pendente'),
('guest-24', 'Suegleide Florentino', 3, 'pendente'),
('guest-25', 'Olga Lima', 1, 'pendente'),
('guest-26', 'Paula Beiriz', 0, 'pendente'),
('guest-27', 'Fabíula Ribeiro', 0, 'pendente'),
('guest-28', 'Cicleide Brás', 1, 'pendente'),
('guest-29', 'Márcia Albuquerque', 2, 'pendente'),
('guest-30', 'Jamille Adrielly', 1, 'pendente'),
('guest-31', 'Rafaella Santos', 1, 'pendente'),
('guest-32', 'Karla Santana', 1, 'pendente'),
('guest-33', 'Vinicius', 1, 'pendente'),
('guest-34', 'Ana Paula', 1, 'pendente'),
('guest-35', 'Glaucia Buarque', 1, 'pendente'),
('guest-36', 'Joseane Freitas', 1, 'pendente'),
('guest-37', 'Janaina do Nascimento Silva', 2, 'pendente'),
('guest-38', 'Carlos Demóstenes da Silva', 1, 'pendente'),
('guest-39', 'José William Barbosa e Silva', 2, 'pendente'),
('guest-40', 'Diego Calisto Silva Santos', 2, 'pendente'),
('guest-41', 'Isadora Maria Siqueira de Abreu', 1, 'pendente'),
('guest-42', 'Gilvan Melo de Abreu', 0, 'pendente'),
('guest-43', 'Carolina Duarte de Abreu Madruga', 1, 'pendente'),
('guest-44', 'Vinicius Castro Lima', 1, 'pendente'),
('guest-45', 'Marcelo Andreatto Nogueira', 2, 'pendente'),
('guest-46', 'Milena Mirelle Lima da Silva', 2, 'pendente'),
('guest-47', 'Cinthya Élida Damasceno Burguez Santos', 0, 'pendente'),
('guest-48', 'Arthur Plácido de Oliveira', 0, 'pendente'),
('guest-49', 'Juan Gabriel Rocha de Oliveira', 1, 'pendente'),
('guest-50', 'Joel Helder da Silva Morais', 1, 'pendente'),
('guest-51', 'Wilder de Sá Santos', 1, 'pendente'),
('guest-52', 'Wendel de Sá Santos', 1, 'pendente'),
('guest-53', 'Kayke Yuri Costa Magalhães', 0, 'pendente'),
('guest-54', 'Kennedy Morais da Veiga Costa', 0, 'pendente'),
('guest-55', 'Alexandre César Araújo', 2, 'pendente'),
('guest-56', 'Thiago André Gomes Antunes', 1, 'pendente'),
('guest-57', 'Roselândia Alcides Gaspar', 1, 'pendente'),
('guest-58', 'Alexandra Feitosa d\'Almeida', 1, 'pendente')
on conflict (id) do nothing;
