const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt=require("bcryptjs");
const crypto=require('crypto');
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'A must have a name']
    },
    email:{
        type:String,
        required:[true,'A user must have a email'],
        unique:true,
        lowercase:true,
        validate:[validator.isEmail,'Not an email']

    },
    photo:String,
    password:{
        type:String,
        required:[true,'A user must have a Password'],
        minlength:8,
        select:false
    },
    passwordConfirm:{
        type:String,
        required:[true,'Password not matched'],
        validate:{
            validator:function(ele){
                return ele===this.password;
            },
            message:'Password not matched'
        }
    },
    passwordChangedAt:Date,
    passwordResetToken:String,
    passwordResetExpires:Date,
    uploads:[{type:mongoose.Schema.Types.ObjectId,ref:'Snaps'}],
    followers:[{type:mongoose.Schema.Types.ObjectId,ref:"users",unique:true}],
    following:[{type:mongoose.Schema.Types.ObjectId,ref:"users",unique:true}],
    likedImages:[{type:mongoose.Schema.Types.ObjectId,ref:'Snaps'}],

});

userSchema.pre('save',async function(next){
 
    if (!this.isModified('password')) return next();

    this.password= await bcrypt.hash(this.password,12);

    this.passwordConfirm=undefined;
    next();


});


userSchema.methods.correctPassword= async function(input,savedinput){
    return await bcrypt.compare(input,savedinput);
}



userSchema.methods.passwordChanged= function(JWTTimestamp){
   if(this.PasswordChangedAt){
      const changedTimestamp=parseInt(this.passwordChangedAt.getTime()/1000,10);

      return JWTTimestamp<changedTimestamp;
   }    
    return false;
}

userSchema.methods.createPasswordResetToken=function(){
    const resetToken= crypto.randomBytes(32).toString('hex');
   
    this.passwordResetToken=crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
    
    this.passwordResetExpires= Date.now()+10*60*1000;
    console.log(resetToken)
    return resetToken;
    
};


const User= mongoose.model("users",userSchema);
module.exports=User;
