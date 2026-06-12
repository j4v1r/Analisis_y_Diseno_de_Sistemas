import React from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter } from 'react-router-dom';
import BootstrapReact from './componentes/BootstrapReact.jsx';

class Application extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <BootstrapReact />
            </BrowserRouter>
        );
    }
}

export default Application;

window.onload = () => {
    const rootElement = document.getElementById("root");

    console.log("Contenedor:", rootElement);

    const root = createRoot(rootElement);
    root.render(<Application />);
};