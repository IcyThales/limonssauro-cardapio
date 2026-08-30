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
  { id: "outros", label: "Outros", icon: Sparkles },
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

/* ---------------- pixel-art lemon (decorative) ---------------- */
function PixelLemon({ size = 24, opacity = 1, style }) {
  const N = 14;
  const cx = 6.7, cy = 7, rx = 5.6, ry = 6.3;
  const pixels = [];
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const nx = (x - cx) / rx;
      const ny = (y - cy) / ry;
      const d = nx * nx + ny * ny;
      let fill = null;
      if (d <= 1) {
        const edge = d > 0.72;
        const highlight = x < 5 && y > 2 && y < 6 && (x + y) % 2 === 0;
        fill = edge ? "var(--px-rind)" : highlight ? "var(--px-hi)" : "var(--px-body)";
      }
      if (fill) pixels.push({ x, y, fill });
    }
  }
  // stem/leaf accent
  pixels.push({ x: 6, y: 0, fill: "var(--px-leaf)" });
  pixels.push({ x: 7, y: 0, fill: "var(--px-leaf)" });
  pixels.push({ x: 8, y: 1, fill: "var(--px-leaf)" });

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${N} ${N}`}
      style={{ opacity, ...style }}
      aria-hidden="true"
    >
      {pixels.map((p, i) => (
        <rect key={i} x={p.x} y={p.y} width={1} height={1} fill={p.fill} />
      ))}
    </svg>
  );
}

const ITENS_PADRAO = [
  { tipo: "filme", titulo: "Filme à sua escolha", descricao: "Você escolhe, eu assisto ao vivo.", preco: "" },
  { tipo: "serie", titulo: "1 episódio de série", descricao: "Um episódio de uma série que você indicar.", preco: "" },
  { tipo: "video", titulo: "Vídeo / clipe", preco: "" , descricao: "Vídeo do YouTube, clipe, o que quiser."},
  { tipo: "musica", titulo: "Pedido musical", descricao: "Toco ou escuto junto com o chat.", preco: "" },
  { tipo: "jogo", titulo: "Partida escolhida", descricao: "Jogo ou desafio à sua escolha.", preco: "" },
];

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
      id: inicial?.id,
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
      alert(`Não foi possível salvar o item.\n\nMotivo: ${result.error.message}`);
      return;
    }
    await carregar();
  }

  async function remover(id) {
    if (!confirm("Remover este item do cardápio?")) return;
    const { error } = await supabase.from("cardapio_itens").delete().eq("id", id);
    if (error) alert(`Não foi possível remover o item.\n\nMotivo: ${error.message}`);
    else await carregar();
  }

  if (loading) return <div className="empty-state">carregando cardápio...</div>;

  return (
    <div>
      <div className="page-head">
        <div>
          <h2 className="page-title"><PixelLemon size={22} style={{ verticalAlign: "-4px", marginRight: 6 }} />O que tem no cardápio</h2>
          <p className="muted">Os pedidos são feitos via Pix.</p>
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
      alert(`Não foi possível adicionar o pedido.\n\nMotivo: ${error.message}`);
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
    if (error) alert(`Não foi possível atualizar o pedido.\n\nMotivo: ${error.message}`);
    else await carregar();
  }

  async function remover(id) {
    if (!confirm("Remover este pedido?")) return;
    const { error } = await supabase.from("pedidos").delete().eq("id", id);
    if (error) alert(`Não foi possível remover o pedido.\n\nMotivo: ${error.message}`);
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
          <h2 className="page-title"><PixelLemon size={22} style={{ verticalAlign: "-4px", marginRight: 6 }} />Fila de pedidos</h2>
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
          --lemon: #ffd83d;
          --lemon-strong: #ffca22;
          --lemon-soft: #fff4b8;
          --gold: #d89b19;
          --gold-dark: #9f6d10;
          --sky: #39b9d5;
          --sky-soft: #d9f4f6;
          --sky-deep: #087f9d;
          --sky-dark: #075d75;
          --cream: #fffdf4;
          --cream-2: #fff7dc;
          --ink: #173b43;
          --ink-soft: #55747a;
          --bg-a: #dff8f5;
          --bg-b: #8fdcec;
          --bg-c: #48b7d0;
          --dot: rgba(10, 83, 99, 0.11);
          --border-soft: rgba(10, 83, 99, 0.2);
          --surface-tint: rgba(10, 83, 99, 0.08);
          --pill-bg: rgba(255, 253, 244, 0.78);
          --pill-ink: #17424a;
          --ghost-bg: rgba(255, 253, 244, 0.72);
          --on-primary: #fffdf4;
          --on-lemon: #173b43;
          --card-shadow: rgba(5, 67, 79, 0.22);
          --modal-bg: rgba(4, 31, 38, 0.64);
          --danger: #b93636;
          --danger-soft: #ffe0dc;
          --px-body: #ffd83d;
          --px-rind: #c68a12;
          --px-hi: #fff8c8;
          --px-leaf: #5e9a57;
          font-family: 'Nunito', sans-serif;
          background:
            radial-gradient(circle at 12% 10%, rgba(255,255,255,.38) 0 7%, transparent 25%),
            radial-gradient(circle at 88% 18%, rgba(255,255,255,.22) 0 5%, transparent 22%),
            linear-gradient(150deg, var(--bg-a), var(--bg-b) 48%, var(--bg-c));
          background-attachment: fixed;
          color: var(--ink);
          min-height: 100vh;
          box-sizing: border-box;
          position: relative;
          overflow-x: hidden;
          transition: background .25s ease, color .2s ease;
        }
        .app-root::before,
        .app-root::after {
          content: '';
          position: absolute;
          pointer-events: none;
          inset: 0;
          z-index: 0;
        }
        .app-root::before {
          opacity: .72;
          background-image:
            radial-gradient(circle at 1px 1px, var(--dot) 1.2px, transparent 1.2px),
            linear-gradient(90deg, transparent 49%, rgba(255,255,255,.06) 50%, transparent 51%);
          background-size: 22px 22px, 44px 44px;
        }
        .app-root::after {
          background: linear-gradient(180deg, rgba(255,255,255,.10), transparent 28%, rgba(0,70,88,.07));
        }
        .app-root * { box-sizing: border-box; }
        .btn, .tab-btn, .icon-btn, .tipo-btn, .close-x, .card {
          transition: background-color .16s ease, color .16s ease, border-color .16s ease, box-shadow .16s ease, transform .16s ease;
        }

        .app-root.theme-dark {
          --lemon: #ffe45f;
          --lemon-strong: #ffd329;
          --lemon-soft: #3b3717;
          --gold: #f0b52e;
          --gold-dark: #b77c16;
          --sky: #47c7df;
          --sky-soft: #123f4b;
          --sky-deep: #55d3ea;
          --sky-dark: #1aa1bd;
          --cream: #0b2934;
          --cream-2: #103744;
          --ink: #f7f4df;
          --ink-soft: #b5d1d5;
          --bg-a: #061f29;
          --bg-b: #0a3d4d;
          --bg-c: #0b5c70;
          --dot: rgba(255,255,255,.06);
          --border-soft: rgba(255,228,95,.24);
          --surface-tint: rgba(255,255,255,.08);
          --pill-bg: rgba(5, 29, 37, .72);
          --pill-ink: #eaf7f5;
          --ghost-bg: rgba(5, 29, 37, .7);
          --on-primary: #06232c;
          --on-lemon: #122f35;
          --card-shadow: rgba(0,0,0,.42);
          --modal-bg: rgba(0,0,0,.72);
          --danger: #ff8c82;
          --danger-soft: #4a2526;
          --px-body: #ffe45f;
          --px-rind: #d99c19;
          --px-hi: #fff5a8;
          --px-leaf: #73b568;
        }

        .pixel-bg-deco { position: absolute; z-index: 0; pointer-events: none; image-rendering: pixelated; filter: drop-shadow(0 3px 0 rgba(0,0,0,.05)); }
        .pixel-cluster { display: flex; align-items: center; gap: 4px; position: absolute; z-index: 0; pointer-events: none; }
        .pixel-cluster .pixel-lemon-small:nth-child(2) { transform: translateY(10px) rotate(12deg); }
        .pixel-cluster .pixel-lemon-small:nth-child(3) { transform: translateY(-4px) rotate(-18deg); }

        .wordmark {
          font-family: 'Fredoka', sans-serif; font-weight: 700; margin: 0; letter-spacing: .2px;
          color: var(--lemon);
          -webkit-text-stroke: 1.5px var(--gold-dark);
          text-shadow: 2px 2px 0 var(--gold-dark), 0 0 10px rgba(255,216,61,.16);
        }

        .navbar {
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 24px; flex-wrap: wrap; gap: 12px;
          max-width: 1040px; margin: 0 auto;
          position: relative; z-index: 3;
        }
        @media (max-width: 420px) {
          .navbar { padding: 12px 16px; gap: 8px; justify-content: center; }
          .content { padding: 8px 16px 60px; }
        }
        .brand { display: flex; align-items: center; gap: 8px; }
        .brand .wordmark { font-size: 21px; }
        .brand-emoji { font-size: 24px; line-height: 1; filter: drop-shadow(0 2px 0 rgba(0,0,0,.08)); }

        .tabs {
          display: flex; gap: 5px; background: var(--pill-bg); padding: 5px;
          border-radius: 999px; border: 2px solid var(--gold);
          box-shadow: 0 4px 0 rgba(111,76,10,.12), inset 0 1px 0 rgba(255,255,255,.5);
          backdrop-filter: blur(8px);
        }
        .tab-btn {
          font-family: 'Nunito', sans-serif; font-weight: 800; font-size: 13.5px;
          border: none; background: transparent; color: var(--pill-ink);
          padding: 8px 16px; border-radius: 999px; cursor: pointer;
        }
        .tab-btn:hover { transform: translateY(-1px); }
        .tab-btn-ativo { background: var(--lemon); color: var(--on-lemon); box-shadow: inset 0 -2px 0 rgba(137,93,0,.2); }

        .auth-toggle { display: flex; align-items: center; gap: 8px; }
        .btn {
          font-family: 'Nunito', sans-serif; font-weight: 800; font-size: 13.5px;
          border: 2px solid transparent; border-radius: 999px; padding: 9px 16px; cursor: pointer;
          display: inline-flex; align-items: center; gap: 6px;
          box-shadow: 0 3px 0 rgba(0,0,0,.08);
        }
        .btn:hover { transform: translateY(-1px); }
        .btn:active { transform: translateY(1px) scale(.98); box-shadow: none; }
        .btn-primary { background: var(--lemon); border-color: var(--gold-dark); color: var(--on-lemon); }
        .btn-primary:hover { background: var(--lemon-strong); }
        .btn-ghost { background: var(--ghost-bg); color: var(--ink); border-color: var(--border-soft); backdrop-filter: blur(7px); }
        .btn-ghost:hover { border-color: var(--gold); background: var(--pill-bg); }
        .btn-icon-only { padding: 9px; border-radius: 50%; }

        .spike-row { display: flex; height: 12px; max-width: 1040px; margin: 0 auto 12px; padding: 0 24px; overflow: hidden; position: relative; z-index: 2; }
        .spike { flex: 0 0 auto; width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-bottom: 10px solid var(--sky-deep); filter: drop-shadow(0 2px 0 rgba(0,0,0,.08)); }
        .spike-lemon { border-bottom-color: var(--lemon); }

        .content { max-width: 1040px; margin: 0 auto; padding: 8px 24px 60px; position: relative; z-index: 2; }
        .page-head { display: flex; align-items: flex-end; justify-content: space-between; flex-wrap: wrap; gap: 12px; margin-bottom: 22px; }
        .page-title { font-family: 'Fredoka', sans-serif; font-size: 24px; margin: 0 0 2px; color: var(--ink); display: flex; align-items: center; text-shadow: 1px 1px 0 rgba(255,255,255,.35); }
        .page-title svg { filter: drop-shadow(1px 1px 0 var(--gold)); }
        .muted { color: var(--ink-soft); font-size: 13.5px; margin: 0; }

        .card {
          background: linear-gradient(145deg, var(--cream), var(--cream-2));
          border: 2.5px solid var(--gold);
          border-radius: 18px;
          box-shadow: 0 7px 0 rgba(8,75,87,.10), 0 12px 24px var(--card-shadow), inset 0 1px 0 rgba(255,255,255,.45);
          padding: 16px;
          position: relative;
          color: var(--ink);
          overflow: hidden;
        }
        .card::after {
          content: '';
          position: absolute;
          width: 46px; height: 46px; right: -18px; top: -18px;
          background: var(--lemon); opacity: .12; transform: rotate(45deg);
          pointer-events: none;
        }
        .card:hover { transform: translateY(-2px); box-shadow: 0 9px 0 rgba(8,75,87,.10), 0 16px 28px var(--card-shadow), inset 0 1px 0 rgba(255,255,255,.45); }

        .grid-itens { display: grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: 18px; }
        .item-card { display: flex; flex-direction: column; gap: 4px; }
        .item-icon {
          width: 38px; height: 38px; border-radius: 11px;
          background: var(--lemon-soft); color: var(--sky-deep);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 5px; border: 2px solid rgba(216,155,25,.28);
        }
        .item-tipo { font-size: 11px; text-transform: uppercase; letter-spacing: .7px; font-weight: 800; color: var(--sky-deep); }
        .item-titulo { font-family: 'Fredoka', sans-serif; font-weight: 600; font-size: 16px; line-height: 1.25; color: var(--ink); }
        .item-desc { font-size: 12.5px; color: var(--ink-soft); }
        .item-preco { margin-top: 6px; display: inline-block; align-self: flex-start; background: var(--sky-soft); color: var(--sky-deep); font-weight: 800; font-size: 12px; padding: 4px 10px; border-radius: 999px; border: 1.5px solid rgba(8,127,157,.18); }
        .item-actions { display: flex; gap: 6px; margin-top: 10px; }

        .columns { display: grid; grid-template-columns: 1fr 1fr; gap: 22px; }
        @media (max-width: 720px) { .columns { grid-template-columns: 1fr; } }
        .column-head { font-family: 'Fredoka', sans-serif; font-weight: 600; font-size: 15px; display: flex; align-items: center; gap: 8px; margin-bottom: 12px; color: var(--ink); }
        .column-count { margin-left: auto; background: var(--surface-tint); font-size: 11px; font-weight: 800; padding: 2px 9px; border-radius: 999px; border: 1px solid var(--border-soft); }
        .column-dot { width: 10px; height: 10px; border-radius: 50%; box-shadow: 0 0 0 2px rgba(255,255,255,.35); }
        .dot-blue { background: var(--sky-deep); }
        .dot-lemon { background: var(--lemon); border: 1.5px solid var(--gold-dark); }
        .column-body { display: flex; flex-direction: column; gap: 14px; }

        .pedido-card { padding-bottom: 14px; }
        .pedido-feito { opacity: .68; filter: saturate(.75); }
        .pedido-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
        .pedido-numero { font-family: 'Fredoka', sans-serif; font-weight: 700; font-size: 13px; color: var(--sky-deep); }
        .pedido-tipo { display: flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 800; text-transform: uppercase; color: var(--ink-soft); }
        .pedido-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 10px; }
        .pedido-data { font-size: 11px; color: var(--ink-soft); font-weight: 700; }
        .badge-feito { font-size: 11px; font-weight: 800; color: var(--sky-deep); background: var(--sky-soft); padding: 3px 9px; border-radius: 999px; border: 1px solid rgba(8,127,157,.18); }

        .icon-btn { width: 32px; height: 32px; border-radius: 50%; border: 2px solid var(--border-soft); background: var(--ghost-bg); color: var(--ink); display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; }
        .icon-btn:hover { transform: translateY(-1px); border-color: var(--gold); }
        .icon-btn-confirm:hover { background: var(--lemon); color: var(--on-lemon); }
        .icon-btn-danger:hover { background: var(--danger-soft); border-color: var(--danger); color: var(--danger); }

        .empty-state { font-size: 13.5px; color: var(--ink-soft); font-style: italic; padding: 20px 4px; }

        /* Modal leve: evita backdrop-filter, que força o navegador a rasterizar/blur todo o site. */
        .modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          overflow-y: auto;
          overscroll-behavior: contain;
          background: var(--modal-bg);
          isolation: isolate;
        }
        .modal-backdrop .card {
          flex: 0 1 auto;
          width: min(100%, 360px);
          max-height: calc(100vh - 48px);
          overflow-y: auto;
          overscroll-behavior: contain;
          box-shadow: 0 10px 0 rgba(8,75,87,.10), 0 18px 40px rgba(0,0,0,.28), inset 0 1px 0 rgba(255,255,255,.45);
        }
        .modal-backdrop .card:hover { transform: none; }
        .auth-card { width: 100%; max-width: 360px; }
        .auth-icon { width: 40px; height: 40px; border-radius: 50%; background: var(--lemon); color: var(--on-lemon); display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; border: 2.5px solid var(--gold-dark); box-shadow: 0 3px 0 rgba(0,0,0,.12); }
        .card-heading { font-family: 'Fredoka', sans-serif; font-size: 18px; margin: 0 28px 4px 0; color: var(--ink); }
        .close-x { position: absolute; top: 8px; right: 8px; background: var(--ghost-bg); border: 1px solid var(--border-soft); border-radius: 50%; color: var(--ink-soft); cursor: pointer; padding: 7px; }
        .close-x:hover { color: var(--ink); border-color: var(--gold); transform: rotate(6deg); }
        .form-col { display: flex; flex-direction: column; gap: 10px; margin-top: 12px; }
        .field-label { font-size: 11px; text-transform: uppercase; font-weight: 800; letter-spacing: .5px; color: var(--ink-soft); }
        .input { font-family: 'Nunito', sans-serif; font-size: 14px; padding: 10px 12px; border: 2px solid var(--border-soft); border-radius: 10px; background: var(--sky-soft); color: var(--ink); outline: none; }
        .input::placeholder { color: var(--ink-soft); opacity: .7; }
        .input:focus { border-color: var(--gold); box-shadow: 0 0 0 3px rgba(255,216,61,.16); }
        .erro-msg { font-size: 12.5px; color: var(--danger); font-weight: 800; background: var(--danger-soft); border: 1.5px solid var(--danger); border-radius: 10px; padding: 8px 10px; }

        .tipo-grid { display: flex; flex-wrap: wrap; gap: 6px; }
        .tipo-btn { display: flex; align-items: center; gap: 5px; font-size: 12.5px; font-weight: 700; font-family: 'Nunito', sans-serif; border: 2px solid var(--border-soft); background: transparent; color: var(--ink); border-radius: 999px; padding: 6px 12px; cursor: pointer; }
        .tipo-btn:hover { border-color: var(--gold); background: var(--lemon-soft); transform: translateY(-1px); }
        .tipo-btn-ativo { background: var(--ink); border-color: var(--ink); color: var(--cream); }

        @media (max-width: 520px) {
          .modal-backdrop { padding: 14px; }
          .modal-backdrop .card { max-height: calc(100vh - 28px); }
        }

        @media (prefers-reduced-motion: reduce) {
          .app-root *, .app-root { transition: none !important; }
        }
      `}</style>

      <PixelLemon size={94} opacity={0.16} style={{ position: "absolute", top: -12, right: "4%", transform: "rotate(12deg)", zIndex: 0 }} />
      <PixelLemon size={54} opacity={0.14} style={{ position: "absolute", top: "23%", left: "3%", transform: "rotate(-18deg)", zIndex: 0 }} />
      <PixelLemon size={74} opacity={0.13} style={{ position: "absolute", top: "48%", right: "1%", transform: "rotate(22deg)", zIndex: 0 }} />
      <PixelLemon size={62} opacity={0.14} style={{ position: "absolute", bottom: "7%", left: "8%", transform: "rotate(-14deg)", zIndex: 0 }} />
      <div className="pixel-cluster" style={{ top: 116, right: "17%", opacity: .13 }}>
        <span className="pixel-lemon-small"><PixelLemon size={30} /></span>
        <span className="pixel-lemon-small"><PixelLemon size={24} /></span>
        <span className="pixel-lemon-small"><PixelLemon size={20} /></span>
      </div>
      <div className="pixel-cluster" style={{ bottom: 78, right: "29%", opacity: .11 }}>
        <span className="pixel-lemon-small"><PixelLemon size={22} /></span>
        <span className="pixel-lemon-small"><PixelLemon size={34} /></span>
      </div>

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
