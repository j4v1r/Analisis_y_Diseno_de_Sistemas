import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Login.css';

function Login({ setUsuario }) {
    const [usuario, setUsuarioInput] = useState('');
    const [password, setPassword]   = useState('');
    const [error, setError]         = useState('');
    const [cargando, setCargando]   = useState(false);
    const navigate = useNavigate();

    const handleLogin = () => {
        if (!usuario || !password) { setError('Por favor completa todos los campos.'); return; }
        setCargando(true); setError('');
        fetch('http://localhost:8080/backend/Login?user=' + usuario + '&password=' + password)
            .then(res => res.json())
            .then(data => {
                setCargando(false);
                if (data.status === 'yes') { setUsuario(usuario); navigate('/bienvenida'); }
                else { setError('Usuario o contraseña incorrectos.'); }
            })
            .catch(() => { setCargando(false); setError('No se pudo conectar al servidor.'); });
    };

    const handleKeyDown = (e) => { if (e.key === 'Enter') handleLogin(); };

    return (
        <div className="fondo">
            <div className="encabezado">
                <h1>Graficadora <span>Online</span></h1>
                <p>Diagramas de Flujo Multimedia</p>
            </div>

            <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 900, padding: '0 20px', marginTop: 40, display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap', justifyContent: 'center' }}>

                {/* ── Card de login ── */}
                <div className="login-card" style={{ marginTop: 0, flexShrink: 0 }}>
                    <h2>Iniciar sesión</h2>
                    <p className="subtitulo">Accede a tu cuenta para gestionar diagramas</p>
                    <label>Usuario</label>
                    <input type="text" placeholder="Ingresa tu usuario" value={usuario}
                        onChange={e => setUsuarioInput(e.target.value)} onKeyDown={handleKeyDown} />
                    <label>Contraseña</label>
                    <input type="password" placeholder="Ingresa tu contraseña" value={password}
                        onChange={e => setPassword(e.target.value)} onKeyDown={handleKeyDown} />
                    {error && <p style={{ color: '#f87171', fontSize: '0.82rem', marginTop: '12px' }}>⚠ {error}</p>}
                    <button className="btn-ingresar" onClick={handleLogin} disabled={cargando}>
                        {cargando ? 'Verificando...' : 'Ingresar'}
                    </button>
                </div>

                {/* ── Tabla de mejora del profesor ── */}
                <div style={{
                    flexShrink: 0, width: 340,
                    background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(96,165,250,0.18)', borderRadius: 16,
                    padding: '24px 20px', boxShadow: '0 8px 32px rgba(15,30,54,0.18)',
                }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>
                        Mejora al proyecto
                    </p>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                        <tbody>
                            <tr>
                                <td style={{ padding: '8px 10px', borderBottom: '1px solid rgba(96,165,250,0.12)', color: 'rgba(248,250,255,0.6)', verticalAlign: 'top', whiteSpace: 'nowrap', fontWeight: 600 }}>
                                    Módulo
                                </td>
                                <td style={{ padding: '8px 10px', borderBottom: '1px solid rgba(96,165,250,0.12)', color: 'rgba(248,250,255,0.85)' }}>
                                    <strong>Grafica</strong> — Crear nuevo ejercicio
                                </td>
                            </tr>
                            <tr>
                                <td style={{ padding: '8px 10px', borderBottom: '1px solid rgba(96,165,250,0.12)', color: 'rgba(248,250,255,0.6)', verticalAlign: 'top', fontWeight: 600 }}>
                                    Descripción
                                </td>
                                <td style={{ padding: '8px 10px', borderBottom: '1px solid rgba(96,165,250,0.12)', color: 'rgba(248,250,255,0.85)' }}>
                                    Se agregó la capacidad de adjuntar archivos multimedia (imágenes, audio y video) al crear un diagrama. Al visualizarlo, el archivo se muestra junto al diagrama.
                                </td>
                            </tr>
                            <tr>
                                <td style={{ padding: '8px 10px', borderBottom: '1px solid rgba(96,165,250,0.12)', color: 'rgba(248,250,255,0.6)', verticalAlign: 'top', fontWeight: 600 }}>
                                    Tecnología
                                </td>
                                <td style={{ padding: '8px 10px', borderBottom: '1px solid rgba(96,165,250,0.12)', color: 'rgba(248,250,255,0.85)' }}>
                                    Apache Commons FileUpload (SubirArchivo.java) + React FormData
                                </td>
                            </tr>
                            <tr>
                                <td style={{ padding: '8px 10px', color: 'rgba(248,250,255,0.6)', verticalAlign: 'top', fontWeight: 600 }}>
                                    Formatos
                                </td>
                                <td style={{ padding: '8px 10px', color: 'rgba(248,250,255,0.85)' }}>
                                    JPG, PNG, GIF, MP3, WAV, MP4, AVI, MOV
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>

            <div className="integrantes">
                <strong>Integrantes</strong>
                Colunga Aguilar Javier Alejandro<br />
                Hernández López Luis Ángel<br />
                Vásquez Andrés Rajiv Eduardo
            </div>
        </div>
    );
}

export default Login;