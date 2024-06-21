const express = require('express'); // Importazione del modulo express
const { promisify } = require('util'); // Modulo util per convertire callback in promises
const conn = require('../db_connection'); // Importazione della connessione al database
require('dotenv').config(); // Importazione modulo dotenv per l'utilizzo di variabili d'ambiente

const router = express.Router(); // Inizializzazione di un oggetto router
const query = promisify(conn.query).bind(conn); // Permette di far eseguire le query del database in modo asincrono

// Route per la ricerca dei prodotti
router.get('/search', async (req, res) => {
    try {
        const searchQuery = req.query.q; // Prendi il nome del prodotto (query di ricerca) dall'url

        if (!searchQuery) {
            return res.status(400).json({ error: "Il parametro di ricerca è obbligatorio" });
        }

        // Ricerca dei prodotti nel database
        const sql = "SELECT * FROM products WHERE name LIKE ?";
        const products = await query(sql, [`%${searchQuery}%`]);

        res.json(products);
    } catch (error) {
        console.error("Errore durante il recupero dei prodotti: ", error);
        res.status(500).json({ error: "Errore durante il recupero dei prodotti" });
    }
});

module.exports = router; // Esportazione della route
