const jwt=require('jsonwebtoken');
const crypto=require('crypto');
const { resetPassword } = require('./authController');

let mergingUnitData=[];
const tempObject={streamId:"",
lable:"",
    frequencyPerSecRMS:2,
    frequencyPerSecPower:2,
    samplesPerPeriod:80,
    powerAlarms:{
        minPower:50,
        maxPower:256,
        sendAlarms:true
    },rmsAlarms:{
        minRms:-5,
        maxRms:100,
        sendAlarms:true
    }
}
exports.login= async(req,res,next)=>{

  try{
    if(req.body.username==="ashish"&&req.body.password==="rathore"){
        res.status(200).json({
            username:"ashish",
            role:"Admin",
            sessionTimeout:"24h"
        })
    }else{
        res.status(401).json("Invalid username and password")
    }
  }catch(err){
    res.status(401).json("Invalid username and password")
  }
 }
 

 exports.addUnit= async(req,res,next)=>{
 
    if(req.body.streamId&&
    req.body.label){
mergingUnitData.push({...tempObject,...req.body});
res.status(201).json("Merging unit created")
    }else{
        res.status(401).json("failed to add")
    }

    console.log(mergingUnitData);
   
  }
 
  exports.deleteUnit= async(req,res,next)=>{
    if(req.params.id){
       const formattedData= mergingUnitData.filter((i)=>i.streamId!==req.params.id*1);
       mergingUnitData=[];
       mergingUnitData=formattedData
       console.log(mergingUnitData); res.status(200).json("successfully deleted merging unit")
    }else{
        console.log("failed to delete unit ")
    }

    console.log(mergingUnitData);
    
   
  }

  exports.getAllUnit= async(req,res,next)=>{
     res.status(200).json([...mergingUnitData])
    
   
  }