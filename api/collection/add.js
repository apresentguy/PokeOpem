const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });
  const { setId, n } = req.body || {};
  if (typeof setId !== 'string' || !Number.isInteger(n)) {
    return res.status(400).json({ error: 'bad input' });
  }
  try {
    await sql`
      INSERT INTO collection (set_id, card_n, qty) VALUES (${setId}, ${n}, 1)
      ON CONFLICT (set_id, card_n) DO UPDATE SET qty = collection.qty + 1`;
    res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'db error' });
  }
};