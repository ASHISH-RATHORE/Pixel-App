const express=require('express');
const { login, addUnit, deleteUnit, getAllUnit, getUnitById, editUnitById } = require('../Authentication/assetController');
const router=express.Router();




router.route('/signin')
.post(login);
router.route('/merging-unit').post(addUnit);
router.route('/merging-unit/:id').delete(deleteUnit);
router.route('/merging-unit/list').get(getAllUnit)

router.route('/merging-unit/:id/config').get(getUnitById).put(editUnitById)

router.route("/merging-unit/list").get((res,req)=>{
    const data=[{streamId:"120",label:"Merging Unit 1",muStatus:true},{streamId:"122",label:"Merging Unit 2",muStatus:true},{streamId:"123",label:"Merging Unit 3",muStatus:true}]

    res.status(200).json(data)
})




module.exports=router;