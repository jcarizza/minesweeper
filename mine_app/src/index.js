import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import LoginForm from './LoginForm';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<LoginForm />, document.getElementById('root'));

// Renderizar loginform, listado de juegos y tablero todo junto e ir ocultando con flag
registerServiceWorker();
