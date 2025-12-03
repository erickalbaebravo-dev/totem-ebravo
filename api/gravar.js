import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.NEON_STRING,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { nota, origem } = req.body;

    if (!nota || !origem) {
      return res.status(400).json({ error: "Dados incompletos" });
    }

    await pool.query(
      "INSERT INTO votos (nota, origem) VALUES ($1, $2)"    );
    await pool.query(q, [nota, origem]);
    
    return res.status(200).json({ ok: true });

  } catch (error) {
    console.error("Erro gravar:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}
