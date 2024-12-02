import multer from "multer";
import path from "path";
import fs from "fs";

const createMulterStorage = (uploadPath: string) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(
        null,
        `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`
      );
    },
  });
};

const uploadFile = (uploadPath: string, fieldName: string) => {
  return multer({
    storage: createMulterStorage(uploadPath),
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
    fileFilter: (req, file, cb) => {
      const fileTypes = /jpeg|jpg|png/;
      const extName = fileTypes.test(
        path.extname(file.originalname).toLowerCase()
      );
      const mimeType = fileTypes.test(file.mimetype);

      if (extName && mimeType) {
        cb(null, true);
      } else {
        cb(new Error("Only .png, .jpg, and .jpeg format allowed!"));
      }
    },
  }).single(fieldName); // Single file upload for the specified field
};

export const FileController = {
  uploadProfilePicture: uploadFile(
    "uploads/profile-pictures",
    "profilePicture"
  ),
};
