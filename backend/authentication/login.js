const express = require('express'); // Importazione del modulo express
const bcrypt = require('bcrypt'); // Importazione del modulo bcrypt
const jwt = require('jsonwebtoken'); // Importazione del modulo jsonwebtoken
const { promisify } = require('util'); // Modulo util per convertire callback in promises
const conn = require('../db_connection'); // Importazione della connessione al database

const router = express.Router();
const JWT_SECRET = 'UTTXiLswRerAFSrmuttC0pw9U7adGsYoSLFiWMhKSJPDHZESTpX1Jrkx4hZqWAm6EKnCOYwf9cOjnXyh9O4Nhju8ySLaIqRYy5Awie2Iy6ZphCSe3ENmp5okeC8sYoCosG4cWNaoKrnIcxwzAtJyJaNky6gaG0kM76C3r4SwP2StFub75LP7gWRO6we4glzHsRmZGFPW';
const JWT_REFRESH_SECRET = 'aUdHapMHIb482BTrZXKBUYGQHtnfa8yXr6yO0WXrT4R6QMMDOOalm2Jkc4rHBDTfAwRyG391GKI6m45YP13mMLQPXVmTDcn0Xs0gKTzNSQ0xS0qbF0z598jQzaUck7NnAUvknEPDuGF6PpvsuP0gmYACSX1hqZ3BP28wk5DcakTGINw0kdRzT6WhIaPlBJfg6RYHKELF';

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
        const token = jwt.sign({ user_id: user.user_id }, JWT_SECRET, { expiresIn: '1h' });
        const refreshToken = jwt.sign({ user_id: user.user_id }, JWT_REFRESH_SECRET, { expiresIn: '7d' });

        res.status(200).json({ token, refreshToken });
    } catch (error) {
        console.error("Errore durante il login: ", error);
        res.status(500).json({ error: "Errore durante il login" });
    }
});

module.exports = router;
