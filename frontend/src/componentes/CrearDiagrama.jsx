import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Login.css';

/* ── Tipos de nodo disponibles ── */
const TIPOS = [
    { id_tipo: 1, nombre: 'inicio',        label: 'Inicio',        color: '#22c55e', icono: '⬭' },
    { id_tipo: 2, nombre: 'fin',           label: 'Fin',           color: '#ef4444', icono: '⬭' },
    { id_tipo: 3, nombre: 'proceso',       label: 'Proceso',       color: '#2563eb', icono: '▭' },
    { id_tipo: 4, nombre: 'decision',      label: 'Decisión',      color: '#f59e0b', icono: '◇' },
    { id_tipo: 5, nombre: 'entrada_salida',label: 'Entrada/Salida',color: '#8b5cf6', icono: '▱' },
    { id_tipo: 6, nombre: 'conector',      label: 'Conector',      color: '#60a5fa', icono: '○' },
];

/* ── Renderiza un nodo en el canvas SVG ── */
function NodoCanvas({ nodo, seleccionado, onClick, onMouseDown }) {
    const { pos_x: cx, pos_y: cy, texto, id_tipo } = nodo;
    const tipo = TIPOS.find(t => t.id_tipo === id_tipo) || TIPOS[0];

    const estiloTexto = {
        fontSize: '11px', fill: '#f8faff',
        fontFamily: 'Inter, sans-serif', fontWeight: 600,
        textAnchor: 'middle', dominantBaseline: 'middle',
        pointerEvents: 'none', userSelect: 'none',
    };

    const borde = seleccionado ? { stroke: '#fff', strokeWidth: 2.5, strokeDasharray: '4,2' } : {};

    const forma = () => {
        if (id_tipo === 1 || id_tipo === 2)
            return <ellipse cx={cx} cy={cy} rx={44} ry={22} fill={tipo.color} {...borde} />;
        if (id_tipo === 3)
            return <rect x={cx-58} y={cy-24} width={116} height={48} rx={6} fill={tipo.color} {...borde} />;
        if (id_tipo === 4)
            return <polygon points={`${cx},${cy-40} ${cx+60},${cy} ${cx},${cy+40} ${cx-60},${cy}`} fill={tipo.color} {...borde} />;
        if (id_tipo === 5)
            return <polygon points={`${cx-48},${cy-22} ${cx+58},${cy-22} ${cx+48},${cy+22} ${cx-58},${cy+22}`} fill={tipo.color} {...borde} />;
        if (id_tipo === 6)
            return <circle cx={cx} cy={cy} r={20} fill={tipo.color} {...borde} />;
        return null;
    };

    return (
        <g
            style={{ cursor: 'grab' }}
            onClick={onClick}
            onMouseDown={onMouseDown}
        >
            {forma()}
            <text x={cx} y={cy} style={estiloTexto}>
                {texto.length > 14 ? texto.slice(0, 13) + '…' : texto}
            </text>
        </g>
    );
}

