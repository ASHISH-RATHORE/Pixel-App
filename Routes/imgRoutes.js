const express=require('express');
const router=express.Router();
const {AllImages,uploadHandler, ImagesByID,Like, Unlike, ImagesByFollowers}=require('./../controllers/imageController');
const {protect}=require('../Authentication/authController');
const multer = require('multer');
const path = require("path");
const {cloudinary}= require('./../utils/Cloudinary')



const multerStorage = multer({
    storage: multer.diskStorage({}),
    fileFilter: (req, file, cb) => {
      let ext = path.extname(file.originalname);  
      if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
        cb(new Error("File type is not supported"), false);
        return;
      }
      cb(null, true);
    },
  });

//today
// const storage = multer.diskStorage({
//     destination: './upload/images',
//     filename: (req, file, cb) => {
//         return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
//     }
// })


const upload = multer({
    storage: multerStorage
});




router.route('/')
.get(AllImages)  //here
.post(multerStorage.single('image'),protect,uploadHandler);

// router.get('/followers',protect,ImagesByFollowers)
router.route('/:id')
.get(protect,ImagesByID)

router.route('/like/:id')
.put(protect,Like)

router.route('/unlike/:id')
.put(protect,Unlike)


module.exports=router;