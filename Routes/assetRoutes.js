const express=require('express');
const { login } = require('../Authentication/assetController');
const router=express.Router();




router.route('/')
.post(login);




module.exports=router;