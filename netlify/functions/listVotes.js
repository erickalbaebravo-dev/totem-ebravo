const { Pool } = require('pg');
const connectionString = process.env.NETLIFY_DATABASE_URL;
let pool = global._pgPool;
if (!pool) {
  pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });
  global._pgPool = pool;
}
exports.handler = async function() {
  try {
    const res = await pool.query('SELECT id, nota, origem, created_at FROM votos ORDER BY id DESC LIMIT 1000');
    return { statusCode: 200, body: JSON.stringify(res.rows) };
  } catch(err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
