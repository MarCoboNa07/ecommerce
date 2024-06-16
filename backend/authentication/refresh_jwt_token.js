const express = require('express'); // Importazione del modulo express
const bcrypt = require('bcrypt'); // Importazione del modulo bcrypt
const jwt = require('jsonwebtoken'); // Importazione del modulo jsonwebtoken
const { promisify } = require('util'); // Modulo util per convertire callback in promises
const conn = require('../db_connection'); // Importazione della connessione al database

const router = express.Router();
const JWT_REFRESH_SECRET = 'aUdHapMHIb482BTrZXKBUYGQHtnfa8yXr6yO0WXrT4R6QMMDOOalm2Jkc4rHBDTfAwRyG391GKI6m45YP13mMLQPXVmTDcn0Xs0gKTzNSQ0xS0qbF0z598jQzaUck7NnAUvknEPDuGF6PpvsuP0gmYACSX1hqZ3BP28wk5DcakTGINw0kdRzT6WhIaPlBJfg6RYHKELF';

router.post('/refresh-jwt-token', async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ error: "Token di refresh mancante" });
    }

    try {
        // Verifica del refresh token
        const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
        const user_id = decoded.user_id; // user_id preso dala database

        // Generazione di un nuovo token jwt
        const newToken = jwt.sign({ user_id }, JWT_REFRESH_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token: newToken });
    } catch (error) {
        console.error("Errore durante il refresh del token: ", error);
        res.status(401).json({ error: "Token di refresh non valido" });
    }
});

module.exports = router;
