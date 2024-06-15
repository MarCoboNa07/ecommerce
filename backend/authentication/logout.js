const express = require('express'); // Importazione del modulo express

const router = express.Router();

router.post('/logout', (req, res) => {
    res.status(200).json({ message: "Logout avvenuto con successo" });
});

module.exports = router;
