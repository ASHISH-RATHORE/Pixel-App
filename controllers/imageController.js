const Images=require('../models/imgModel');
const AppError=require('../utils/appError');
const catchAsync = require('./../utils/catchAsync');







exports.getAllImages=  async(req,res)=>{

try{
    
    const img=await Images.find();

    res.status(200).json({
        status:'success',
        data:{
            img
        }
    })

}catch(err){
    res.status(400).json({
        status:'fail',
        message:err,
    })
}
}


exports.createImage= async(req,res)=>{


    try{
        
    const newImg= await Images.create(req.body);

    res.status(200).json({
        status:'success',
        data:{
          img:newImg
        }
    })
        
    }catch(err){

        res.status(400).json({
            status:'fail',
            message:err,
        })
          
    }
}

