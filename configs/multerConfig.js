// const multer = require("multer");
// const path = require("path");


// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, '/images/uploads')
//     },
//     filename: function (req, file, cb) {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//         const fn = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)
//         cb(null, fn)
//     }
// })

// const upload = multer({ storage: storage })

// module.exports = upload;

const multer = require("multer");

// Set up memory storage (files will be stored as Buffer in RAM)
const storage = multer.memoryStorage();

const upload = multer({ storage });

module.exports = upload;
