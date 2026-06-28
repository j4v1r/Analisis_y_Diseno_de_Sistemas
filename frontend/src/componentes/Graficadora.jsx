import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../Login.css';

function useQuery() { return new URLSearchParams(useLocation().search); }

function NodoSVG({ nodo, offsetX, offsetY }) {
    const cx = nodo.pos_x + offsetX, cy = nodo.pos_y + offsetY;
    const tipo = nodo.tipo_nombre || '';
    const estiloTexto = { fontSize: '11px', fill: '#f8faff', fontFamily: 'Inter, sans-serif', fontWeight: 600, textAnchor: 'middle', dominantBaseline: 'middle', pointerEvents: 'none', userSelect: 'none' };
    if (tipo === 'inicio') return <g><ellipse cx={cx} cy={cy} rx={44} ry={22} fill="#22c55e" stroke="#16a34a" strokeWidth={2} /><text x={cx} y={cy} style={estiloTexto}>{nodo.texto}</text></g>;
    if (tipo === 'fin')    return <g><ellipse cx={cx} cy={cy} rx={44} ry={22} fill="#ef4444" stroke="#dc2626" strokeWidth={2} /><text x={cx} y={cy} style={estiloTexto}>{nodo.texto}</text></g>;
    if (tipo === 'proceso') return <g><rect x={cx-58} y={cy-24} width={116} height={48} rx={6} fill="#2563eb" stroke="#1d4ed8" strokeWidth={2} /><text x={cx} y={cy} style={estiloTexto}>{nodo.texto}</text></g>;
    if (tipo === 'decision') return <g><polygon points={`${cx},${cy-40} ${cx+60},${cy} ${cx},${cy+40} ${cx-60},${cy}`} fill="#f59e0b" stroke="#d97706" strokeWidth={2} /><text x={cx} y={cy} style={{ ...estiloTexto, fontSize: '10px' }}>{nodo.texto}</text></g>;
    if (tipo === 'entrada_salida') return <g><polygon points={`${cx-48},${cy-22} ${cx+58},${cy-22} ${cx+48},${cy+22} ${cx-58},${cy+22}`} fill="#8b5cf6" stroke="#7c3aed" strokeWidth={2} /><text x={cx} y={cy} style={estiloTexto}>{nodo.texto}</text></g>;
    if (tipo === 'conector') return <g><circle cx={cx} cy={cy} r={20} fill="#60a5fa" stroke="#3b82f6" strokeWidth={2} /><text x={cx} y={cy} style={{ ...estiloTexto, fontSize: '10px' }}>{nodo.texto}</text></g>;
    return null;
}

