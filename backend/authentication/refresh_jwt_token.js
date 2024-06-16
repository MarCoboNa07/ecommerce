const express = require('express'); // Importazione del modulo express
const bcrypt = require('bcrypt'); // Importazione del modulo bcrypt
const jwt = require('jsonwebtoken'); // Importazione del modulo jsonwebtoken
const { promisify } = require('util'); // Modulo util per convertire callback in promises
const conn = require('../db_connection'); // Importazione della connessione al database

const router = express.Router();

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
        const newToken = jwt.sign({ user_id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token: newToken });
    } catch (error) {
        console.error("Errore durante il refresh del token: ", error);
        res.status(401).json({ error: "Token di refresh non valido" });
    }
});

module.exports = router;
