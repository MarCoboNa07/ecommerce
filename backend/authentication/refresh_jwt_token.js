const express = require('express'); // Importazione del modulo express
const jwt = require('jsonwebtoken'); // Importazione del modulo jsonwebtoken

const router = express.Router(); // Inizializzazione di un oggetto router

// Route per la generazione del refresh token
router.post('/refresh-jwt-token', async (req, res) => {
    const { refreshToken } = req.body; // Leggi il token dai dati inviati nella richiesta

    // Token mancante nella richiesta
    if (!refreshToken) {
        return res.status(401).json({ error: "Token di refresh non trovato" });
    }

    try {
        // Verifica del refresh token
        const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
        const user_id = decoded.user_id; // user_id preso dal database

        // Generazione di un nuovo token jwt
        const newToken = jwt.sign({ user_id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token: newToken });
    } catch (error) {
        console.error("Errore durante il refresh del token: ", error);
        res.status(401).json({ error: "Token di refresh non valido" });
    }
});

module.exports = router; // Esportazione della route
