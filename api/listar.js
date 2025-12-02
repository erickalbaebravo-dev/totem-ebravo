import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.NEON_STRING,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  try {
    const result = await pool.query(
      "SELECT id, nota, origem, created_at FROM votos ORDER BY id DESC"
    );
    return res.status(200).json(result.rows);

  } catch (error) {
    console.error("Erro listar:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}
