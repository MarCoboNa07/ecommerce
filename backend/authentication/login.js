const express = require('express'); // Importazione del modulo express
const bcrypt = require('bcrypt'); // Importazione del modulo bcrypt
const jwt = require('jsonwebtoken'); // Importazione del modulo jsonwebtoken
const { promisify } = require('util'); // Modulo util per convertire callback in promises
const conn = require('../db_connection'); // Importazione della connessione al database
require('dotenv').config(); // Importazione modulo dotenv per l'utilizzo di variabili d'ambiente

const router = express.Router();

const query = promisify(conn.query).bind(conn);

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Verifica se l'email è registrata
        const users = await query('SELECT * FROM authentication_user WHERE email = ?', [email]);

        if (users.length === 0) {
            return res.status(401).json({ error: 'Utente non registrato' }); // Restituisce un errore se l'email non è registrata
        }

        const user = users[0];

        // Verifica se la password è corretta
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Password errata' }); // Restituisce un errore se la password è errata
        }

        // Generazione del token jwt
        const token = jwt.sign({ user_id: user.user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const refreshToken = jwt.sign({ user_id: user.user_id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

        res.status(200).json({ token, refreshToken });
    } catch (error) {
        console.error("Errore durante il login: ", error);
        res.status(500).json({ error: "Errore durante il login" });
    }
});

module.exports = router;
