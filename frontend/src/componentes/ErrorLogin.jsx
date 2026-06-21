import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Login.css';

function ErrorLogin() {

    const navigate = useNavigate();

    return (
        <div className="fondo">

            {/* Encabezado */}
            <div className="encabezado">
                <h1>Graficadora <span>Online</span></h1>
                <p>Diagramas de Flujo Multimedia</p>
            </div>

            {/* Tarjeta de error */}
            <div className="login-card">

                <h2
                    style={{
                        color: '#ef4444',
                        textAlign: 'center'
                    }}
                >
                    Acceso denegado
                </h2>

                <p
                    className="subtitulo"
                    style={{
                        textAlign: 'center',
                        marginBottom: '25px'
                    }}
                >
                    El usuario o la contraseña proporcionados
                    no se encuentran registrados en el sistema.
                </p>

                <button
                    className="btn-ingresar"
                    onClick={() => navigate('/')}
                >
                    Volver al Login
                </button>

            </div>

            {/* Integrantes */}
            <div className="integrantes">
                <strong>Integrantes</strong>
                <br />
                Colunga Aguilar Javier Alejandro
                <br />
                Hernández López Luis Ángel
                <br />
                Vásquez Andrés Rajiv Eduardo
            </div>

        </div>
    );
}

export default ErrorLogin;