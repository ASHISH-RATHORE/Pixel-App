const express=require('express');
const AppError=require('./utils/appError');
const imgRouter=require('./Routes/imgRoutes');
const globalErrorHandler = require('./Authentication/errorController');
const multer = require('multer')
const AWS = require('aws-sdk')
const userRouter=require('./Routes/userRoutes');
const imgController = require('./controllers/imageController');
const app=express();

app.use(express.json());


// starts  




const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET
})

const storage = multer.memoryStorage({
    destination: function(req, file, callback) {
        callback(null, '')
    }
})

const upload = multer({storage}).single('image')

app.post('/upload',upload,(req, res) => {

    let myFile = req.file.originalname.split(".")
    const fileType = myFile[myFile.length - 1]

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `1.${fileType}`,
        Body: req.file.buffer
    }

    s3.upload(params, (error, data) => {
        if(error){
            res.status(500).send(error)
        }

        res.status(200).send(data)
    })
})


// ends





// Routes for pixel



app.use('/api/v1/img',imgRouter);
app.use('/api/v1/users',userRouter);




app.all('*',(req,res,next)=>{
    return next(new AppError(`can't find ${req.originalUrl} on this Server`,404));
});

// app.use(globalErrorHandler);



module.exports=app