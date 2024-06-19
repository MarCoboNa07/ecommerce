const express = require('express'); // Importazione del modulo express
const bodyParser = require('body-parser'); // Importazione del modulo body-parser
const { promisify } = require('util'); // Modulo util per convertire callback in promises
const conn = require('../db_connection'); // Importazione della connessione al database
require('dotenv').config(); // Importazione modulo dotenv per l'utilizzo di variabili d'ambiente

const router = express.Router();

const query = promisify(conn.query).bind(conn);

router.post('/update-user-data', async (req, res) => {
    const { user_id, firstName, lastName, email } = req.body;

    // Verifica se tutti i campi necessari sono inseriti
    if (!user_id || !firstName || !lastName || !email) {
        return res.status(400).json({ error: "Inserisci tutti i campi" });
    }

    try {
        // Query per aggiornare i dati dell'utente
        const update_query = "UPDATE users SET (firstName, lastName, email) VALUES (?, ?, ?) WHERE user_id = ?";

        const result = await query(update_query, [firstName, lastName, email, user_id]);

        // Verifica se l'utente esiste
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Utente non trovato" });
        }

        res.json({ message: "Dati utente aggiornati con successo" });
    } catch (error) {
        res.status(500).json({ error: "Errore durante l'aggiornamento dei dati utente" });
    }   
});

module.exports = router;
