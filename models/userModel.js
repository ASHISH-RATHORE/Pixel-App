const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt=require("bcryptjs");

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

const User= mongoose.model('users',userSchema);
module.exports=User;
