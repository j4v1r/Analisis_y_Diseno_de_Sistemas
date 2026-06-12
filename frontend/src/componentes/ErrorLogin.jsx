import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css';

function NoRegistrado() {

    return (
        <div className="fondo">

            <div className="encabezado">

                <h1>Graficadora Online</h1>

                <h5>
                    Diagramas de Flujo Multimedia
                </h5>

            </div>

            <div className="login-card text-center">

                <h3 className="text-danger mb-4">
                    USUARIO NO REGISTRADO EN LA APLICACIÓN WEB
                </h3>

                <p>
                    El usuario o la contraseña proporcionados
                    no se encuentran registrados en el sistema.
                </p>

                <Link
                    to="/"
                    className="btn btn-primary mt-3"
                >
                    Regresa a Login para volver a intentarlo
                </Link>

            </div>

        </div>
    );
}

export default NoRegistrado;