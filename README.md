# Limonssauro — Cardápio + Supabase

Esta é a versão com banco online e sincronização em tempo real.

## 1. Criar o Supabase
1. Crie um projeto em https://supabase.com/
2. No SQL Editor, execute `supabase/schema.sql`.
3. Em Authentication > Users, crie o usuário de staff com e-mail e senha.
4. Em Project Settings > API, copie a Project URL e a chave pública anon/publishable.

## 2. Configurar o projeto
Copie `.env.example` para `.env.local` e preencha:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Nunca coloque a `service_role` key no frontend.

## 3. Testar
```bash
npm install
npm run dev
```

## 4. Publicar
```bash
npm run build
```
Publique a pasta `dist` em Vercel, Netlify ou Cloudflare Pages.

## Como funciona
- Visitantes conseguem visualizar cardápio e fila.
- Somente usuários autenticados no Supabase conseguem adicionar/editar/remover.
- Alterações aparecem automaticamente em outros navegadores através do Supabase Realtime.
- A senha de staff não fica escrita no código do site; o login é feito pelo Supabase Auth.

### Observação de segurança
As políticas RLS permitem leitura pública e escrita somente para usuários autenticados. Para ter vários moderadores, crie contas adicionais no Authentication do Supabase.
