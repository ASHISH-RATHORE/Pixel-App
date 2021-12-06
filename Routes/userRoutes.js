const express=require('express');
const { route } = require('../app');
const { Logout,resetPassword,forgotPassword, updateMe ,updatePassword, signup,login,protect}=require('../Authentication/authController');
const {GetUserById,Follow, Unfollow, Like}=require('./../controllers/userController')

const router=express.Router();


router.post('/signup',signup);
router.post('/login',login);
router.post('/forgotpassword',forgotPassword);
router.patch('/resetPassword/:token',resetPassword);
router.patch('/updatepassword',updatePassword);
router.post('/logout',Logout)
// router.patch('/updation',updateMe);

router
.route('/userprofile/:id')
.get(GetUserById)

router
.route('/follow/:id')
.put(protect,Follow)

router.route('/unfollow/:id')
.put(protect,Unfollow)

router.route('/likedimages/:id')
.get(protect,Like)




module.exports=router;