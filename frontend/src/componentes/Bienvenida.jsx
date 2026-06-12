import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function Bienvenida({ usuario }) {

    return (

        <div className="container mt-5">

            <div className="text-end mb-2">

                <Link
                    to="/"
                    className="text-danger text-decoration-none fw-bold"
                >
                    Cerrar sesión
                </Link>

            </div>

            <div className="card shadow">

                <div className="card-body">

                    <h2>
                        Bienvenido: {usuario}
                    </h2>

                    <hr />

                    <h4>
                        Crear, Altas, Bajas y Cambios de ejercicios
                    </h4>

                    <div className="mt-4">

                        <button className="btn btn-success me-2">
                            Crear
                        </button>

                        <button className="btn btn-primary me-2">
                            Altas
                        </button>

                        <button className="btn btn-warning me-2">
                            Cambios
                        </button>

                        <button className="btn btn-danger">
                            Bajas
                        </button>

                    </div>

                </div>

            </div>

        </div>

    );
}

export default Bienvenida;