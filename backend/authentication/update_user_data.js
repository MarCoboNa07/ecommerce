const express = require('express'); // Importazione del modulo express
const bcrypt = require('bcrypt'); // Importazione del modulo bcrypt
const jwt = require('jsonwebtoken'); // Importazione del modulo jsonwebtoken
const { promisify } = require('util'); // Modulo util per convertire callback in promises
const conn = require('../db_connection'); // Importazione della connessione al database
require('dotenv').config(); // Importazione modulo dotenv per l'utilizzo di variabili d'ambiente

const router = express.Router();

const query = promisify(conn.query).bind(conn);

router.post('/update-user-data', async (req, res) => {
    const { firstName, lastName, email } = req.body;

    
});

module.exports = router;
