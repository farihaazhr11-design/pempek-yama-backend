const express = require("express");
const router = express.Router();
const { getAllKategori } = require("../controllers/kategoriController");

router.get("/", getAllKategori);

module.exports = router;
