const jwt=require('jsonwebtoken');
const crypto=require('crypto');
const { resetPassword } = require('./authController');

let mergingUnitData=[];
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
       mergingUnitData=[]
        res.status(200).json("successfully deleted merging unit")
    }else{
        console.log("failed to delete unit ")
        res.status(401).json("failed to deleted merging unit")
    }

    
   
  }

  exports.getAllUnit= async(req,res,next)=>{

    const temp= mergingUnitData.length>0?mergingUnitData.map((item)=>({id:item.id,streamId:item.streamId,label:item.label})):undefined
     res.status(200).json(temp)
    
   
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

 exports.  getHdmi= async(req,res,next)=>{
      
    const data=[
        {
        "deviceId": "125",
        "creationTimestamp": "2022-07-29T06:58:47.238281",
        "appId": null,
        "active": true,
        "id": "125",
        "new": false
        },
        {
        "deviceId": "124",
        "creationTimestamp": "2022-07-29T06:58:48.319166",
        "appId": null,
        "active": true,
        "id": "124",
        "new": false
        },
        {
        "deviceId": "129",
        "creationTimestamp": "2022-07-29T06:10:08.714767",
        "appId": null,
        "active": true,
        "id": "129",
        "new": false
        },
        {
        "deviceId": "122",
        "creationTimestamp": "2022-07-29T06:58:40.904922",
        "appId": null,
        "active": true,
        "id": "122",
        "new": false
        },
        {
        "deviceId": "127",
        "creationTimestamp": "2022-07-29T06:58:41.427189",
        "appId": null,
        "active": true,
        "id": "127",
        "new": false
        },
        {
        "deviceId": "121",
        "creationTimestamp": "2022-07-29T06:58:41.935656",
        "appId": null,
        "active": true,
        "id": "121",
        "new": false
        },
        {
        "deviceId": "128",
        "creationTimestamp": "2022-07-29T06:58:43.851582",
        "appId": null,
        "active": true,
        "id": "128",
        "new": false
        },
        {
        "deviceId": "120",
        "creationTimestamp": "2022-07-29T06:58:44.421433",
        "appId": null,
        "active": true,
        "id": "120",
        "new": false
        },
        {
        "deviceId": "126",
        "creationTimestamp": "2022-07-29T06:58:46.693521",
        "appId": null,
        "active": true,
        "id": "126",
        "new": false
        },
        {
        "deviceId": "123",
        "creationTimestamp": null,
        "appId": "1",
        "active": true,
        "id": "123",
        "new": true
        }
        ]

        console.log(data)
    res.status(200).json(data.map((item)=>({streamId:item.id,label:`Merging Unit ${item.id}`,muStatus:true})))
   
  
 }

 
 exports.getMUList= async(req,res,next)=>{
        const data=[]

        for (let index = 1; index <= 10; index++) {
            
            data.push({   
                streamId: `12${index}`,
                label:`Merging Unit ${index}`,
                muActiveStatus:index%2===0?true:false,
                startMU:index%2===0?true:false
                })
            
        }
    res.status(200).json(data)
   
  
 }