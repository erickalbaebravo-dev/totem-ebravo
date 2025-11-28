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
    const res = await pool.query('SELECT id, nota, origem, created_at FROM votos ORDER BY id DESC');
    let csv = 'id,created_at,origem,nota\n';
    res.rows.forEach(r => {
      csv += `${r.id},"${r.created_at.toISOString()}","${(r.origem||'').replace(/"/g,'""')}",${r.nota}\n`;
    });
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename=votos.csv'
      },
      body: csv
    };
  } catch(err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
