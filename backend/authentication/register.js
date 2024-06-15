const express = require('express'); // Importazione del modulo express
const bcrypt = require('bcrypt'); // Importazione del modulo bcrypt
const jwt = require('jsonwebtoken'); // Importazione del modulo jsonwebtoken
const { promisify } = require('util'); // Modulo util per convertire callback in promises
const crypto = require('crypto'); // Importazione del modulo crypto
const conn = require('../db_connection'); // Importazione della connessione al database

const router = express.Router();
const JWT_SECRET = 'UTTXiLswRerAFSrmuttC0pw9U7adGsYoSLFiWMhKSJPDHZESTpX1Jrkx4hZqWAm6EKnCOYwf9cOjnXyh9O4Nhju8ySLaIqRYy5Awie2Iy6ZphCSe3ENmp5okeC8sYoCosG4cWNaoKrnIcxwzAtJyJaNky6gaG0kM76C3r4SwP2StFub75LP7gWRO6we4glzHsRmZGFPW';

const query = promisify(conn.query).bind(conn);

// Funzione che genera una stringa random di 30 caratteri in funzione di user_id
function generateUserId(length) {
    return crypto.randomBytes(length)
        .toString('base64')
        .slice(0, length)
        .replace(/\+/g, '0')
        .replace(/\//g, '0')
}

router.post('/register', async (req, res) => {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    // Verifica se le password coincidono
    if (password !== confirmPassword) {
        return res.status(400).json({ error: "Le password devono essere uguali" });
    }

    try {
        // Verifica se l'email è già registrata
        const existingUsers = await query('SELECT * FROM authentication_user WHERE email = ?', [email]);

        if (existingUsers.length > 0) {
            return res.status(409).json({ error: 'Email già registrata' }); // Restituisce un errore se l'email è già registrata
        }

        // Hash della password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Genera una stringa random di 30 caratteri
        const user_id = generateUserId(30);

        // Inserimento dei dati nel database
        await query('INSERT INTO authentication_user (user_id, firstName, lastName, email, password) VALUES (?, ?, ?, ?, ?)', [user_id, firstName, lastName, email, hashedPassword]);

        // Generazione del token jwt
        const token = jwt.sign({ user_id }, JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ token });
    } catch (error) {
        console.error("Errore durante la registrazione: ", error);
        res.status(500).json({ error: "Errore durante la registrazione" });
    }
});

// Esportazione della route
module.exports = router;
