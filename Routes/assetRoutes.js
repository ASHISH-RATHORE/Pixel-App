const express=require('express');
const { login, addUnit, deleteUnit, getAllUnit, getUnitById, editUnitById, getHdmi } = require('../Authentication/assetController');
const router=express.Router();




router.route('/signin')
.post(login);
router.route('/merging-unit').post(addUnit);
router.route('/merging-unit/:id').delete(deleteUnit);
router.route("/merging-unit/list").get(getHdmi)
router.route('/merging-unit/list').get(getAllUnit)

router.route('/merging-unit/:id/config').get(getUnitById).put(editUnitById)





module.exports=router;