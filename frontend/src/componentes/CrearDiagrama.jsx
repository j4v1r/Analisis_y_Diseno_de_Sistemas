import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Login.css';

const TIPOS = [
    { id_tipo: 1, nombre: 'inicio',         label: 'Inicio',         color: '#22c55e', icono: '⬭' },
    { id_tipo: 2, nombre: 'fin',            label: 'Fin',            color: '#ef4444', icono: '⬭' },
    { id_tipo: 3, nombre: 'proceso',        label: 'Proceso',        color: '#2563eb', icono: '▭' },
    { id_tipo: 4, nombre: 'decision',       label: 'Decisión',       color: '#f59e0b', icono: '◇' },
    { id_tipo: 5, nombre: 'entrada_salida', label: 'Entrada/Salida', color: '#8b5cf6', icono: '▱' },
    { id_tipo: 6, nombre: 'conector',       label: 'Conector',       color: '#60a5fa', icono: '○' },
];

function NodoCanvas({ nodo, seleccionado, onClick, onMouseDown }) {
    const { pos_x: cx, pos_y: cy, texto, id_tipo } = nodo;
    const tipo = TIPOS.find(t => t.id_tipo === id_tipo) || TIPOS[0];
    const estiloTexto = {
        fontSize: '11px', fill: '#f8faff', fontFamily: 'Inter, sans-serif', fontWeight: 600,
        textAnchor: 'middle', dominantBaseline: 'middle', pointerEvents: 'none', userSelect: 'none',
    };
    const borde = seleccionado ? { stroke: '#fff', strokeWidth: 2.5, strokeDasharray: '4,2' } : {};
    const forma = () => {
        if (id_tipo === 1 || id_tipo === 2) return <ellipse cx={cx} cy={cy} rx={44} ry={22} fill={tipo.color} {...borde} />;
        if (id_tipo === 3) return <rect x={cx-58} y={cy-24} width={116} height={48} rx={6} fill={tipo.color} {...borde} />;
        if (id_tipo === 4) return <polygon points={`${cx},${cy-40} ${cx+60},${cy} ${cx},${cy+40} ${cx-60},${cy}`} fill={tipo.color} {...borde} />;
        if (id_tipo === 5) return <polygon points={`${cx-48},${cy-22} ${cx+58},${cy-22} ${cx+48},${cy+22} ${cx-58},${cy+22}`} fill={tipo.color} {...borde} />;
        if (id_tipo === 6) return <circle cx={cx} cy={cy} r={20} fill={tipo.color} {...borde} />;
        return null;
    };
    return (
        <g style={{ cursor: 'grab' }} onClick={onClick} onMouseDown={onMouseDown}>
            {forma()}
            <text x={cx} y={cy} style={estiloTexto}>{texto && texto.length > 14 ? texto.slice(0,13)+'…' : texto}</text>
        </g>
    );
}

