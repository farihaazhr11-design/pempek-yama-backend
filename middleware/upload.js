// backend/middleware/upload.js
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "pempek-yama/produk",
        allowed_formats: ["jpeg", "jpg", "png", "webp"],
        public_id: (req, file) => {
            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
            return "produk-" + uniqueSuffix;
        },
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

module.exports = upload;