const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {
  getAllProduk,
  getProdukById,
  createProduk,
  updateProduk,
  deleteProduk,
} = require("../controllers/produkController");

router.get("/", getAllProduk);
router.get("/:id", getProdukById);
router.post("/", upload.single("gambar"), createProduk);
router.put("/:id", upload.single("gambar"), updateProduk);
router.delete("/:id", deleteProduk);

module.exports = router;
