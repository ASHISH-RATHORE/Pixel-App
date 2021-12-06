const mongoose=require('mongoose');
const {ObjectId} =mongoose.Schema.Types


// creating schema
const imgSchema=new mongoose.Schema({
    category:{type:String,
               required:[true,'Select a category']
    },
    image:{
        type:String,
        required:[true,'Select an image'],
        
    },

    uploadAt:{
        type:Date,
        default:Date.now()
    },

    uploadBy: {
        type:String,
        required:[true,'Name required']
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true},
    
    likes:[{type:mongoose.Schema.Types.ObjectId,ref:"users",unique:true}],

    comments:[{
        text:String,
        postedBy:{type:mongoose.Schema.Types.ObjectId,ref:"users"},
        postedAt:{type:Date,default:Date.now()}
    }]
    
});
const Images=mongoose.model("Snaps",imgSchema);
module.exports=Images;