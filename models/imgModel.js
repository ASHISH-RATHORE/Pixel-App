const mongoose=require('mongoose');


// creating schema
const imgSchema=new mongoose.Schema({
    image:{
        type:String,
        required:[true,'select an image'],
        
    },

    uploadAt:{
        type:Date,
        default:Date.now()
    },

    uploadBy: {
        type:String,
        required:[true,'name required']
    },
        
    
});

const Images=mongoose.model('Snaps',imgSchema);
module.exports=Images;