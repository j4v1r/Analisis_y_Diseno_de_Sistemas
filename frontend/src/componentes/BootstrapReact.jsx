import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login.jsx';
import Bienvenida from './Bienvenida.jsx';
import Graficadora from './Graficadora.jsx';
import CrearDiagrama from './CrearDiagrama.jsx';

function BootstrapReact() {
    const [usuario, setUsuario] = useState('');

    return (
        <Routes>
            <Route path="/"           element={<Login setUsuario={setUsuario} />} />
            <Route path="/bienvenida" element={<Bienvenida usuario={usuario} />} />
            <Route path="/graficadora" element={<Graficadora usuario={usuario} />} />
            <Route path="*"           element={<Navigate to="/" />} />
            <Route path="/crear" element={<CrearDiagrama usuario={usuario} />} />
        </Routes>
    );
}

export default BootstrapReact;