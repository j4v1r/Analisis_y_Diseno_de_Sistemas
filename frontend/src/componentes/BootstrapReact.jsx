import React from "react";
import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Login from "./Login.jsx";
import NoRegistrado from "./ErrorLogin.jsx";
import Bienvenida from "./Bienvenida.jsx";
//import Info from "./Info.jsx"

class BootstrapReact extends React.Component {

    render() {
        return (
            <div>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/bienvenida" element={<Bienvenida />} />
                    <Route path="/noregistrado" element={<NoRegistrado />} />
                </Routes>
            </div>);
    }
}
export default BootstrapReact; 