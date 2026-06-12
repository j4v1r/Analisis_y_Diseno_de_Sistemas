import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css';
import fondo from '../assets/fondo.jpg';
import Swal from 'sweetalert2';

function Login() {

    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');

const handleSubmit = (e) => {
    e.preventDefault();

    if (!usuario || !password) {

    Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Debe capturar usuario y contraseña'
    });

    return;
}

    if (
        usuario === 'admin' &&
        password === '1234'
    ) {

        Swal.fire({
            icon: 'success',
            title: 'Acceso concedido',
            text: 'Bienvenido al sistema',
            confirmButtonText: 'Aceptar'
        });

    } else {

        Swal.fire({
            icon: 'error',
            title: 'Acceso denegado',
            text: 'Usuario o contraseña incorrectos',
            confirmButtonText: 'Aceptar'
        });

        // Limpiar campos
        setUsuario('');
        setPassword('');
    }
};

    return (
        <div className="fondo">

            <div className="encabezado">
                <h1>Graficadora Online</h1>
                <h5>Diagramas de Flujo Multimedia</h5>

                <hr />

                <p><strong>Integrantes:</strong></p>
                <p>Colunga Aguilar Javier Alejandro</p>
                <p>Hernández López Luis Ángel </p>
                <p>Vásquez Andrés Rajiv Eduardo </p>
            </div>

            <div className="login-card">

                <h3 className="mb-4 text-center">
                    Inicio de Sesión
                </h3>

                <form onSubmit={handleSubmit}>

                    <div className="mb-3">
                        <label className="form-label">
                            Usuario
                        </label>

                        <input
                            type="text"
                            className="form-control"
                            value={usuario}
                            onChange={(e) =>
                                setUsuario(e.target.value)
                            }
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">
                            Contraseña
                        </label>

                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                    >
                        Ingresar
                    </button>

                </form>

            </div>

        </div>
    );
}

export default Login;