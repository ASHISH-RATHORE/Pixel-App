const express=require('express');
const AppError=require('./utils/appError');
const imgRouter=require('./Routes/imgRoutes');
const globalErrorHandler = require('./Authentication/errorController');
const userRouter=require('./Routes/userRoutes');
const imgController = require('./controllers/imageController');
const cookie=require('cookie-parser');
const cors=require('cors');
const compression=require('compression');



const app=express();

app.use(cors());

app.use(cookie());
app.use(express.json());


app.use(compression())

// Routes for pixel
app.use('/api/v1/img',imgRouter);
app.use('/api/v1/users',userRouter);


app.all('*',(req,res,next)=>{
    return next(new AppError(`can't find ${req.originalUrl} on this Server`,404));
});

app.use(globalErrorHandler);


module.exports=app;