function CrearDiagrama({ usuario }) {
    const navigate = useNavigate();
    const [nombre, setNombre]                   = useState('');
    const [nodos, setNodos]                     = useState([]);
    const [conexiones, setConexiones]           = useState([]);
    const [seleccionado, setSeleccionado]       = useState(null);
    const [modoConexion, setModoConexion]       = useState(false);
    const [origenConexion, setOrigenConexion]   = useState(null);
    const [textoNodo, setTextoNodo]             = useState('');
    const [tipoNodo, setTipoNodo]               = useState(1);
    const [etiquetaConexion, setEtiquetaConexion] = useState('');
    const [guardando, setGuardando]             = useState(false);
    const [mensaje, setMensaje]                 = useState(null);

    // ── Multimedia ────────────────────────────────────────────────────────
    const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
    const [previsualizacion, setPrevisualizacion]       = useState(null);
    const [tipoArchivo, setTipoArchivo]                 = useState('');
    const [subiendoArchivo, setSubiendoArchivo]         = useState(false);
    const inputFileRef = useRef(null);

    const dragging = useRef(null);

    const handleArchivoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setArchivoSeleccionado(file);
        const tipo = file.type.split('/')[0]; // 'image', 'audio', 'video'
        setTipoArchivo(tipo);
        const url = URL.createObjectURL(file);
        setPrevisualizacion(url);
    };

    const quitarArchivo = () => {
        setArchivoSeleccionado(null);
        setPrevisualizacion(null);
        setTipoArchivo('');
        if (inputFileRef.current) inputFileRef.current.value = '';
    };

    const agregarNodo = () => {
        if (!textoNodo.trim()) { alert('Escribe un texto para el nodo.'); return; }
        setNodos(prev => [...prev, {
            id_tipo: tipoNodo, texto: textoNodo.trim(),
            pos_x: 120 + (nodos.length % 4) * 160,
            pos_y: 80  + Math.floor(nodos.length / 4) * 130,
        }]);
        setTextoNodo('');
    };

    const eliminarNodo = () => {
        if (seleccionado === null) return;
        setNodos(prev => prev.filter((_, i) => i !== seleccionado));
        setConexiones(prev => prev
            .filter(c => c.origen_idx !== seleccionado && c.destino_idx !== seleccionado)
            .map(c => ({
                ...c,
                origen_idx:  c.origen_idx  > seleccionado ? c.origen_idx  - 1 : c.origen_idx,
                destino_idx: c.destino_idx > seleccionado ? c.destino_idx - 1 : c.destino_idx,
            }))
        );
        setSeleccionado(null);
    };

    const handleClickNodo = (idx) => {
        if (modoConexion) {
            if (origenConexion === null) { setOrigenConexion(idx); }
            else if (origenConexion !== idx) {
                const yaExiste = conexiones.some(c => c.origen_idx === origenConexion && c.destino_idx === idx);
                if (!yaExiste) setConexiones(prev => [...prev, { origen_idx: origenConexion, destino_idx: idx, etiqueta: etiquetaConexion }]);
                setOrigenConexion(null); setEtiquetaConexion(''); setModoConexion(false);
            }
        } else { setSeleccionado(idx === seleccionado ? null : idx); }
    };

    const handleMouseDown = (idx, e) => {
        if (modoConexion) return;
        e.preventDefault(); e.stopPropagation();
        dragging.current = { idx, startX: e.clientX, startY: e.clientY };
        const handleMouseMove = (ev) => {
            if (!dragging.current || dragging.current.idx === null) return;
            const dx = ev.clientX - dragging.current.startX;
            const dy = ev.clientY - dragging.current.startY;
            dragging.current.startX = ev.clientX; dragging.current.startY = ev.clientY;
            const currentIdx = dragging.current.idx;
            setNodos(prev => prev.map((n, i) => i === currentIdx
                ? { ...n, pos_x: Math.max(60, n.pos_x + dx), pos_y: Math.max(50, n.pos_y + dy) } : n));
        };
        const handleMouseUp = () => {
            dragging.current = null;
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };

    const guardar = async () => {
        if (!nombre.trim()) { alert('Dale un nombre al diagrama.'); return; }
        if (nodos.length < 2) { alert('Agrega al menos 2 nodos.'); return; }
        setGuardando(true); setMensaje(null);

        try {
            const resCrear = await fetch('http://localhost:8080/backend/CrearDiagrama', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre: nombre.trim(), idusuario: 1, nodos, conexiones }),
            });
            const dataCrear = await resCrear.json();
            console.log('Respuesta CrearDiagrama:', dataCrear); // ← ver en consola F12

            if (dataCrear.status !== 'yes') {
                setMensaje({ tipo: 'error', texto: '❌ Error al guardar el diagrama.' });
                setGuardando(false); return;
            }

            const idDiagrama = Number(dataCrear.id_diagrama);
            console.log('ID obtenido:', idDiagrama); // ← ver en consola F12

            if (archivoSeleccionado && idDiagrama > 0) {
                setSubiendoArchivo(true);
                const formData = new FormData();
                formData.append('archivo', archivoSeleccionado);
                formData.append('id_diagrama', String(idDiagrama));

                const resArchivo = await fetch('http://localhost:8080/backend/SubirArchivo', {
                    method: 'POST',
                    body: formData,
                });
                const dataArchivo = await resArchivo.json();
                console.log('Respuesta SubirArchivo:', dataArchivo); // ← ver en consola F12
                setSubiendoArchivo(false);

                if (dataArchivo.status !== 'yes') {
                    setMensaje({ tipo: 'error', texto: '⚠ Diagrama guardado pero el archivo no se pudo subir.' });
                    setGuardando(false); return;
                }
            }

            setMensaje({ tipo: 'ok', texto: '✅ Diagrama guardado correctamente.' });
            setTimeout(() => navigate('/bienvenida'), 1500);

        } catch (e) {
            console.error('Error:', e);
            setMensaje({ tipo: 'error', texto: '❌ No se pudo conectar con el servidor.' });
        }
        setGuardando(false);
    };

    const inputStyle = {
        width: '100%', padding: '8px 10px', marginBottom: 8,
        background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(96,165,250,0.22)',
        borderRadius: 8, color: '#f8faff', fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', outline: 'none',
    };

    return (
        <div className="dashboard">
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
                    <div style={{ marginBottom: 16 }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>
                            Nombre del diagrama
                        </label>
                        <input type="text" value={nombre} onChange={e => setNombre(e.target.value)}
                            placeholder="Ej: Validación de dato" style={inputStyle} />
                    </div>

                    {/* ── Archivo multimedia ── */}
                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(96,165,250,0.12)', borderRadius: 12, padding: 16, marginBottom: 16 }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
                            📎 Archivo multimedia
                        </p>

                        {!archivoSeleccionado ? (
                            <>
                                <p style={{ fontSize: '0.75rem', color: 'rgba(248,250,255,0.45)', marginBottom: 8 }}>
                                    Adjunta una imagen, audio o video al diagrama.
                                </p>
                                <button onClick={() => inputFileRef.current.click()} style={{
                                    width: '100%', padding: '8px', background: 'rgba(96,165,250,0.12)',
                                    border: '1px dashed rgba(96,165,250,0.4)', borderRadius: 8,
                                    color: '#60a5fa', fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', cursor: 'pointer',
                                }}>
                                    + Seleccionar archivo
                                </button>
                                <input ref={inputFileRef} type="file"
                                    accept="image/*,audio/*,video/*"
                                    onChange={handleArchivoChange}
                                    style={{ display: 'none' }} />
                                <p style={{ fontSize: '0.68rem', color: 'rgba(248,250,255,0.3)', marginTop: 6, textAlign: 'center' }}>
                                    JPG, PNG, GIF, MP3, WAV, MP4, AVI...
                                </p>
                            </>
                        ) : (
                            <div>
                                {/* Previsualización */}
                                {tipoArchivo === 'image' && (
                                    <img src={previsualizacion} alt="preview"
                                        style={{ width: '100%', borderRadius: 8, marginBottom: 8, maxHeight: 120, objectFit: 'cover' }} />
                                )}
                                {tipoArchivo === 'audio' && (
                                    <audio controls src={previsualizacion} style={{ width: '100%', marginBottom: 8 }} />
                                )}
                                {tipoArchivo === 'video' && (
                                    <video controls src={previsualizacion}
                                        style={{ width: '100%', borderRadius: 8, marginBottom: 8, maxHeight: 120 }} />
                                )}
                                <p style={{ fontSize: '0.75rem', color: '#60a5fa', marginBottom: 6, wordBreak: 'break-all' }}>
                                    📄 {archivoSeleccionado.name}
                                </p>
                                <button onClick={quitarArchivo} style={{
                                    width: '100%', padding: '6px', background: 'rgba(239,68,68,0.15)',
                                    border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8,
                                    color: '#f87171', fontSize: '0.78rem', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                                }}>
                                    ✕ Quitar archivo
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Agregar nodo */}
                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(96,165,250,0.12)', borderRadius: 12, padding: 16, marginBottom: 16 }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Agregar nodo</p>
                        <select value={tipoNodo} onChange={e => setTipoNodo(Number(e.target.value))} style={inputStyle}>
                            {TIPOS.map(t => <option key={t.id_tipo} value={t.id_tipo} style={{ background: '#0f1e36' }}>{t.icono} {t.label}</option>)}
                        </select>
                        <input type="text" value={textoNodo} onChange={e => setTextoNodo(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && agregarNodo()} placeholder="Texto del nodo" style={inputStyle} />
                        <button onClick={agregarNodo} style={{ width: '100%', padding: '8px', background: '#22c55e', border: 'none', borderRadius: 8, color: '#fff', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>
                            + Agregar nodo
                        </button>
                    </div>

                    {/* Conexiones */}
                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(96,165,250,0.12)', borderRadius: 12, padding: 16, marginBottom: 16 }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Conectar nodos</p>
                        <input type="text" value={etiquetaConexion} onChange={e => setEtiquetaConexion(e.target.value)}
                            placeholder="Etiqueta (ej: Sí / No)" style={inputStyle} />
                        <button onClick={() => { setModoConexion(!modoConexion); setOrigenConexion(null); }}
                            style={{ width: '100%', padding: '8px', background: modoConexion ? '#f59e0b' : '#2563eb', border: 'none', borderRadius: 8, color: '#fff', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>
                            {modoConexion ? (origenConexion !== null ? '🔵 Selecciona destino…' : '🟡 Selecciona origen…') : '🔗 Modo conexión'}
                        </button>
                    </div>

                    {/* Eliminar nodo */}
                    {seleccionado !== null && !modoConexion && (
                        <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, padding: 14, marginBottom: 16 }}>
                            <p style={{ fontSize: '0.78rem', color: '#f87171', marginBottom: 8 }}>Seleccionado: <strong>{nodos[seleccionado]?.texto}</strong></p>
                            <button onClick={eliminarNodo} style={{ width: '100%', padding: '7px', background: '#ef4444', border: 'none', borderRadius: 8, color: '#fff', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer' }}>
                                🗑 Eliminar nodo
                            </button>
                        </div>
                    )}

                    <button onClick={guardar} disabled={guardando || subiendoArchivo} style={{
                        width: '100%', padding: '11px', background: (guardando || subiendoArchivo) ? '#334155' : '#2563eb',
                        border: 'none', borderRadius: 10, color: '#fff', fontFamily: 'Space Grotesk, sans-serif',
                        fontWeight: 700, fontSize: '0.95rem', cursor: (guardando || subiendoArchivo) ? 'not-allowed' : 'pointer',
                    }}>
                        {subiendoArchivo ? '📤 Subiendo archivo…' : guardando ? 'Guardando…' : '💾 Guardar diagrama'}
                    </button>

                    {mensaje && (
                        <p style={{ marginTop: 10, fontSize: '0.82rem', textAlign: 'center', color: mensaje.tipo === 'ok' ? '#4ade80' : '#f87171' }}>
                            {mensaje.texto}
                        </p>
                    )}
                </div>

                {/* ── Canvas SVG ── */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ background: 'rgba(15,30,54,0.6)', border: '1px solid rgba(96,165,250,0.12)', borderRadius: 16, overflow: 'hidden', minHeight: 520 }}>
                        <div style={{ padding: '12px 18px', borderBottom: '1px solid rgba(96,165,250,0.1)', fontSize: '0.78rem', color: 'rgba(248,250,255,0.4)', display: 'flex', justifyContent: 'space-between' }}>
                            <span>Canvas — {nodos.length} nodo{nodos.length !== 1 ? 's' : ''}, {conexiones.length} conexión{conexiones.length !== 1 ? 'es' : ''}</span>
                            <span>Arrastra los nodos para moverlos</span>
                        </div>
                        {nodos.length === 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 460, color: 'rgba(248,250,255,0.2)', fontSize: '0.88rem', gap: 10 }}>
                                <span style={{ fontSize: '2.5rem' }}>🔷</span>
                                Agrega nodos desde el panel izquierdo
                            </div>
                        ) : (
                            <svg width="100%" height="520" style={{ display: 'block' }}>
                                <defs>
                                    <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                                        <path d="M0,0 L0,6 L8,3 z" fill="rgba(96,165,250,0.7)" />
                                    </marker>
                                </defs>
                                {conexiones.map((c, i) => {
                                    const o = nodos[c.origen_idx], d = nodos[c.destino_idx];
                                    if (!o || !d) return null;
                                    return (
                                        <g key={i}>
                                            <line x1={o.pos_x} y1={o.pos_y+25} x2={d.pos_x} y2={d.pos_y-25}
                                                stroke="rgba(96,165,250,0.5)" strokeWidth={2} strokeDasharray="5,3" markerEnd="url(#arrow)" />
                                            {c.etiqueta && <text x={(o.pos_x+d.pos_x)/2+6} y={(o.pos_y+d.pos_y)/2}
                                                style={{ fontSize: '10px', fill: '#fbbf24', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>{c.etiqueta}</text>}
                                        </g>
                                    );
                                })}
                                {nodos.map((n, i) => (
                                    <NodoCanvas key={i} nodo={n} seleccionado={seleccionado === i || origenConexion === i}
                                        onClick={() => handleClickNodo(i)} onMouseDown={(e) => handleMouseDown(i, e)} />
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