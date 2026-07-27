import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  console.log("Multer fileFilter triggered for file:", { originalname: file.originalname, mimetype: file.mimetype });
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    console.log("fileFilter: File type allowed.");
    cb(null, true);
  } else {
    console.warn("fileFilter: Invalid file type rejected.");
    cb(new Error("Invalid file type. Only images allowed."), false);
  }
};

export const uploadPic = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

export const uploadDoc = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    console.log("Multer fileFilter for doc triggered:", { originalname: file.originalname, mimetype: file.mimetype });
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword"
    ];
    if (allowedTypes.includes(file.mimetype)) {
      console.log("fileFilter (doc): File type allowed.");
      cb(null, true);
    } else {
      console.warn("fileFilter (doc): Invalid file type rejected.");
      cb(new Error("Only PDF and Word documents (.pdf, .docx, .doc) are allowed"), false);
    }
  }
});
