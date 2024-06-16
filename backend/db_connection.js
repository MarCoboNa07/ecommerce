const mysql = require('mysql2'); // Importazione del modulo mysql2
require('dotenv').config(); // Importazione modulo dotenv per l'utilizzo di variabili d'ambiente

// Configurazione della connessione al database
const dbConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

// Creazione della connessione al database
const conn = mysql.createConnection(dbConfig); 

// Connessione al database
conn.connect((err) => {
    if (err) { // Verifica eventuali errori di connessione al database
        console.error('Errore di connessione al database:', err);
        throw err;
    }
    console.log('Connessione al database MySQL riuscita');
});

// Esportazione della connessione
module.exports = conn;
