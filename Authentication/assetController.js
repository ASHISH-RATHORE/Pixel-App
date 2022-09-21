const jwt=require('jsonwebtoken');
const crypto=require('crypto');
const { resetPassword } = require('./authController');

let mergingUnitData=[{
    streamId: 4,
    label: 'rathore',
    frequencyPerSecRMS: 2,
    frequencyPerSecPower: 2,
    samplesPerPeriod: 80,
    powerAlarms: { minPower: 50, maxPower: 256, sendAlarms: true },
    rmsAlarms: { minRms: -5, maxRms: 100, sendAlarms: true },
    id: 4
  },{
    streamId: 5,
    label: 'rathore',
    frequencyPerSecRMS: 2,
    frequencyPerSecPower: 2,
    samplesPerPeriod: 80,
    powerAlarms: { minPower: 50, maxPower: 256, sendAlarms: true },
    rmsAlarms: { minRms: -5, maxRms: 100, sendAlarms: true },
    id: 4
  }];
const tempObject={
    streamId:"",
    label:"",
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
    }else if(req.body.username==="sourav"&&req.body.password==="sinha"){
        res.status(200).json({
            username:"Sourav Sinha",
            role:"Local Operator",
            sessionTimeout:"24h"
        })
    }else{
        res.status(401).json({
            errorCode:"401",
            message:"Invalid username or password ----ashish env"
        })
    }
  }catch(err){
    res.status(401).json({
        errorCode:"401",
        message:"Invalid username or password "
    })
  }
 }
 

 exports.addUnit= async(req,res,next)=>{
 
    if(req.body.streamId&&
    req.body.label){
mergingUnitData.push({...tempObject,...req.body,id:req.body.streamId});
res.status(201).json({...tempObject,...req.body,id:req.body.streamId})
    }else{
        res.status(401).json("failed to add")
    }

   
  }
 
  exports.deleteUnit= async(req,res,next)=>{
    
    if(req.params.id){
       const formattedData= mergingUnitData.filter((i)=>i.streamId!==req.params.id*1);
       mergingUnitData=[];
       mergingUnitData=formattedData
        res.status(200).json("successfully deleted merging unit")
    }else{
        console.log("failed to delete unit ")
        res.status(401).json("failed to deleted merging unit")
    }

    
   
  }

  exports.getAllUnit= async(req,res,next)=>{
     res.status(200).json(mergingUnitData.map((item)=>({id:item.id,streamId:item.streamId,label:item.label})))
    
   
  }

  exports.getUnitById= async(req,res,next)=>{
    
    const data=mergingUnitData.filter((item)=>{
        return item.id===req.params.id*1
    })
    res.status(200).json(...data)
 }

 exports.editUnitById= async(req,res,next)=>{
    
    const data=mergingUnitData.filter((item)=>{
        return item.id===req.params.id*1
    })
    if(data.length>0){

        let newData={...data[0],...req.body}
        var foundIndex=mergingUnitData.findIndex((x)=>x.id===req.params.id*1);
        mergingUnitData[foundIndex]=newData

        console.log(mergingUnitData);
        res.status(200).json(newData)
    }

 }