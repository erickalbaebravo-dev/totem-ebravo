import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.NEON_STRING,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  try {
    const result = await pool.query(
      "SELECT id, nota, origem, created_at FROM votos ORDER BY id"
    );

    let csv = "id,nota,origem,created_at\n";
    result.rows.forEach(r => {
      csv += `${r.id},${r.nota},${r.origem},${r.created_at}\n`;
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=votos.csv");

    return res.status(200).send(csv);

  } catch (error) {
    console.error("Erro export:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}
