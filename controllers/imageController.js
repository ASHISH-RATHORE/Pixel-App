const Images=require('../models/imgModel');
const AppError=require('../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const jwt = require('jsonwebtoken');



exports.getAllImages=  async(req,res)=>{

try{
    
    const baseURL = __dirname+'/../images/';

    const img=await Images.find();

    const images = img.map((val) =>{ return {image: baseURL+val.image, uploadedBy: val.uploadBy,
        UploadedAt: val.uploadAt
    }} );

    console.log(images)

    res.status(200).json({
        status:'success',
        data:{
            images
        }
    })

}catch(err){
    res.status(400).json({
        status:'fail',
        message:err,
    })
}
}



exports.uploadHandler = async (req,res,next) => {
    console.log(req.file);
    let token = req.headers.cookie;

    token = token.split('=');
    token = token[1];

    const myToken = jwt.decode(token);

    const newPost = await Images.create({
        image: req.file.filename,
        uploadAt: Date.now(),
        uploadBy: myToken.name,
    });

    res.status(201).json({
        status: 'success',
        message: newPost
    });
}
// ends