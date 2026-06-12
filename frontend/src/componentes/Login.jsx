import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css';
import fondo from '../assets/fondo.jpg';
import Swal from 'sweetalert2';

class Login extends React.Component {

    constructor() {
        super();
        this.state = {
            condition: false,
            tiposuario: '',
        };
    }

    validar = (usuario, password) => {
        fetch('http://localhost:8080/Login?user=' + usuario + '&password=' + password + '')
            .then(response => response.json())
            .then(usuario => {
                if (usuario.status === "yes") {
                    if (usuario.tipo === "administrador") {
                        Swal.fire({
                            icon: 'success',
                            title: 'Acceso concedido',
                            text: 'Bienvenido al sistema',
                            confirmButtonText: 'Aceptar'
                        });
                        this.setState({
                            condition: true,
                            tiposuario: usuario.tipo
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Acceso denegado',
                            text: 'Usuario o contraseña incorrectos',
                            confirmButtonText: 'Aceptar'
                        });
                        this.setState({
                            condition: false,
                            tiposuario: ''
                        });
                    }
                }
            });
    }

    render() {

        const { condition, tiposuario } = this.state;

        if (condition && tiposuario === 'administrador') {
            return <Navigate to="/admin" />;
        }

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

                    <form>

                        <div className="mb-3">
                            <label className="form-label">
                                Usuario
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                id="user"
                                placeholder="Ingrese su usuario"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">
                                Contraseña
                            </label>

                            <input
                                placeholder="Ingrese su contraseña"
                                type="password"
                                className="form-control"
                                id="password"
                            />
                        </div>

                        <button
                            className="btn btn-primary w-100"
                            onClick={()=> this.validar(document.getElementById("user").value, document.getElementById("password").value)}
                        >
                            Ingresar
                        </button>

                    </form>

                </div>

            </div>
        );
    }

}

export default Login;