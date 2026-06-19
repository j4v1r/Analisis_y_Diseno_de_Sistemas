import React from 'react';
import { Link } from 'react-router-dom';
import '../Login.css';

function CrearDiagrama({ usuario }) {
    return (
        <div className="dashboard">
            <nav className="dash-navbar">
                <span className="marca">Graficadora <span>Online</span></span>
                <div className="usuario-badge">
                    <Link to="/bienvenida" className="btn-cerrar">← Panel</Link>
                </div>
            </nav>
            <div className="dash-body">
                <h2 className="dash-titulo">Crear Diagrama</h2>
                <p className="dash-subtitulo">Funcionalidad en desarrollo</p>
            </div>
        </div>
    );
}

export default CrearDiagrama;