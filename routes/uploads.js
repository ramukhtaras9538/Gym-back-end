// import { Router } from "express";
// import multer from "multer";
// import path from "path";
// import fs from "fs";
// import { fileURLToPath } from "url";

// const router = Router();

// // Save uploads to Server/public/uploads
// const __dirname = path.dirname(fileURLToPath(import.meta.url));
// const uploadDir = path.join(__dirname, "..", "public", "uploads");

// // Ensure the upload directory exists before multer tries to write into it
// fs.mkdirSync(uploadDir, { recursive: true });

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, uploadDir),
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     const name = Date.now() + "-" + Math.random().toString(36).slice(2, 8) + ext;
//     cb(null, name);
//   },
// });

// const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// router.post("/", upload.single("file"), (req, res) => {
//   if (!req.file) return res.status(400).json({ error: "No file uploaded" });
//   // Return a URL the front-end can use to fetch the file
//   const url = `/uploads/${req.file.filename}`;
//   res.json({ url });
// });

// export default router;


import { Router } from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";

const router = Router();

// Store uploaded file temporarily in memory
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

router.post("/", upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "No file uploaded",
      });
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "gym-website",
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      stream.end(req.file.buffer);
    });

    console.log("Cloudinary upload successful:", result.secure_url);

    res.status(200).json({
      message: "Image uploaded successfully",
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    next(error);
  }
});

export default router;