const mysql = require('mysql2'); // Importazione del modulo mysql2

// COnfigurazione della connessione al database
const dbConfig = {
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'PerlA.2007_',
    database: 'ecommerce',
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
