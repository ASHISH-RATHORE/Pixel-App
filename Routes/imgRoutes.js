const express=require('express');
const router=express.Router();
const {getAllImages,createImage,uploadHandler}=require('./../controllers/imageController');
const {protect}=require('../Authentication/authController');
const multer = require('multer')



const multerStorage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, __dirname+'/../images')
    },
    filename: function(req,file,cb){
        let ext = file.originalname.split('.')
        ext = ext[ext.length-1]
        cb(null, file.fieldname+'-'+Date.now()+'.'+ext)
    }
});

const upload = multer({
    storage: multerStorage
});




router.route('/')
.get(getAllImages)  //here
.post(upload.single('image'),protect,uploadHandler);


// router.route('/:id').get();
// // .delete();

module.exports=router;