/* ── Componente principal ── */
function CrearDiagrama({ usuario }) {
    const navigate = useNavigate();

    const [nombre, setNombre]           = useState('');
    const [nodos, setNodos]             = useState([]);
    const [conexiones, setConexiones]   = useState([]);
    const [seleccionado, setSeleccionado] = useState(null); // índice nodo seleccionado
    const [modoConexion, setModoConexion] = useState(false);
    const [origenConexion, setOrigenConexion] = useState(null);
    const [textoNodo, setTextoNodo]     = useState('');
    const [tipoNodo, setTipoNodo]       = useState(1);
    const [etiquetaConexion, setEtiquetaConexion] = useState('');
    const [guardando, setGuardando]     = useState(false);
    const [mensaje, setMensaje]         = useState(null);

    const svgRef = useRef(null);
    const dragging = useRef(null);

    /* ── Agregar nodo al canvas ── */
    const agregarNodo = () => {
        if (!textoNodo.trim()) { alert('Escribe un texto para el nodo.'); return; }
        const nuevo = {
            id_tipo: tipoNodo,
            texto: textoNodo.trim(),
            pos_x: 120 + (nodos.length % 4) * 160,
            pos_y: 80  + Math.floor(nodos.length / 4) * 130,
        };
        setNodos(prev => [...prev, nuevo]);
        setTextoNodo('');
    };

    /* ── Eliminar nodo seleccionado ── */
    const eliminarNodo = () => {
        if (seleccionado === null) return;
        setNodos(prev => prev.filter((_, i) => i !== seleccionado));
        setConexiones(prev => prev.filter(
            c => c.origen_idx !== seleccionado && c.destino_idx !== seleccionado
        ).map(c => ({
            ...c,
            origen_idx:  c.origen_idx  > seleccionado ? c.origen_idx  - 1 : c.origen_idx,
            destino_idx: c.destino_idx > seleccionado ? c.destino_idx - 1 : c.destino_idx,
        })));
        setSeleccionado(null);
    };

    /* ── Clic en nodo ── */
    const handleClickNodo = (idx) => {
        if (modoConexion) {
            if (origenConexion === null) {
                setOrigenConexion(idx);
            } else if (origenConexion !== idx) {
                const yaExiste = conexiones.some(
                    c => c.origen_idx === origenConexion && c.destino_idx === idx
                );
                if (!yaExiste) {
                    setConexiones(prev => [...prev, {
                        origen_idx: origenConexion,
                        destino_idx: idx,
                        etiqueta: etiquetaConexion,
                    }]);
                }
                setOrigenConexion(null);
                setEtiquetaConexion('');
                setModoConexion(false);
            }
        } else {
            setSeleccionado(idx === seleccionado ? null : idx);
        }
    };

    /* ── Drag & drop de nodos ── */
const handleMouseDown = (idx, e) => {
    if (modoConexion) return;
    e.preventDefault();
    e.stopPropagation();
    dragging.current = { idx, startX: e.clientX, startY: e.clientY };

    const handleMouseMove = (ev) => {
        if (!dragging.current || dragging.current.idx === null) return;
        const dx = ev.clientX - dragging.current.startX;
        const dy = ev.clientY - dragging.current.startY;
        dragging.current.startX = ev.clientX;
        dragging.current.startY = ev.clientY;
        const currentIdx = dragging.current.idx;
        setNodos(prev => prev.map((n, i) =>
            i === currentIdx
                ? { ...n, pos_x: Math.max(60, n.pos_x + dx), pos_y: Math.max(50, n.pos_y + dy) }
                : n
        ));
    };

    const handleMouseUp = () => {
        dragging.current = null;
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
};

    /* ── Guardar en backend ── */
    const guardar = () => {
        if (!nombre.trim()) { alert('Dale un nombre al diagrama.'); return; }
        if (nodos.length < 2) { alert('Agrega al menos 2 nodos.'); return; }

        setGuardando(true);
        setMensaje(null);

        const payload = {
            nombre: nombre.trim(),
            idusuario: 1,
            nodos,
            conexiones,
        };

        fetch('http://localhost:8080/backend/CrearDiagrama', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        })
            .then(r => r.json())
            .then(data => {
                setGuardando(false);
                if (data.status === 'yes') {
                    setMensaje({ tipo: 'ok', texto: '✅ Diagrama guardado correctamente.' });
                    setTimeout(() => navigate('/bienvenida'), 1500);
                } else {
                    setMensaje({ tipo: 'error', texto: '❌ Error: ' + (data.mensaje || 'no se pudo guardar.') });
                }
            })
            .catch(() => {
                setGuardando(false);
                setMensaje({ tipo: 'error', texto: '❌ No se pudo conectar con el servidor.' });
            });
    };

    /* ── Render ── */
    return (
        <div className="dashboard">

            {/* Navbar */}
            <nav className="dash-navbar">
                <span className="marca">Graficadora <span>Online</span></span>
                <div className="usuario-badge">
                    <Link to="/bienvenida" className="btn-cerrar" style={{ marginRight: 8 }}>← Panel</Link>
                    <span>👤 <strong>{usuario || 'admin'}</strong></span>
                    <Link to="/" className="btn-cerrar">Cerrar sesión</Link>
                </div>
            </nav>

            <div className="dash-body" style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>

                {/* ── Panel izquierdo ── */}
                <div style={{ width: 240, flexShrink: 0 }}>

                    <h2 className="dash-titulo" style={{ fontSize: '1.2rem' }}>Crear Diagrama</h2>
                    <p className="dash-subtitulo">Diseña tu diagrama de flujo</p>

                    {/* Nombre */}
                    <div style={{ marginBottom: 20 }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>
                            Nombre del diagrama
                        </label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={e => setNombre(e.target.value)}
                            placeholder="Ej: Validación de dato"
                            style={{
                                width: '100%', padding: '9px 12px',
                                background: 'rgba(255,255,255,0.06)',
                                border: '1px solid rgba(96,165,250,0.22)',
                                borderRadius: 8, color: '#f8faff',
                                fontFamily: 'Inter, sans-serif', fontSize: '0.88rem', outline: 'none',
                            }}
                        />
                    </div>

                    {/* Agregar nodo */}
                    <div style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(96,165,250,0.12)',
                        borderRadius: 12, padding: 16, marginBottom: 16,
                    }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
                            Agregar nodo
                        </p>

                        <select
                            value={tipoNodo}
                            onChange={e => setTipoNodo(Number(e.target.value))}
                            style={{
                                width: '100%', padding: '8px 10px', marginBottom: 8,
                                background: 'rgba(255,255,255,0.06)',
                                border: '1px solid rgba(96,165,250,0.22)',
                                borderRadius: 8, color: '#f8faff',
                                fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', outline: 'none',
                            }}
                        >
                            {TIPOS.map(t => (
                                <option key={t.id_tipo} value={t.id_tipo} style={{ background: '#0f1e36' }}>
                                    {t.icono} {t.label}
                                </option>
                            ))}
                        </select>

                        <input
                            type="text"
                            value={textoNodo}
                            onChange={e => setTextoNodo(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && agregarNodo()}
                            placeholder="Texto del nodo"
                            style={{
                                width: '100%', padding: '8px 10px', marginBottom: 8,
                                background: 'rgba(255,255,255,0.06)',
                                border: '1px solid rgba(96,165,250,0.22)',
                                borderRadius: 8, color: '#f8faff',
                                fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', outline: 'none',
                            }}
                        />

                        <button onClick={agregarNodo} style={{
                            width: '100%', padding: '8px',
                            background: '#22c55e', border: 'none', borderRadius: 8,
                            color: '#fff', fontFamily: 'Space Grotesk, sans-serif',
                            fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
                        }}>
                            + Agregar nodo
                        </button>
                    </div>

                    {/* Conexiones */}
                    <div style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(96,165,250,0.12)',
                        borderRadius: 12, padding: 16, marginBottom: 16,
                    }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
                            Conectar nodos
                        </p>

                        <input
                            type="text"
                            value={etiquetaConexion}
                            onChange={e => setEtiquetaConexion(e.target.value)}
                            placeholder="Etiqueta (opcional, ej: Sí / No)"
                            style={{
                                width: '100%', padding: '8px 10px', marginBottom: 8,
                                background: 'rgba(255,255,255,0.06)',
                                border: '1px solid rgba(96,165,250,0.22)',
                                borderRadius: 8, color: '#f8faff',
                                fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', outline: 'none',
                            }}
                        />

                        <button
                            onClick={() => { setModoConexion(!modoConexion); setOrigenConexion(null); }}
                            style={{
                                width: '100%', padding: '8px',
                                background: modoConexion ? '#f59e0b' : '#2563eb',
                                border: 'none', borderRadius: 8,
                                color: '#fff', fontFamily: 'Space Grotesk, sans-serif',
                                fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
                            }}
                        >
                            {modoConexion
                                ? origenConexion !== null
                                    ? '🔵 Selecciona destino…'
                                    : '🟡 Selecciona origen…'
                                : '🔗 Modo conexión'}
                        </button>

                        {modoConexion && (
                            <p style={{ fontSize: '0.75rem', color: 'rgba(248,250,255,0.45)', marginTop: 6, textAlign: 'center' }}>
                                Haz clic en dos nodos para conectarlos
                            </p>
                        )}
                    </div>

                    {/* Acciones nodo seleccionado */}
                    {seleccionado !== null && !modoConexion && (
                        <div style={{
                            background: 'rgba(239,68,68,0.08)',
                            border: '1px solid rgba(239,68,68,0.2)',
                            borderRadius: 12, padding: 14, marginBottom: 16,
                        }}>
                            <p style={{ fontSize: '0.78rem', color: '#f87171', marginBottom: 8 }}>
                                Nodo seleccionado: <strong>{nodos[seleccionado]?.texto}</strong>
                            </p>
                            <button onClick={eliminarNodo} style={{
                                width: '100%', padding: '7px',
                                background: '#ef4444', border: 'none', borderRadius: 8,
                                color: '#fff', fontFamily: 'Inter, sans-serif',
                                fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer',
                            }}>
                                🗑 Eliminar nodo
                            </button>
                        </div>
                    )}

                    {/* Guardar */}
                    <button
                        onClick={guardar}
                        disabled={guardando}
                        style={{
                            width: '100%', padding: '11px',
                            background: guardando ? '#334155' : '#2563eb',
                            border: 'none', borderRadius: 10,
                            color: '#fff', fontFamily: 'Space Grotesk, sans-serif',
                            fontWeight: 700, fontSize: '0.95rem', cursor: guardando ? 'not-allowed' : 'pointer',
                        }}
                    >
                        {guardando ? 'Guardando…' : '💾 Guardar diagrama'}
                    </button>

                    {mensaje && (
                        <p style={{
                            marginTop: 10, fontSize: '0.82rem', textAlign: 'center',
                            color: mensaje.tipo === 'ok' ? '#4ade80' : '#f87171',
                        }}>
                            {mensaje.texto}
                        </p>
                    )}

                    {/* Leyenda */}
                    <div style={{ marginTop: 20 }}>
                        <p style={{ fontSize: '0.7rem', color: 'rgba(248,250,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                            Tipos de nodo
                        </p>
                        {TIPOS.map(t => (
                            <div key={t.id_tipo} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                                <span style={{ width: 10, height: 10, borderRadius: 3, background: t.color, display: 'inline-block', flexShrink: 0 }} />
                                <span style={{ fontSize: '0.78rem', color: 'rgba(248,250,255,0.5)' }}>{t.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Canvas SVG ── */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                        background: 'rgba(15,30,54,0.6)',
                        border: '1px solid rgba(96,165,250,0.12)',
                        borderRadius: 16, overflow: 'hidden',
                        minHeight: 520,
                    }}>
                        <div style={{
                            padding: '12px 18px',
                            borderBottom: '1px solid rgba(96,165,250,0.1)',
                            fontSize: '0.78rem', color: 'rgba(248,250,255,0.4)',
                            display: 'flex', justifyContent: 'space-between',
                        }}>
                            <span>Canvas — {nodos.length} nodo{nodos.length !== 1 ? 's' : ''}, {conexiones.length} conexión{conexiones.length !== 1 ? 'es' : ''}</span>
                            <span>Arrastra los nodos para moverlos</span>
                        </div>

                        {nodos.length === 0 ? (
                            <div style={{
                                display: 'flex', flexDirection: 'column',
                                alignItems: 'center', justifyContent: 'center',
                                minHeight: 460, color: 'rgba(248,250,255,0.2)',
                                fontSize: '0.88rem', gap: 10,
                            }}>
                                <span style={{ fontSize: '2.5rem' }}>🔷</span>
                                Agrega nodos desde el panel izquierdo
                            </div>
                        ) : (
                            <svg
                                ref={svgRef}
                                width="100%"
                                height="520"
                                style={{ display: 'block' }}
                            >
                                <defs>
                                    <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                                        <path d="M0,0 L0,6 L8,3 z" fill="rgba(96,165,250,0.7)" />
                                    </marker>
                                </defs>

                                {/* Conexiones */}
                                {conexiones.map((c, i) => {
                                    const o = nodos[c.origen_idx];
                                    const d = nodos[c.destino_idx];
                                    if (!o || !d) return null;
                                    const mx = (o.pos_x + d.pos_x) / 2;
                                    const my = (o.pos_y + d.pos_y) / 2;
                                    return (
                                        <g key={i}>
                                            <line
                                                x1={o.pos_x} y1={o.pos_y + 25}
                                                x2={d.pos_x} y2={d.pos_y - 25}
                                                stroke="rgba(96,165,250,0.5)"
                                                strokeWidth={2}
                                                strokeDasharray="5,3"
                                                markerEnd="url(#arrow)"
                                            />
                                            {c.etiqueta && (
                                                <text x={mx + 6} y={my} style={{
                                                    fontSize: '10px', fill: '#fbbf24',
                                                    fontFamily: 'Inter, sans-serif', fontWeight: 600,
                                                }}>
                                                    {c.etiqueta}
                                                </text>
                                            )}
                                        </g>
                                    );
                                })}

                                {/* Nodos */}
                                {nodos.map((n, i) => (
                                    <NodoCanvas
                                        key={i}
                                        nodo={n}
                                        seleccionado={seleccionado === i || origenConexion === i}
                                        onClick={() => handleClickNodo(i)}
                                        onMouseDown={(e) => handleMouseDown(i, e)}
                                    />
                                ))}
                            </svg>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default CrearDiagrama;