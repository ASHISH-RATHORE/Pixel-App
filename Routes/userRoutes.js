const express=require('express');
const { route } = require('../app');
const {  updateMe ,updatePassword, signup,login}=require('../Authentication/authController')

const router=express.Router();


router.post('/signup',signup);
router.post('/login',login);
router.patch('/updatepassword',updatePassword);
router.patch('/updation',updateMe);





module.exports=router;