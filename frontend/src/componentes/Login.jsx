import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Login.css';

function Login({ setUsuario }) {
    const [usuario, setUsuarioInput] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);
    const navigate = useNavigate();

    const handleLogin = () => {
        if (!usuario || !password) {
            setError('Por favor completa todos los campos.');
            return;
        }

        setCargando(true);
        setError('');

        fetch('http://localhost:8080/backend/Login?user=' + usuario + '&password=' + password)
            .then(res => res.json())
            .then(data => {
                setCargando(false);
                if (data.status === 'yes') {
                    setUsuario(usuario);
                    navigate('/bienvenida');
                } else {
                    setError('Usuario o contraseña incorrectos.');
                }
            })
            .catch(() => {
                setCargando(false);
                setError('No se pudo conectar al servidor.');
            });
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleLogin();
    };

    return (
        <div className="fondo">

            <div className="encabezado">
                <h1>Graficadora <span>Online</span></h1>
                <p>Diagramas de Flujo Multimedia</p>
            </div>

            <div className="login-card">
                <h2>Iniciar sesión</h2>
                <p className="subtitulo">Accede a tu cuenta para gestionar diagramas</p>

                <label>Usuario</label>
                <input
                    type="text"
                    placeholder="Ingresa tu usuario"
                    value={usuario}
                    onChange={e => setUsuarioInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                />

                <label>Contraseña</label>
                <input
                    type="password"
                    placeholder="Ingresa tu contraseña"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                />

                {error && (
                    <p style={{ color: '#f87171', fontSize: '0.82rem', marginTop: '12px' }}>
                        ⚠ {error}
                    </p>
                )}

                <button
                    className="btn-ingresar"
                    onClick={handleLogin}
                    disabled={cargando}
                >
                    {cargando ? 'Verificando...' : 'Ingresar'}
                </button>
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