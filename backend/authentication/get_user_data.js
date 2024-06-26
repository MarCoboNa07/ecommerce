const express = require('express'); // Importazione del modulo express
const jwt = require('jsonwebtoken'); // Importazione del modulo jsonwebtoken
const { promisify } = require('util'); // Modulo util per convertire callback in promises
const conn = require('../db_connection'); // Importazione della connessione al database
require('dotenv').config(); // Importazione modulo dotenv per l'utilizzo di variabili d'ambiente

const router = express.Router(); // Inizializzazione di un oggetto router
const query = promisify(conn.query).bind(conn); // Permette di far eseguire le query del database in modo asincrono

// Funzione per la verifica del token jwt
function token(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.sendStatus(401); // Se il token non esiste l'utente non è autenticato
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
}

// Route per la ricerca dei dati utente nel database
router.get('/user', token, async (req, res) => {
    try {
        const user_id = req.user.user_id; // Ottieni l'id dal token jwt

        // Cerca l'utente in base allo user_id
        const sql = 'SELECT * FROM users WHERE user_id = ?';
        const userData = await query(sql, [user_id]);

        // Nessun utente trovato
        if (userData.length === 0) {
            return res.status(404).json({ error: 'Utente non trovato' });
        }

        // Rimuovi eventuali campi sensibili o non necessari prima di inviare i dati al client
        const { password, ...userWithoutPassword } = userData[0];
        res.json(userWithoutPassword);
    } catch (error) {
        console.error('Failed to fetch user data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router; // Esportazione della route
