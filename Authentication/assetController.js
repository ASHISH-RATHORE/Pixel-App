const jwt=require('jsonwebtoken');
const crypto=require('crypto');

exports.login= async(req,res,next)=>{
   console.log("++++++++++++++++++++++++++++",req.body.username,"+++++++++++++++++++++++++++++++++++++++");

  try{
    if(req.body.username==="ashish"&&req.body.password==="rathore"){
        res.status(200).json({
            username:"ashish",
            role:"Admin",
            sessiontimout:"24h"
        })
    }else{
        res.status(401).json("Invalid username and password")
    }
  }catch(err){
    res.status(401).json("Invalid username and password")
  }
 }
 
 