function Conexion({ conexion, nodos, offsetX, offsetY }) {
    const origen  = nodos.find(n => n.idnodo === conexion.id_origen);
    const destino = nodos.find(n => n.idnodo === conexion.id_destino);
    if (!origen || !destino) return null;
    const x1 = origen.pos_x+offsetX, y1 = origen.pos_y+offsetY+26;
    const x2 = destino.pos_x+offsetX, y2 = destino.pos_y+offsetY-26;
    return (
        <g>
            <defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="rgba(96,165,250,0.7)" /></marker></defs>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(96,165,250,0.5)" strokeWidth={2} strokeDasharray="5,3" markerEnd="url(#arrow)" />
            {conexion.etiqueta && <text x={(x1+x2)/2+6} y={(y1+y2)/2} style={{ fontSize: '10px', fill: '#fbbf24', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>{conexion.etiqueta}</text>}
        </g>
    );
}

// ── Componente para mostrar el archivo multimedia ──
function VisorMultimedia({ url }) {
    if (!url) return null;
    const ext = url.split('.').pop().toLowerCase();
    const esImagen = ['jpg','jpeg','png','gif','bmp','webp'].includes(ext);
    const esAudio  = ['mp3','wav','ogg'].includes(ext);
    const esVideo  = ['mp4','avi','mov','webm'].includes(ext);

    return (
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(96,165,250,0.12)', borderRadius: 16, padding: 20, marginTop: 0 }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>
                📎 Archivo multimedia del diagrama
            </p>
            {esImagen && <img src={url} alt="multimedia" style={{ width: '100%', borderRadius: 10, maxHeight: 340, objectFit: 'contain', background: 'rgba(0,0,0,0.2)' }} />}
            {esAudio  && <audio controls src={url} style={{ width: '100%' }} />}
            {esVideo  && <video controls src={url} style={{ width: '100%', borderRadius: 10, maxHeight: 340 }} />}
            {!esImagen && !esAudio && !esVideo && (
                <a href={url} target="_blank" rel="noreferrer" style={{ color: '#60a5fa', fontSize: '0.88rem' }}>
                    📄 Ver archivo adjunto
                </a>
            )}
        </div>
    );
}

function Graficadora({ usuario }) {
    const query   = useQuery();
    const idParam = query.get('id');

    const [diagramas, setDiagramas]           = useState([]);
    const [idSeleccionado, setIdSeleccionado] = useState(idParam || '');
    const [diagrama, setDiagrama]             = useState(null);
    const [cargando, setCargando]             = useState(false);
    const [error, setError]                   = useState('');
    const [urlArchivo, setUrlArchivo]         = useState('');

    useEffect(() => {
        fetch('http://localhost:8080/backend/MostrarDiagramas')
            .then(r => r.json()).then(data => setDiagramas(Array.isArray(data) ? data : []))
            .catch(() => {});
    }, []);

    useEffect(() => { if (idParam) cargarDiagrama(idParam); }, [idParam]);

    const cargarDiagrama = (id) => {
        if (!id) return;
        setCargando(true); setError(''); setDiagrama(null); setUrlArchivo('');
        fetch('http://localhost:8080/backend/MostrarDiagrama?id=' + id)
            .then(r => r.json())
            .then(data => {
                setCargando(false);
                if (data && data.nodos) {
                    setDiagrama(data);
                    if (data.url_archivo) setUrlArchivo(data.url_archivo);
                } else { setError('No se pudo cargar el diagrama.'); }
            })
            .catch(() => { setCargando(false); setError('Error al conectar con el servidor.'); });
    };

    const offsetX = 80, offsetY = 60;
    const canvasAncho = diagrama ? Math.max(...diagrama.nodos.map(n => n.pos_x)) + offsetX + 140 : 600;
    const canvasAlto  = diagrama ? Math.max(...diagrama.nodos.map(n => n.pos_y)) + offsetY + 120 : 420;

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

            <div className="dash-body">
                <p style={{ fontSize: '0.75rem', color: 'rgba(248,250,255,0.35)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Módulo de visualización</p>
                <h2 className="dash-titulo">Graficadora de Diagramas</h2>
                <p className="dash-subtitulo">Selecciona un diagrama para visualizarlo</p>

                <div style={{ display: 'flex', gap: 12, marginBottom: 28, alignItems: 'center', flexWrap: 'wrap' }}>
                    <select value={idSeleccionado} onChange={e => setIdSeleccionado(e.target.value)}
                        style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(96,165,250,0.22)', borderRadius: 10, color: '#f8faff', fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', minWidth: 220, outline: 'none' }}>
                        <option value="" style={{ background: '#0f1e36' }}>— Selecciona un diagrama —</option>
                        {diagramas.map(d => <option key={d.id} value={d.id} style={{ background: '#0f1e36' }}>#{d.id} — {d.nombre}</option>)}
                    </select>
                    <button className="btn-ingresar" style={{ width: 'auto', padding: '10px 24px', marginTop: 0 }}
                        onClick={() => cargarDiagrama(idSeleccionado)} disabled={!idSeleccionado || cargando}>
                        {cargando ? 'Cargando...' : 'Visualizar'}
                    </button>
                </div>

                {/* Layout: diagrama a la izquierda, multimedia a la derecha */}
                <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>

                    {/* Canvas del diagrama */}
                    <div style={{ flex: 1, minWidth: 300 }}>
                        <div className="grafica-panel">
                            <h3>{diagrama ? `📊 ${diagrama.nombre}` : 'Canvas del diagrama'}</h3>
                            <div className="canvas-area" style={{ minHeight: canvasAlto + 'px', overflowX: 'auto', overflowY: 'auto' }}>
                                {!diagrama && !cargando && !error && <div className="empty-canvas"><span>🔷</span>Selecciona un diagrama para visualizarlo aquí</div>}
                                {cargando && <div className="empty-canvas"><span>⏳</span>Cargando diagrama...</div>}
                                {error && <div className="empty-canvas" style={{ color: '#f87171' }}><span>⚠️</span>{error}</div>}
                                {diagrama && (
                                    <svg width={canvasAncho} height={canvasAlto} style={{ display: 'block' }}>
                                        {diagrama.conexiones && diagrama.conexiones.map((c, i) => (
                                            <Conexion key={i} conexion={c} nodos={diagrama.nodos} offsetX={offsetX} offsetY={offsetY} />
                                        ))}
                                        {diagrama.nodos.map(n => <NodoSVG key={n.idnodo} nodo={n} offsetX={offsetX} offsetY={offsetY} />)}
                                    </svg>
                                )}
                            </div>
                            <div style={{ marginTop: 16, display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: '0.75rem', color: 'rgba(248,250,255,0.45)' }}>
                                {[{color:'#22c55e',label:'Inicio'},{color:'#ef4444',label:'Fin'},{color:'#2563eb',label:'Proceso'},
                                  {color:'#f59e0b',label:'Decisión'},{color:'#8b5cf6',label:'Entrada/Salida'},{color:'#60a5fa',label:'Conector'}]
                                .map(item => (
                                    <span key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                        <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 3, background: item.color }} />
                                        {item.label}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Panel multimedia — solo aparece si hay archivo */}
                    {urlArchivo && (
                        <div style={{ width: 320, flexShrink: 0 }}>
                            <VisorMultimedia url={urlArchivo} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Graficadora;