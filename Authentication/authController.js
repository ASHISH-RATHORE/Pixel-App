const User=require('./../models/userModel');
const jwt=require('jsonwebtoken');
const AppError=require('../utils/appError');
const {promisify} =require('util');


const filterObj=(obj,...alowedFields)=>{
    Object.keys(obj).forEach(element=>{
        if(allowedFields.includes(el)) newObj[el]=obj[el];
    });
    return newObj;
    };



const signToken=(id)=>{
    return jwt.sign({ id:id},process.env.SECRET_KEY,{
        expiresIn:process.env.EXPIRES_IN
    });
}



exports.signup= async (req,res,next)=>{
 
    try{
        const newUser= await User.create({
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
            passwordConfirm:req.body.passwordConfirm,
            passwordChangedAt:req.body.passwordChangedAt,
        });



        const token=signToken(newUser._id);

        res.cookie('jwt',token,{
            expires:new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES*24*60*60*1000),
            // secure:true,
            httpOnly:true,
        })

 res.status(201).json({

    status:'success',
    token,
    data:{
        user:newUser,
    }
 })
    }catch(err){
        res.status(400).json({
            status:'fail',
            message:err,
        })
    }

};

exports.login= async(req,res,next)=>{
   try{ const {email,password}=req.body;

   // if email and password exist
   if(!email || !password){
       return next(new AppError('please provide email and password',400));
   }
   //    email and password is correct
   
   const user= await User.findOne({email}).select('+password');
   

   if(!user || !(await  user.correctPassword(password,user.password))){

    return next(new AppError('incorrect email or password',401));
   }
   
   // send token
   const token= signToken(user._id);
   res.status(200).json({
       status:'success',
       token
   });
}catch(err){
    res.status(400).json({
        status:'fail',
        message:err
    })
}
}


exports.protect= async(req,res,next)=>{

    try{
        
    //1 get the token and check if it there
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
         token=req.headers.authorization.split(' ')[1];
    }
    
    if(!token){
        return next(new AppError('Please Login ',401))
    }

    //2 validate token?
    const decoded=await promisify(jwt.verify)(token,process.env.SECRET_KEY);
    console.log(decoded);

    //3 check user is still exist 
      const currentUser=await User.findById(decoded.id)
     if(!freshUser){
         return next(new AppError('The user does not exist',401));
     }

    //4 check if user change password after the token issued 
      if(!currentUser.passwordChanged(decoded.iat)){
           return next(new AppError('passoword recently changed please login again',401));
      };

      req.user=currentUser;
       next();    
}catch(err){
        res.status(400).json({
            status:'fail',
            message:err
        })
    }
    
    
}

exports.updatePassword= async (req,res,next)=>{


     try{
    //  get the user
    const user =await User.findById(req.user.id)/select('+password')
     
    //  check old password is correct 
    if(!await (user.correctPassword(req.body.passwordCurrent,user.password))){
        return next(new AppError('password is wrong',401))
        
    }
    //  update the password

    user.password=req.body.password;
    user.passwordConfirm=req.body.passwordConfirm;
    await user.save();
    //  log user in,send jwt
      const token =signToken(user._id);
      
      res.status(200).json({
          status:'success',
          token
      });


     }catch(err){
         res.status(401).json({
             status:'fail',
             message:err
         })
     }
}

exports.updateMe=async (req,res,next)=>{

    try{
        const filterBody=filterObj(req.body,'name','email')
        const updatedUser=await User.findByIdAndUpdate(req.user.id,filterBody,{new:true,runValidators:true});
          
        res.status(200).json({
            status:'success',
            data:{
                user:updatedUser
            }
        })


    }catch(err){
        res.status(400).json({
            status:'fail',
            message:err,
        })
    }

}