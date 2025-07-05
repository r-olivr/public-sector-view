// Importa as bibliotecas
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

// Inicializa o Express
const app = express();
const port = process.env.API_PORT || 4000;

// Configura middlewares
app.use(cors()); // Habilita CORS para todas as rotas
app.use(express.json()); // Permite que o servidor entenda JSON nas requisições

// Configura a conexão com o banco de dados PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// --- ROTA 1: Listar Tabelas ---
app.get('/tables', async (req, res) => {
  try {
    // Query para buscar tabelas do schema 'public' (ajuste se seu schema for outro)
    const queryResult = await pool.query(
      `SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public';`
    );
    
    // Mapeia o resultado para o formato esperado pelo frontend
    const tables = queryResult.rows.map(row => ({
      id: row.tablename,
      name: row.tablename,
      displayName: row.tablename.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), // Formatação simples
      description: `Tabela ${row.tablename}`
    }));
    
    res.json(tables);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao buscar tabelas do banco de dados.');
  }
});

// --- ROTA 2: Listar Colunas de uma Tabela ---
app.get('/tables/:tableName/columns', async (req, res) => {
    const { tableName } = req.params;
    try {
        const queryResult = await pool.query(
            `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = $1;`,
            [tableName]
        );

        const columns = queryResult.rows.map(row => ({
            id: row.column_name,
            name: row.column_name,
            displayName: row.column_name.replace(/_/g, ' '),
            type: row.data_type,
            description: `Coluna ${row.column_name}`
        }));

        res.json(columns);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao buscar colunas da tabela.');
    }
});


// --- ROTA 3: Executar a Consulta e Retornar os Dados ---
app.post('/query', async (req, res) => {
    const { tableName, columns } = req.body;

    if (!tableName || !columns || !Array.isArray(columns) || columns.length === 0) {
        return res.status(400).send('Nome da tabela e colunas são obrigatórios.');
    }

    try {
        // Validação e segurança: garante que os nomes de colunas e tabela são seguros
        const safeTableName = `"${tableName.replace(/[^a-zA-Z0-9_]/g, '')}"`;
        const safeColumns = columns.map(col => `"${col.replace(/[^a-zA-Z0-9_]/g, '')}"`).join(', ');

        const queryString = `SELECT ${safeColumns} FROM ${safeTableName} LIMIT 1000;`; // Adicionado LIMIT para segurança

        const queryResult = await pool.query(queryString);
        res.json(queryResult.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao executar a consulta.');
    }
});


// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor backend rodando na porta ${port}`);
});