const User=require('./../models/userModel');
const Images = require('./../models/imgModel');
const APIFeatures = require('../utils/apiFeatures');


exports.GetUserById=async(req,res)=>{
   const ID= req.params.id;
          try{
        //    const user= await User.findOne({_id:ID});
        //   const upload=await Images.find({userId:ID})
              const user=await User.findOne({_id:ID}).populate('uploads').exec();
            res.status(200).json({
                status:'success',
                data:user
            })
          }catch(err){
              res.status(400).json({
                  status:'fail',
                  message:err.message
              })
          }
}




exports.Follow=async(req,res)=>{
    const loggedIn =req.user._id;
    const ImageUser=req.params.id;

    User.findByIdAndUpdate(ImageUser,{
        $push:{followers:loggedIn}
    },{
        new:true
    },(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
      User.findByIdAndUpdate(loggedIn,{
          $push:{following:ImageUser}
          
      },{new:true}).select("-password").then(result=>{
          res.json({status:'Success',
                    data:true})
      }).catch(err=>{
          return res.status(422).json({error:err})
      })

    }
    )
}

exports.Unfollow=async(req,res,next)=>{
    const loggedIn =req.user._id;
    const ImageUser=req.params.id;
    User.findByIdAndUpdate(ImageUser,{
        $pull:{followers:loggedIn}
    },{
        new:true
    },(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
      User.findByIdAndUpdate(loggedIn,{
          $pull:{following:ImageUser}
          
      },{new:true}).select("-password").then(result=>{
          res.json(result)
      }).catch(err=>{
          return res.status(422).json({error:err})
      })

    }
    )
}


exports.Like=async(req,res,next)=>{
    const UserId=req.params.id;
try{
    const user= await User.findById(UserId).populate('likedImages').exec();
    
    res.status(200).json({
        status:'Success',
        data:user
    })
}catch(err){
    res.status(400).json({
        status:'Fail',
        data:err
    })
}
}



exports.followersList=async(req,res,next)=>{
try{
    const ids=req.body.followersList
    
      
    const features=new APIFeatures(Images.find({ 'userId': { $in: ids } }),req.query).paginate();
 await features.query.exec((err,doc)=>{
    if (err) {
        return res.json(err);
      }

  Images.find({ 'userId': { $in: ids } }).countDocuments().exec((error,count)=>{
    if (error) {
        return res.json(error);
      }
    res.status(200).json({
        status:'success',
        data:{
            totalCount:count,
            data:doc
        }
    })

  });
    

    });
     }catch(err){
    console.log(err);
    res.status(400).json({
        status:'fail',
        data:err
    })
}

}