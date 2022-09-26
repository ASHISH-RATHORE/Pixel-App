const express=require('express');
const { login, addUnit, deleteUnit, getAllUnit, getUnitById, editUnitById, getHdmi, getMUList } = require('../Authentication/assetController');
const router=express.Router();




router.route('/signin')
.post(login);
router.route("/merging-unit/list").get(getMUList)





module.exports=router;