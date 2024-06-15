const express = require('express'); // Importazione del modulo express
const cors = require('cors'); // Importazione del modulo cors
const bodyParser = require('body-parser'); // Importazione del modulo body-parser

// Importazione delle routes
const register = require('./authentication/register');
const login = require('./authentication/login');
const logout = require('./authentication/logout');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); // Cors per l'autenticazione sicura
app.use(bodyParser.json()) // Parsing application/json

// Utilizzo delle routes
app.use('/api', register);
app.use('/api', login); 
app.use('/api', logout);

// Avvio del server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});