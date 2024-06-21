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

router.get('/cart/get-cart', token, async (req, res) => {
    const user_id = req.user.user_id;

    try {
        const [cart] = await query("SELECT items, totalPrice FROM cart WHERE user_id = ?", [user_id]); // Cerca il carrello nel database

        // Il carrello non esiste
        if (cart.legth === 0) {
            return res.status(404).json({ error: "Carrello non trovato" });
        }

        res.json({ items: JSON.parse(cart[0].items), totalPrice: cart[0].totalPrice });
    } catch (error) {
        console.error("Errore durante la fetch del carrello: ", error);
        res.status(500).json({ error: "Errore durante la fetch del carrello" });
    }
});

module.exports = router; // Esportazione della route
