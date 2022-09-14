const express=require('express');
const { login, addUnit, deleteUnit, getAllUnit } = require('../Authentication/assetController');
const router=express.Router();




router.route('/signin')
.post(login);
router.route('/merging-unit').post(addUnit);
router.route('/merging-unit/:id').delete(deleteUnit);
router.route('/merging-unit/list').get(getAllUnit)




module.exports=router;