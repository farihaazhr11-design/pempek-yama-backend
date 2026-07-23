const pool = require("../config/db");

// GET /api/kategori
exports.getAllKategori = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM kategori ORDER BY id ASC");
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Gagal mengambil data kategori" });
  }
};
