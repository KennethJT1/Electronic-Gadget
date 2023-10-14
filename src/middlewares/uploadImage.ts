import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/images/"));
  },
  filename: function (req, file, cb) {
    const uniquesuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniquesuffix + ".jpeg");
  },
});

const multerFilter = (req:any, file:any, cb:any) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb({ message: "Unsupported file format" }, false);
  }
};

export const uploadPhoto = multer({
  storage: storage,
  fileFilter: multerFilter,
  limits: { fileSize: 1000000 },
});

export const productImgResize = async (req:any, res:any, next:any) => {
  if (!req.files) return next();
  await Promise.all(
    req.files.map(async (file:any) => {
      await sharp(file.path)
        .resize(300, 300)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/images/products/${file.filename}`);
      fs.unlinkSync(`public/images/products/${file.filename}`);
    })
  );
  next();
};

export const blogImgResize = async (req:any, res:any, next:any) => {
  if (!req.files) return next();
  await Promise.all(
    req.files.map(async (file:any) => {
      await sharp(file.path)
        .resize(300, 300)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/images/blogs/${file.filename}`);
      fs.unlinkSync(`public/images/blogs/${file.filename}`);
    })
  );
  next();
};