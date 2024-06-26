const express = require('express'); // Importazione del modulo express
const { promisify } = require('util'); // Modulo util per convertire callback in promises
const conn = require('../db_connection'); // Importazione della connessione al database
require('dotenv').config(); // Importazione modulo dotenv per l'utilizzo di variabili d'ambiente

const router = express.Router(); // Inizializzazione di un oggetto router
const query = promisify(conn.query).bind(conn); // Permette di far eseguire le query del database in modo asincrono

// Route per la ricerda dei prodotti più venduti
router.get('/bestseller', async (req, res) => {
    try {
        const sql = "SELECT * FROM products WHERE id BETWEEN 1 AND 12";
        const products = await query(sql);

        res.json(products);
    } catch (error) {
        console.error("Errore durante il recupero dei prodotti: ", error);
        res.status(500).json({ error: "Errore durante il recupero dei prodotti" });
    }
});

module.exports = router; // Esportazione della route
