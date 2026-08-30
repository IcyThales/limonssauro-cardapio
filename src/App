import React, { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase";
import {
  Film,
  Tv,
  Video,
  Music2,
  Gamepad2,
  Plus,
  LogOut,
  Lock,
  Check,
  Trash2,
  X,
  Undo2,
  Pencil,
  Sparkles,
  Sun,
  Moon,
} from "lucide-react";

const TIPOS = [
  { id: "filme", label: "Filme", icon: Film },
  { id: "serie", label: "Série", icon: Tv },
  { id: "video", label: "Vídeo", icon: Video },
  { id: "musica", label: "Música", icon: Music2 },
  { id: "jogo", label: "Jogo", icon: Gamepad2 },
];

function tipoInfo(id) {
  return TIPOS.find((t) => t.id === id) || TIPOS[0];
}
function pad(n) {
  return String(n).padStart(3, "0");
}
function formatData(ts) {
  return new Date(ts).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

const ITENS_PADRAO = [
  { tipo: "filme", titulo: "Filme à sua escolha", descricao: "Você escolhe, eu assisto ao vivo.", preco: "" },
  { tipo: "serie", titulo: "1 episódio de série", descricao: "Um episódio de uma série que você indicar.", preco: "" },
  { tipo: "video", titulo: "Vídeo / clipe", preco: "" , descricao: "Vídeo do YouTube, clipe, o que quiser."},
  { tipo: "musica", titulo: "Pedido musical", descricao: "Toco ou escuto junto com o chat.", preco: "" },
  { tipo: "jogo", titulo: "Partida escolhida", descricao: "Jogo ou desafio à sua escolha.", preco: "" },
];

/* ---------------- logo mark ---------------- */
function LemonMark({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="18" fill="var(--lemon)" stroke="var(--ink)" strokeWidth="2.5" />
      <path d="M20 5 L20 35 M20 20 L33 11 M20 20 L33 29 M20 20 L7 11 M20 20 L7 29" stroke="var(--sky-deep)" strokeWidth="1.6" strokeLinecap="round" opacity="0.55" />
      <circle cx="20" cy="20" r="4.2" fill="var(--cream)" stroke="var(--ink)" strokeWidth="2" />
    </svg>
  );
}

/* ---------------- spike divider (dino back) ---------------- */
function SpikeDivider() {
  const spikes = new Array(70).fill(0);
  return (
    <div className="spike-row" aria-hidden="true">
      {spikes.map((_, i) => (
        <div key={i} className={`spike ${i % 2 === 0 ? "spike-blue" : "spike-lemon"}`} />
      ))}
    </div>
  );
}

/* ---------------- auth modal ---------------- */
const SENHA_STAFF = "limonssaurinhofofo";

function AuthModal({ onAuthed, onClose }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current && inputRef.current.focus();
  }, []);

  async function handleLogin() {
    setErro("");
    if (!email.trim() || !senha) {
      setErro("Informe e-mail e senha.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: senha,
    });
    setLoading(false);
    if (error) {
      setErro("E-mail ou senha incorretos.");
      return;
    }
    onAuthed();
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="card auth-card" onClick={(e) => e.stopPropagation()}>
        <button className="close-x" onClick={onClose} aria-label="Fechar"><X size={18} /></button>
        <div className="auth-icon"><Lock size={20} /></div>
        <h2 className="card-heading" style={{ textAlign: "center" }}>Entrar como staff</h2>
        <p className="muted" style={{ textAlign: "center", marginTop: -4 }}>
          Só para você e seus moderadores.
        </p>
        <div className="form-col">
          <label className="field-label">E-mail</label>
          <input ref={inputRef} className="input" type="email" value={email}
            onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com"
            onKeyDown={(e) => e.key === "Enter" && handleLogin()} />
          <label className="field-label">Senha</label>
          <input className="input" type="password" value={senha}
            onChange={(e) => setSenha(e.target.value)} placeholder="senha"
            onKeyDown={(e) => e.key === "Enter" && handleLogin()} />
          {erro && <div className="erro-msg">{erro}</div>}
          <button className="btn btn-primary" onClick={handleLogin} disabled={loading}>
            <Check size={16} /> {loading ? "Entrando..." : "Entrar"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- generic tipo picker ---------------- */
function TipoPicker({ value, onChange }) {
  return (
    <div className="tipo-grid">
      {TIPOS.map((t) => {
        const Icon = t.icon;
        const ativo = value === t.id;
        return (
          <button
            type="button"
            key={t.id}
            className={`tipo-btn ${ativo ? "tipo-btn-ativo" : ""}`}
            onClick={() => onChange(t.id)}
          >
            <Icon size={15} /> {t.label}
          </button>
        );
      })}
    </div>
  );
}

/* ---------------- Cardápio page ---------------- */
function ItemForm({ inicial, onSave, onClose }) {
  const [tipo, setTipo] = useState(inicial?.tipo || "filme");
  const [titulo, setTitulo] = useState(inicial?.titulo || "");
  const [descricao, setDescricao] = useState(inicial?.descricao || "");
  const [preco, setPreco] = useState(inicial?.preco || "");

  function handleSubmit() {
    if (!titulo.trim()) return;
    onSave({
      ...(inicial || {}),
      id: inicial?.id || `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      tipo,
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      preco: preco.trim(),
    });
    onClose();
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="card auth-card" onClick={(e) => e.stopPropagation()}>
        <button className="close-x" onClick={onClose} aria-label="Fechar">
          <X size={18} />
        </button>
        <h2 className="card-heading">{inicial ? "Editar item" : "Novo item do cardápio"}</h2>
        <div className="form-col">
          <label className="field-label">Tipo</label>
          <TipoPicker value={tipo} onChange={setTipo} />
          <label className="field-label">Título</label>
          <input className="input" value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="ex: Filme à sua escolha" onKeyDown={(e) => e.key === "Enter" && handleSubmit()} />
          <label className="field-label">Descrição</label>
          <input className="input" value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="opcional" onKeyDown={(e) => e.key === "Enter" && handleSubmit()} />
          <label className="field-label">Preço / condição</label>
          <input className="input" value={preco} onChange={(e) => setPreco(e.target.value)} placeholder="ex: R$10, ou opcional" onKeyDown={(e) => e.key === "Enter" && handleSubmit()} />
          <button className="btn btn-primary" onClick={handleSubmit} style={{ marginTop: 4 }}>
            <Check size={16} /> Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

function CardapioPage({ staffMode }) {
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formAberto, setFormAberto] = useState(false);
  const [editando, setEditando] = useState(null);

  async function carregar() {
    setLoading(true);
    const { data, error } = await supabase
      .from("cardapio_itens")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error(error);
      setItens([]);
    } else if (data?.length) {
      setItens(data.map(({ id, tipo, titulo, descricao, preco }) => ({ id, tipo, titulo, descricao, preco })));
    } else {
      setItens([]);
    }
    setLoading(false);
  }

  useEffect(() => {
    carregar();

    const channel = supabase
      .channel("cardapio-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "cardapio_itens" }, carregar)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  async function salvarItem(item) {
    const payload = {
      tipo: item.tipo,
      titulo: item.titulo,
      descricao: item.descricao || "",
      preco: item.preco || "",
    };

    const result = item.id
      ? await supabase.from("cardapio_itens").update(payload).eq("id", item.id)
      : await supabase.from("cardapio_itens").insert(payload);

    if (result.error) {
      console.error(result.error);
      alert("Não foi possível salvar o item.");
      return;
    }
    await carregar();
  }

  async function remover(id) {
    if (!confirm("Remover este item do cardápio?")) return;
    const { error } = await supabase.from("cardapio_itens").delete().eq("id", id);
    if (error) alert("Não foi possível remover o item.");
    else await carregar();
  }

  if (loading) return <div className="empty-state">carregando cardápio...</div>;

  return (
    <div>
      <div className="page-head">
        <div>
          <h2 className="page-title">O que tem no cardápio</h2>
          <p className="muted">Peça no chat e eu coloco na fila.</p>
        </div>
        {staffMode && (
          <button className="btn btn-primary" onClick={() => { setEditando(null); setFormAberto(true); }}>
            <Plus size={16} /> Novo item
          </button>
        )}
      </div>

      {itens.length === 0 && (
        <div className="empty-state">
          cardápio vazio no momento — entre como staff para adicionar itens
        </div>
      )}

      <div className="grid-itens">
        {itens.map((item) => {
          const info = tipoInfo(item.tipo);
          const Icon = info.icon;
          return (
            <div key={item.id} className="card item-card">
              <div className="item-icon"><Icon size={20} /></div>
              <div className="item-tipo">{info.label}</div>
              <div className="item-titulo">{item.titulo}</div>
              {item.descricao && <div className="item-desc">{item.descricao}</div>}
              {item.preco && <div className="item-preco">{item.preco}</div>}
              {staffMode && (
                <div className="item-actions">
                  <button className="icon-btn" onClick={() => { setEditando(item); setFormAberto(true); }} title="Editar"><Pencil size={14} /></button>
                  <button className="icon-btn icon-btn-danger" onClick={() => remover(item.id)} title="Remover"><Trash2 size={14} /></button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {formAberto && (
        <ItemForm inicial={editando} onSave={salvarItem} onClose={() => setFormAberto(false)} />
      )}
    </div>
  );
}

/* ---------------- Fila page ---------------- */
function PedidoForm({ onAdd, onClose, proximoNumero }) {
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("filme");
  const [titulo, setTitulo] = useState("");
  const ref = useRef(null);

  useEffect(() => { ref.current && ref.current.focus(); }, []);

  function handleSubmit() {
    if (!nome.trim() || !titulo.trim()) return;
    onAdd({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      numero: proximoNumero,
      nome: nome.trim(),
      tipo,
      titulo: titulo.trim(),
      status: "pendente",
      criadoEm: Date.now(),
      concluidoEm: null,
    });
    onClose();
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="card auth-card" onClick={(e) => e.stopPropagation()}>
        <button className="close-x" onClick={onClose} aria-label="Fechar"><X size={18} /></button>
        <h2 className="card-heading">Novo pedido #{pad(proximoNumero)}</h2>
        <div className="form-col">
          <label className="field-label">Quem pediu</label>
          <input ref={ref} className="input" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="nome do chat" onKeyDown={(e) => e.key === "Enter" && handleSubmit()} />
          <label className="field-label">Tipo</label>
          <TipoPicker value={tipo} onChange={setTipo} />
          <label className="field-label">O quê</label>
          <input className="input" value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="título" onKeyDown={(e) => e.key === "Enter" && handleSubmit()} />
          <button className="btn btn-primary" onClick={handleSubmit} style={{ marginTop: 4 }}>
            <Plus size={16} /> Adicionar à fila
          </button>
        </div>
      </div>
    </div>
  );
}

function PedidoCard({ pedido, staffMode, onToggle, onDelete }) {
  const info = tipoInfo(pedido.tipo);
  const Icon = info.icon;
  const feito = pedido.status === "assistido";
  return (
    <div className={`card pedido-card ${feito ? "pedido-feito" : ""}`}>
      <div className="pedido-top">
        <span className="pedido-numero">#{pad(pedido.numero)}</span>
        <span className="pedido-tipo"><Icon size={13} /> {info.label}</span>
      </div>
      <div className="item-titulo">{pedido.titulo}</div>
      <div className="muted" style={{ fontSize: 12.5 }}>pedido de {pedido.nome}</div>
      <div className="pedido-footer">
        <span className="pedido-data">{formatData(pedido.criadoEm)}</span>
        {staffMode && (
          <div className="item-actions">
            <button className={`icon-btn ${feito ? "" : "icon-btn-confirm"}`} onClick={() => onToggle(pedido.id)} title={feito ? "Voltar para a fila" : "Marcar como assistido"}>
              {feito ? <Undo2 size={14} /> : <Check size={14} />}
            </button>
            <button className="icon-btn icon-btn-danger" onClick={() => onDelete(pedido.id)} title="Remover">
              <Trash2 size={14} />
            </button>
          </div>
        )}
        {!staffMode && feito && <span className="badge-feito">assistido</span>}
      </div>
    </div>
  );
}

function FilaPage({ staffMode }) {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formAberto, setFormAberto] = useState(false);

  async function carregar() {
    setLoading(true);
    const { data, error } = await supabase
      .from("pedidos")
      .select("*")
      .order("criado_em", { ascending: false });

    if (error) {
      console.error(error);
      setPedidos([]);
    } else {
      setPedidos(data.map(p => ({
        id: p.id,
        numero: p.numero,
        nome: p.nome,
        tipo: p.tipo,
        titulo: p.titulo,
        status: p.status,
        criadoEm: new Date(p.criado_em).getTime(),
        concluidoEm: p.concluido_em ? new Date(p.concluido_em).getTime() : null,
      })));
    }
    setLoading(false);
  }

  useEffect(() => {
    carregar();

    const channel = supabase
      .channel("pedidos-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "pedidos" }, carregar)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  async function addPedido(p) {
    const { error } = await supabase.from("pedidos").insert({
      numero: p.numero,
      nome: p.nome,
      tipo: p.tipo,
      titulo: p.titulo,
      status: "pendente",
    });
    if (error) {
      console.error(error);
      alert("Não foi possível adicionar o pedido.");
      return;
    }
    await carregar();
  }

  async function toggle(id) {
    const pedido = pedidos.find(p => p.id === id);
    if (!pedido) return;
    const feito = pedido.status === "assistido";
    const { error } = await supabase.from("pedidos").update({
      status: feito ? "pendente" : "assistido",
      concluido_em: feito ? null : new Date().toISOString(),
    }).eq("id", id);
    if (error) alert("Não foi possível atualizar o pedido.");
    else await carregar();
  }

  async function remover(id) {
    if (!confirm("Remover este pedido?")) return;
    const { error } = await supabase.from("pedidos").delete().eq("id", id);
    if (error) alert("Não foi possível remover o pedido.");
    else await carregar();
  }

  const pendentes = pedidos.filter(p => p.status === "pendente").sort((a, b) => a.criadoEm - b.criadoEm);
  const assistidos = pedidos.filter(p => p.status === "assistido").sort((a, b) => (b.concluidoEm || 0) - (a.concluidoEm || 0));
  const proximoNumero = pedidos.length ? Math.max(...pedidos.map(p => p.numero)) + 1 : 1;

  if (loading) return <div className="empty-state">carregando fila...</div>;

  return (
    <div>
      <div className="page-head">
        <div>
          <h2 className="page-title">Fila de pedidos</h2>
          <p className="muted">Acompanhe o que está pendente e o que já rolou.</p>
        </div>
        {staffMode && (
          <button className="btn btn-primary" onClick={() => setFormAberto(true)}>
            <Plus size={16} /> Novo pedido
          </button>
        )}
      </div>

      <div className="columns">
        <section className="column">
          <div className="column-head"><span className="column-dot dot-blue" /> Pendente <span className="column-count">{pendentes.length}</span></div>
          <div className="column-body">
            {pendentes.length === 0 && <div className="empty-state">fila vazia</div>}
            {pendentes.map(p => <PedidoCard key={p.id} pedido={p} staffMode={staffMode} onToggle={toggle} onDelete={remover} />)}
          </div>
        </section>
        <section className="column">
          <div className="column-head"><span className="column-dot dot-lemon" /> Assistido <span className="column-count">{assistidos.length}</span></div>
          <div className="column-body">
            {assistidos.length === 0 && <div className="empty-state">nada concluído ainda</div>}
            {assistidos.map(p => <PedidoCard key={p.id} pedido={p} staffMode={staffMode} onToggle={toggle} onDelete={remover} />)}
          </div>
        </section>
      </div>

      {formAberto && (
        <PedidoForm onAdd={addPedido} onClose={() => setFormAberto(false)} proximoNumero={proximoNumero} />
      )}
    </div>
  );
}

/* ---------------- Root ---------------- */
export default function LimonssauroApp() {
  const [pagina, setPagina] = useState("cardapio");
  const [staffMode, setStaffMode] = useState(false);
  const [dark, setDark] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setStaffMode(!!data.session);
      setAuthLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setStaffMode(!!session);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  async function sairStaff() {
    await supabase.auth.signOut();
    setStaffMode(false);
  }

  if (authLoading) return <div className="app-root"><div className="empty-state">carregando...</div></div>;

  return (
    <div className={`app-root ${dark ? "theme-dark" : ""}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@400;600;700;800&display=swap');

        .app-root {
          --lemon: #eefa3d;
          --lemon-soft: #f9fce3;
          --sky: #8fdcec;
          --sky-soft: #e4f7fb;
          --sky-deep: #1f7f96;
          --cream: #fffdf3;
          --ink: #1f3a3d;
          --ink-soft: #5c7679;
          --dot: rgba(31,58,61,0.06);
          --border-soft: rgba(31,58,61,0.18);
          --surface-tint: rgba(31,58,61,0.08);
          font-family: 'Nunito', sans-serif;
          background: var(--sky-soft);
          background-image: radial-gradient(circle at 1px 1px, var(--dot) 1px, transparent 1px);
          background-size: 20px 20px;
          color: var(--ink);
          min-height: 100vh;
          box-sizing: border-box;
          transition: background 0.2s ease, color 0.2s ease;
        }
        .app-root * { box-sizing: border-box; transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease; }

        .app-root.theme-dark {
          --lemon-soft: #333a12;
          --sky-soft: #17323a;
          --sky-deep: #5fc2dc;
          --cream: #1c333a;
          --ink: #eef6f0;
          --ink-soft: #9fbcbf;
          --dot: rgba(255,255,255,0.045);
        }
        .app-root.theme-dark .card { box-shadow: 4px 4px 0 rgba(0,0,0,0.4); }
        .app-root.theme-dark .btn-primary { color: #10262b; }
        .app-root.theme-dark .tab-btn-ativo { color: #1f3a3d; }

        .wordmark { font-family: 'Fredoka', sans-serif; font-weight: 700; margin: 0; letter-spacing: 0.2px; }

        .navbar {
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 24px; flex-wrap: wrap; gap: 12px;
          max-width: 1040px; margin: 0 auto;
        }
        @media (max-width: 420px) {
          .navbar { padding: 12px 16px; gap: 8px; justify-content: center; }
          .content { padding: 8px 16px 60px; }
        }
        .brand { display: flex; align-items: center; gap: 8px; }
        .brand .wordmark { font-size: 21px; color: var(--ink); }
        .brand-emoji { font-size: 24px; line-height: 1; }

        .tabs { display: flex; gap: 8px; background: rgba(255,255,255,0.6); padding: 4px; border-radius: 999px; }
        .tab-btn {
          font-family: 'Nunito', sans-serif; font-weight: 700; font-size: 13.5px;
          border: none; background: transparent; color: var(--ink-soft);
          padding: 8px 16px; border-radius: 999px; cursor: pointer;
        }
        .tab-btn-ativo { background: var(--lemon); color: var(--ink); }

        .auth-toggle {
          display: flex; align-items: center; gap: 8px;
        }
        .btn {
          font-family: 'Nunito', sans-serif; font-weight: 700; font-size: 13.5px;
          border: none; border-radius: 999px; padding: 9px 16px; cursor: pointer;
          display: inline-flex; align-items: center; gap: 6px;
          transition: transform 0.08s ease;
        }
        .btn:active { transform: scale(0.96); }
        .btn-primary { background: var(--sky-deep); color: var(--cream); }
        .btn-ghost { background: rgba(255,255,255,0.7); color: var(--ink); border: 1.5px solid rgba(31,58,61,0.15); }
        .btn-icon-only { padding: 9px; border-radius: 50%; }

        .spike-row { display: flex; height: 12px; max-width: 1040px; margin: 0 auto 8px; padding: 0 24px; overflow: hidden; }
        .spike { flex: 0 0 auto; width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-bottom: 10px solid var(--sky); }
        .spike-lemon { border-bottom-color: var(--lemon); }

        .content { max-width: 1040px; margin: 0 auto; padding: 8px 24px 60px; }

        .page-head { display: flex; align-items: flex-end; justify-content: space-between; flex-wrap: wrap; gap: 12px; margin-bottom: 22px; }
        .page-title { font-family: 'Fredoka', sans-serif; font-size: 24px; margin: 0 0 2px; }
        .muted { color: var(--ink-soft); font-size: 13.5px; margin: 0; }

        .card {
          background: var(--cream);
          border: 2.5px solid var(--ink);
          border-radius: 18px;
          box-shadow: 4px 4px 0 var(--sky-deep);
          padding: 16px;
          position: relative;
        }

        .grid-itens { display: grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: 18px; }
        .item-card { display: flex; flex-direction: column; gap: 4px; }
        .item-icon {
          width: 34px; height: 34px; border-radius: 10px;
          background: var(--lemon-soft); color: var(--sky-deep);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 4px;
        }
        .item-tipo { font-size: 11px; text-transform: uppercase; letter-spacing: 0.6px; font-weight: 800; color: var(--sky-deep); }
        .item-titulo { font-family: 'Fredoka', sans-serif; font-weight: 600; font-size: 16px; line-height: 1.25; }
        .item-desc { font-size: 12.5px; color: var(--ink-soft); }
        .item-preco { margin-top: 6px; display: inline-block; align-self: flex-start; background: var(--sky-soft); color: var(--sky-deep); font-weight: 800; font-size: 12px; padding: 3px 10px; border-radius: 999px; }
        .item-actions { display: flex; gap: 6px; margin-top: 10px; }

        .columns { display: grid; grid-template-columns: 1fr 1fr; gap: 22px; }
        @media (max-width: 720px) { .columns { grid-template-columns: 1fr; } }
        .column-head { font-family: 'Fredoka', sans-serif; font-weight: 600; font-size: 15px; display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
        .column-count { margin-left: auto; background: rgba(31,58,61,0.08); font-size: 11px; font-weight: 800; padding: 2px 9px; border-radius: 999px; }
        .column-dot { width: 10px; height: 10px; border-radius: 50%; }
        .dot-blue { background: var(--sky-deep); }
        .dot-lemon { background: var(--lemon); border: 1.5px solid var(--ink); }
        .column-body { display: flex; flex-direction: column; gap: 14px; }

        .pedido-card { padding-bottom: 14px; }
        .pedido-feito { opacity: 0.7; }
        .pedido-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
        .pedido-numero { font-family: 'Fredoka', sans-serif; font-weight: 700; font-size: 13px; color: var(--sky-deep); }
        .pedido-tipo { display: flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 800; text-transform: uppercase; color: var(--ink-soft); }
        .pedido-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 10px; }
        .pedido-data { font-size: 11px; color: var(--ink-soft); font-weight: 700; }
        .badge-feito { font-size: 11px; font-weight: 800; color: var(--sky-deep); background: var(--sky-soft); padding: 3px 9px; border-radius: 999px; }

        .icon-btn { width: 32px; height: 32px; border-radius: 50%; border: 2px solid var(--ink); background: transparent; color: var(--ink); display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; }
        .icon-btn-confirm:hover { background: var(--lemon); }
        .icon-btn-danger:hover { background: #f0a3a3; }

        .empty-state { font-size: 13.5px; color: var(--ink-soft); font-style: italic; padding: 20px 4px; }

        .modal-backdrop { position: fixed; inset: 0; background: rgba(20,40,42,0.45); display: flex; align-items: flex-start; justify-content: center; padding: 40px 20px; overflow-y: auto; z-index: 50; }
        .auth-card { width: 100%; max-width: 360px; max-height: 85vh; overflow-y: auto; }
        .auth-icon { width: 38px; height: 38px; border-radius: 50%; background: var(--lemon); color: var(--ink); display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; border: 2.5px solid var(--ink); }
        .card-heading { font-family: 'Fredoka', sans-serif; font-size: 18px; margin: 0 0 4px; }
        .close-x { position: absolute; top: 8px; right: 8px; background: transparent; border: none; color: var(--ink-soft); cursor: pointer; padding: 8px; }
        .form-col { display: flex; flex-direction: column; gap: 10px; margin-top: 12px; }
        .field-label { font-size: 11px; text-transform: uppercase; font-weight: 800; letter-spacing: 0.5px; color: var(--ink-soft); }
        .input { font-family: 'Nunito', sans-serif; font-size: 14px; padding: 10px 12px; border: 2px solid rgba(31,58,61,0.2); border-radius: 10px; background: var(--sky-soft); color: var(--ink); outline: none; }
        .input:focus { border-color: var(--sky-deep); }
        .erro-msg { font-size: 12.5px; color: #a12f26; font-weight: 800; background: #fbdede; border: 1.5px solid #e0a3a3; border-radius: 10px; padding: 8px 10px; }

        .tipo-grid { display: flex; flex-wrap: wrap; gap: 6px; }
        .tipo-btn { display: flex; align-items: center; gap: 5px; font-size: 12.5px; font-weight: 700; font-family: 'Nunito', sans-serif; border: 2px solid rgba(31,58,61,0.25); background: transparent; color: var(--ink); border-radius: 999px; padding: 6px 12px; cursor: pointer; }
        .tipo-btn-ativo { background: var(--ink); border-color: var(--ink); color: var(--cream); }
      `}</style>

      <div className="navbar">
        <div className="brand">
          <span className="brand-emoji" role="img" aria-label="limão e dinossauro">🍋🦕</span>
          <h1 className="wordmark">Limonssauro</h1>
        </div>
        <div className="tabs">
          <button className={`tab-btn ${pagina === "cardapio" ? "tab-btn-ativo" : ""}`} onClick={() => setPagina("cardapio")}>Cardápio</button>
          <button className={`tab-btn ${pagina === "fila" ? "tab-btn-ativo" : ""}`} onClick={() => setPagina("fila")}>Fila</button>
        </div>
        <div className="auth-toggle">
          <button
            className="btn btn-ghost btn-icon-only"
            onClick={() => setDark((d) => !d)}
            title={dark ? "Modo claro" : "Modo escuro"}
          >
            {dark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          {staffMode ? (
            <button className="btn btn-ghost" onClick={sairStaff}>
              <LogOut size={15} /> Sair
            </button>
          ) : (
            <button className="btn btn-ghost btn-icon-only" onClick={() => setShowAuth(true)} title="Entrar (staff)">
              <Lock size={15} />
            </button>
          )}
        </div>
      </div>

      <SpikeDivider />

      <div className="content">
        {pagina === "cardapio" ? <CardapioPage staffMode={staffMode} /> : <FilaPage staffMode={staffMode} />}
      </div>

      {showAuth && (
        <AuthModal
          onAuthed={() => { setStaffMode(true); setShowAuth(false); }}
          onClose={() => setShowAuth(false)}
        />
      )}
    </div>
  );
}
