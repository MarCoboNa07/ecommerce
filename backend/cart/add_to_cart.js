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

// Route per l'aggiunta dei prodotti al carrello
router.post('/cart/add-to-cart', token, async (req, res) => {
    const { user_id, items } = req.body; // Lettura dei dati inviati nella richiesta

    try {
        const connection = await conn.getConnection();

        // Verifica l'esistenza del carrello
        const [cart] = await query("SELECT * FROM cart WHERE user_id = ?", [user_id]);

        // Il carrello non esiste
        if (cart.length === 0) {
            // Creazione un nuovo carrello
            const totalPrice = items.price * items.productQuantity; // Calcolo del prezzo totale
            const newItems = [items]; // Dichiarazione di un array per inserire i prodotti aggiunti al carrello
            await query("INSERT INTO cart (user_id, items, totalPrice), VALUES (?, ?, ?, ?)", [user_id, JSON.stringify(items), totalPrice]); // Inserimento dei prodotti aggiunti al carrello nel database
        } else {
            // Aggiornamento di un carrello esistente
            const existingItems = JSON.parse(cart[0].items) || [];
            const existingItemsIndex = existingItems.findIndex(item => item.product_id === items.product_id);

            // Se il prodotto è nel carrello e viene aggiunto incrementa la sua quantità
            if (existingItemsIndex >= 0) {
                existingItems[existingItemsIndex].productQuantity += 1;
            } else {
                // Inserisci il prodotto nel carrello se non è presente
                existingItems.push(items);
            }

            // Calcolo del nuovo totale
            const totalPrice = existingItems.reduce((total, item) => total + (item.price * item.productQuantity), 0);

            // Aggiornamento del carrello nel database
            await query("UPDATE cart SET items = ?, totalPrice = ?, WHERE user_id = ?", [JSON.stringify(existingItems), totalPrice, user_id]);
            res.status(201).json({ cart: "Prodotto aggiunto al carrello" });
        }
    } catch (error) {
        console.error("Errore while adding to cart: ", error);
        res.status(500).json({ error: "Errore durante l'aggiunta del prodotto al carrello" });
    }
});

module.exports = router; // Esportazione della route
