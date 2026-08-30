-- Limonssauro: banco inicial
-- Execute este arquivo no SQL Editor do seu projeto Supabase.

create extension if not exists pgcrypto;

create table if not exists public.cardapio_itens (
  id uuid primary key default gen_random_uuid(),
  tipo text not null check (tipo in ('filme','serie','video','musica','jogo')),
  titulo text not null,
  descricao text not null default '',
  preco text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.pedidos (
  id uuid primary key default gen_random_uuid(),
  numero integer not null,
  nome text not null,
  tipo text not null check (tipo in ('filme','serie','video','musica','jogo')),
  titulo text not null,
  status text not null default 'pendente' check (status in ('pendente','assistido')),
  criado_em timestamptz not null default now(),
  concluido_em timestamptz
);

alter table public.cardapio_itens enable row level security;
alter table public.pedidos enable row level security;

drop policy if exists "cardapio leitura publica" on public.cardapio_itens;
create policy "cardapio leitura publica"
on public.cardapio_itens for select
to anon, authenticated
using (true);

drop policy if exists "cardapio staff inserir" on public.cardapio_itens;
create policy "cardapio staff inserir"
on public.cardapio_itens for insert
to authenticated
with check (true);

drop policy if exists "cardapio staff atualizar" on public.cardapio_itens;
create policy "cardapio staff atualizar"
on public.cardapio_itens for update
to authenticated
using (true)
with check (true);

drop policy if exists "cardapio staff excluir" on public.cardapio_itens;
create policy "cardapio staff excluir"
on public.cardapio_itens for delete
to authenticated
using (true);

drop policy if exists "pedidos leitura publica" on public.pedidos;
create policy "pedidos leitura publica"
on public.pedidos for select
to anon, authenticated
using (true);

drop policy if exists "pedidos staff inserir" on public.pedidos;
create policy "pedidos staff inserir"
on public.pedidos for insert
to authenticated
with check (true);

drop policy if exists "pedidos staff atualizar" on public.pedidos;
create policy "pedidos staff atualizar"
on public.pedidos for update
to authenticated
using (true)
with check (true);

drop policy if exists "pedidos staff excluir" on public.pedidos;
create policy "pedidos staff excluir"
on public.pedidos for delete
to authenticated
using (true);

-- Realtime para sincronizar alterações entre navegadores.
alter publication supabase_realtime add table public.cardapio_itens;
alter publication supabase_realtime add table public.pedidos;

-- Cardápio inicial
insert into public.cardapio_itens (tipo, titulo, descricao, preco)
select * from (values
  ('filme','Filme à sua escolha','Você escolhe, eu assisto ao vivo.',''),
  ('serie','1 episódio de série','Um episódio de uma série que você indicar.',''),
  ('video','Vídeo / clipe','Vídeo do YouTube, clipe, o que quiser.',''),
  ('musica','Pedido musical','Toco ou escuto junto com o chat.',''),
  ('jogo','Partida escolhida','Jogo ou desafio à sua escolha.','')
) as v(tipo,titulo,descricao,preco)
where not exists (select 1 from public.cardapio_itens);
