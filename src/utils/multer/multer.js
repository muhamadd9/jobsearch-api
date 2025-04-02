import multer from "multer";




export const fileValidations = {
  image: ["image/png", "image/jpeg", "image/jpg", "image/gif"],
  pdf: ["application/pdf"],
  video: ["video/mp4"],
};
export const uploadFile = ({ fileValidation = [] }) => {
  const storage = multer.diskStorage({});
  const fileFilter = (req, file, cb) => {
    if (fileValidation.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"), false);
    }
  };

  return multer({
    storage,
    fileFilter,
  });
};

