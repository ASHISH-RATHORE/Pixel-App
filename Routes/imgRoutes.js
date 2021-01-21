const express=require('express');
const router=express.Router();
const {getAllImages,createImage}=require('./../controllers/imageController');
const {protect}=require('../Authentication/authController');




router.route('/')
.get(getAllImages)  //here

router.route('/:id').get()
.delete();

module.exports=router;