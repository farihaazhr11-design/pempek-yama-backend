const pool = require("../config/db");
const fs = require("fs");
const path = require("path");

// GET /api/produk
exports.getAllProduk = async (req, res) => {
  try {
    const { kategori_id } = req.query;
    let query = `
      SELECT p.*, k.nama_kategori
      FROM produk p
      JOIN kategori k ON p.kategori_id = k.id
    `;
    const params = [];
    if (kategori_id) {
      query += " WHERE p.kategori_id = ?";
      params.push(kategori_id);
    }
      query += " ORDER BY p.kategori_id ASC, p.id ASC";

    const [rows] = await pool.query(query, params);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Gagal mengambil data produk" });
  }
};

// GET /api/produk/:id
exports.getProdukById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      `SELECT p.*, k.nama_kategori
       FROM produk p
       JOIN kategori k ON p.kategori_id = k.id
       WHERE p.id = ?`,
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Produk tidak ditemukan" });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Gagal mengambil detail produk" });
  }
};

// POST /api/produk
exports.createProduk = async (req, res) => {
  try {
    const { kategori_id, nama_produk, harga, deskripsi, } = req.body;
    const gambar = req.file ? req.file.filename : null;

    if (!kategori_id || !nama_produk || !harga) {
      return res.status(400).json({ success: false, message: "Field wajib belum lengkap" });
    }

    const [result] = await pool.query(
      `INSERT INTO produk (kategori_id, nama_produk, harga, deskripsi, gambar,)
       VALUES (?, ?, ?, ?, ?)`,
      [kategori_id, nama_produk, harga, deskripsi || null, gambar]
    );

    res.status(201).json({ success: true, message: "Produk berhasil ditambahkan", id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Gagal menambahkan produk" });
  }
};

// PUT /api/produk/:id
exports.updateProduk = async (req, res) => {
  try {
    const { id } = req.params;
    const { kategori_id, nama_produk, harga, deskripsi, } = req.body;

    const [existingRows] = await pool.query("SELECT * FROM produk WHERE id = ?", [id]);
    if (existingRows.length === 0) {
      return res.status(404).json({ success: false, message: "Produk tidak ditemukan" });
    }
    const existing = existingRows[0];

    let gambar = existing.gambar;
    if (req.file) {
      // hapus gambar lama jika ada
      if (existing.gambar) {
        const oldPath = path.join(__dirname, "..", "uploads", existing.gambar);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      gambar = req.file.filename;
    }

    await pool.query(
      `UPDATE produk
       SET kategori_id = ?, nama_produk = ?, harga = ?, deskripsi = ?, gambar = ?,
       WHERE id = ?`,
      [
        kategori_id || existing.kategori_id,
        nama_produk || existing.nama_produk,
        harga || existing.harga,
        deskripsi !== undefined ? deskripsi : existing.deskripsi,
        gambar,
        id,
      ]
    );

    res.json({ success: true, message: "Produk berhasil diperbarui" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Gagal memperbarui produk" });
  }
};

// DELETE /api/produk/:id
exports.deleteProduk = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM produk WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Produk tidak ditemukan" });
    }
    const produk = rows[0];
    if (produk.gambar) {
      const imgPath = path.join(__dirname, "..", "uploads", produk.gambar);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    await pool.query("DELETE FROM produk WHERE id = ?", [id]);
    res.json({ success: true, message: "Produk berhasil dihapus" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Gagal menghapus produk" });
  }
};
