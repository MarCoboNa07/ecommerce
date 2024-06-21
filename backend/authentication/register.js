const express = require('express'); // Importazione del modulo express
const bcrypt = require('bcrypt'); // Importazione del modulo bcrypt
const jwt = require('jsonwebtoken'); // Importazione del modulo jsonwebtoken
const { promisify } = require('util'); // Modulo util per convertire callback in promises
const crypto = require('crypto'); // Importazione del modulo crypto
const conn = require('../db_connection'); // Importazione della connessione al database

const router = express.Router(); // Inizializzazione di un oggetto router
const query = promisify(conn.query).bind(conn); // Permette di far eseguire le query del database in modo asincrono

// Funzione che genera una stringa random di 30 caratteri in funzione di user_id
function generateUserId(length) {
    return crypto.randomBytes(length)
        .toString('base64')
        .slice(0, length)
        .replace(/\+/g, '0')
        .replace(/\//g, '0')
}

// Route per la registrazione
router.post('/register', async (req, res) => {
    const { firstName, lastName, email, password, confirmPassword } = req.body; // Lettura dei dati inviati nel form

    // Verifica se le password coincidono
    if (password !== confirmPassword) {
        return res.status(400).json({ error: "Le password devono essere uguali" });
    }

    try {
        // Verifica se l'email è già registrata
        const existingUsers = await query('SELECT * FROM users WHERE email = ?', [email]);

        // Email già registrata
        if (existingUsers.length > 0) {
            return res.status(409).json({ error: 'Email già registrata' });
        }

        // Hash della password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Genera una stringa random di 30 caratteri
        const user_id = generateUserId(30);

        // Inserimento dei dati nel database
        await query('INSERT INTO users (user_id, firstName, lastName, email, password) VALUES (?, ?, ?, ?, ?)', [user_id, firstName, lastName, email, hashedPassword]);

        // Generazione del token jwt (1 ora) e del refresh token (7 giorni)
        const token = jwt.sign({ user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const refreshToken = jwt.sign({ user_id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
        
        res.status(201).json({ token, refreshToken });
    } catch (error) {
        console.error("Errore durante la registrazione: ", error);
        res.status(500).json({ error: "Errore durante la registrazione" });
    }
});

module.exports = router; // Esportazione della route
