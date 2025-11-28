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
exports.handler = async function(event) {
  try {
    const body = JSON.parse(event.body || '{}');
    const nota = parseInt(body.nota,10);
    const origem = body.origem || null;
    if (!nota || nota < 1 || nota > 5) {
      return { statusCode: 400, body: JSON.stringify({ error: 'nota inválida' })};
    }
    const res = await pool.query(
      'INSERT INTO votos(nota, origem) VALUES($1,$2) RETURNING id, created_at',
      [nota, origem]
    );
    return { statusCode: 200, body: JSON.stringify({ ok:true, id: res.rows[0].id }) };
  } catch(err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
