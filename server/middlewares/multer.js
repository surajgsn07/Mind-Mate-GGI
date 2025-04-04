import multer from 'multer';

export const uploader = multer({
  limits: { fileSize: 3000000 },  // 3 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Please upload only images.'), false);
    }
  },
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname); 
    }
  })
});


// OR

// import multer from 'multer';

// const storage = multer.memoryStorage(); 

// const upload = multer({
//     storage,
//     limits: { fileSize: 1 * 1024 * 1024 }, // 1 MB
//     fileFilter: (req, file, cb) => {
//         if (file.mimetype !== 'application/pdf') {
//             return cb(new Error('Only PDFs are allowed'), false);
//         }
//         cb(null, true);
//     }
// });
// export default upload;