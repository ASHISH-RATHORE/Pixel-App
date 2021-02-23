const mongoose=require('mongoose');
const dotenv=require('dotenv');
const app=require('./app');
dotenv.config({path:'./config.env'});


mongoose.connect(process.env.DATABASE_REMOTE,{
    useNewUrlParser:true,
    useFindAndModify:false,
    useCreateIndex:true,
    useUnifiedTopology:true,}).then((con)=>{
        console.log('CONNECTED')
    });




app.listen(process.env.PORT,(err)=>{
    if(err) throw err;
    console.log(`SERVER IS RUNNING ON ${process.env.PORT}`)
})