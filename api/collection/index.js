const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);

module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ error: 'method not allowed' });
  try {
    const rows = await sql`SELECT set_id, card_n, qty FROM collection`;
    const out = {};
    rows.forEach(r => {
      out[r.set_id] = out[r.set_id] || {};
      out[r.set_id][r.card_n] = r.qty;
    });
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json(out);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'db error' });
  }
};