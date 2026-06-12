import ReactDOM from 'react-dom/client';
import Login from './componentes/Login';
import React, { useState } from 'react';
import Bienvenida from './componentes/Bienvenida';

const root = ReactDOM.createRoot(
    document.getElementById('root')
);

root.render(
    <React.StrictMode>
        <Application />
    </React.StrictMode>
);

function Application() {

    const [usuario, setUsuario] = useState(null);

    return (
        <>
            {
                usuario
                ? <Bienvenida usuario={usuario}/>
                : <Login onLogin={setUsuario}/>
            }
        </>
    );
}

export default Application;