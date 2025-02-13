
const path = require('node:path')
const sqlite3 = require('sqlite3').verbose();


const dbPath = path.resolve(__dirname, 'macro.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados', err);
    } else {
        console.log('Conectado ao banco de dados SQLite');
        createTable();
    }
});

function createTable() {
    const query = `
            CREATE TABLE IF NOT EXISTS macro (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                message TEXT NOT NULL,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `;

    db.run(query, (err) => {
        if (err) {
            console.error('Erro ao criar tabela', err);
        } else {
            console.log('Tabela macro criada ou já existente');
        }
    });
}

function getAllMacro(title, message) {
    db.all('SELECT * FROM macro', [], (err, rows) => {
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
            console.log(row);
        });
    })
}

function insertMacro(title, message) {
    db.run(
        'INSERT INTO macros (title, mensage, createdAt) VALUES (?, ?, ?)',
        [title, message]
    );
}

module.exports = { db, createTable, getAllMacro, insertMacro }