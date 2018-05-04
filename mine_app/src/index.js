import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));

// Renderizar loginform, listado de juegos y tablero todo junto e ir ocultando con flag
registerServiceWorker();
