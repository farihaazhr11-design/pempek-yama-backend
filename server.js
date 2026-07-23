   const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const produkRoutes = require("./routes/produkRoutes");
const kategoriRoutes = require("./routes/kategoriRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder untuk gambar produk
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/produk", produkRoutes);
app.use("/api/kategori", kategoriRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Pempek Yama API is running" });
});

// 404 handler untuk API
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Endpoint tidak ditemukan" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message || "Terjadi kesalahan server" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
