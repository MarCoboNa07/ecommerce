const express = require('express'); // Importazione del modulo express
const cors = require('cors'); // Importazione del modulo cors
const bodyParser = require('body-parser'); // Importazione del modulo body-parser

// Importazione delle routes
const register = require('./authentication/register');
const login = require('./authentication/login');
const getUserData = require('./authentication/get_user_data');
const logout = require('./authentication/logout');
const updateUserData = require('./authentication/update_user_data');
const search = require('./products/search');
const bestseller = require('./products/bestseller');
const addToCart = require('./cart/add_to_cart');
const getCart = require('./cart/get_cart');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Cors per l'autenticazione sicura
app.use(bodyParser.json()) // Parsing application/json

// Utilizzo delle routes
app.use('/api', register);
app.use('/api', login); 
app.use('/api', getUserData);
app.use('/api', logout);
app.use('/api', updateUserData);
app.use('/api', search);
app.use('/api', bestseller);
app.use('/api', addToCart);
app.use('/api', getCart);

// Avvio del server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
