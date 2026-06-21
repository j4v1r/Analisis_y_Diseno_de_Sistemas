import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';
import '../Login.css';

function Bienvenida({ usuario }) {
    const [diagramas, setDiagramas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const navigate = useNavigate();

    const cargarDiagramas = () => {
        setCargando(true);
        fetch('http://localhost:8080/backend/MostrarDiagramas')
            .then(res => res.json())
            .then(data => {
                setDiagramas(Array.isArray(data) ? data : []);
                setCargando(false);
            })
            .catch(() => setCargando(false));
    };

    useEffect(() => { cargarDiagramas(); }, []);

    const eliminarDiagrama = async (id, nombre) => {
        const resultado = await Swal.fire({
            title: 'Alerta',
            html: '¿Busca eliminar este ejercicio?',
            icon: 'warning',

            background: '#111827',
            color: '#f8fafc',

            showCancelButton: true,
            confirmButtonText: 'Sí',
            cancelButtonText: 'No',

            reverseButtons: true,

            customClass: {
                popup: 'swal-dark',
                title: 'swal-title',
                confirmButton: 'swal-confirm',
                cancelButton: 'swal-cancel'
            },

            buttonsStyling: false
        });

        if (!resultado.isConfirmed) return;

        fetch('http://localhost:8080/backend/EliminarDiagrama?id=' + id)
            .then(res => res.json())
            .then(data => {
                if (data.status === 'yes') {
                    setDiagramas(prev =>
                        prev.filter(d => d.id !== id));

                    Swal.fire({
                        title: 'Eliminado',
                        text: 'El ejercicio fue eliminado correctamente.',
                        icon: 'success',

                        background: '#111827',
                        color: '#f8fafc',

                        confirmButtonText: 'Aceptar',

                        customClass: {
                            popup: 'swal-dark',
                            confirmButton: 'swal-confirm'
                        },

                        buttonsStyling: false
                    });

                } else {

                    Swal.fire({
                        title: 'Error',
                        text: 'No fue posible eliminar el ejercicio.',
                        icon: 'error',

                        background: '#111827',
                        color: '#f8fafc',

                        confirmButtonText: 'Aceptar',

                        customClass: {
                            popup: 'swal-dark',
                            confirmButton: 'swal-confirm'
                        },

                        buttonsStyling: false
                    });
                }
            })
            .catch(() =>
                Swal.fire({
                    title: 'Error',
                    text: 'Error al conectar con el servidor.',
                    icon: 'error',

                    background: '#111827',
                    color: '#f8fafc',

                    confirmButtonText: 'Aceptar',

                    customClass: {
                        popup: 'swal-dark',
                        confirmButton: 'swal-confirm'
                    },

                    buttonsStyling: false
                })
            );
    };

    return (
        <div className="dashboard">

            <nav className="dash-navbar">
                <span className="marca">Graficadora <span>Online</span></span>
                <div className="usuario-badge">
                    <span>👤 <strong>{usuario || 'admin'}</strong></span>
                    <Link to="/" className="btn-cerrar">Cerrar sesión</Link>
                </div>
            </nav>

            <div className="dash-body">
                <p style={{ fontSize: '0.75rem', color: 'rgba(248,250,255,0.35)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Práctica #4 — Grupo 5CM1
                </p>
                <h2 className="dash-titulo">Panel de Diagramas</h2>
                <p className="dash-subtitulo">Gestiona tus diagramas de flujo multimedia</p>

                {/* Solo Crear y Ver */}
                <div className="acciones-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', maxWidth: 520 }}>
                    <div className="accion-card crear" onClick={() => navigate('/crear')}>
                        <span className="icono">＋</span>
                        Crear diagrama
                    </div>
                    <div className="accion-card altas" onClick={() => navigate('/graficadora')}>
                        <span className="icono">📊</span>
                        Ver diagrama
                    </div>
                </div>

                {/* Tabla */}
                <div className="tabla-seccion">
                    <div className="tabla-header">
                        <h3>Mis diagramas</h3>
                        <span style={{ fontSize: '0.78rem', color: 'rgba(248,250,255,0.35)' }}>
                            {diagramas.length} diagrama{diagramas.length !== 1 ? 's' : ''}
                        </span>
                    </div>

                    {cargando ? (
                        <p style={{ padding: '24px', color: 'rgba(248,250,255,0.4)', fontSize: '0.88rem' }}>
                            Cargando diagramas...
                        </p>
                    ) : diagramas.length === 0 ? (
                        <p style={{ padding: '24px', color: 'rgba(248,250,255,0.35)', fontSize: '0.88rem' }}>
                            No hay diagramas aún. ¡Crea el primero!
                        </p>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {diagramas.map(d => (
                                    <tr key={d.id}>
                                        <td style={{ color: 'rgba(248,250,255,0.4)' }}>#{d.id}</td>
                                        <td>{d.nombre}</td>
                                        <td>
                                            <button
                                                className="btn-tabla btn-ver"
                                                onClick={() => navigate('/graficadora?id=' + d.id)}
                                            >
                                                Ver
                                            </button>
                                            <button
                                                className="btn-tabla btn-editar"
                                                onClick={() => navigate('/editar?id=' + d.id)}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className="btn-tabla btn-eliminar"
                                                onClick={() => eliminarDiagrama(d.id, d.nombre)}
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Bienvenida;