const express=require('express');
const { route } = require('../app');
const { Logout,resetPassword,forgotPassword, updateMe ,updatePassword, signup,login}=require('../Authentication/authController')

const router=express.Router();


router.post('/signup',signup);
router.post('/login',login);
router.post('/forgotpassword',forgotPassword);
router.patch('/resetPassword/:token',resetPassword);
router.patch('/updatepassword',updatePassword);
router.post('/logout',Logout)
// router.patch('/updation',updateMe);





module.exports=router;