const Images = require("../models/imgModel");
const AppError = require("../utils/appError");
const catchAsync = require("./../utils/catchAsync");
const jwt = require("jsonwebtoken");
const { cloudinary } = require("./../utils/Cloudinary");
const User = require("../models/userModel");
const APIFeatures = require("../utils/apiFeatures");
const Event = require("events");

exports.AllImages = async (req, res) => {
  try {
    const features = new APIFeatures(Images.find(), req.query).paginate();
    const img = await features.query.exec((err, doc) => {
      if (err) {
        return res.json(err);
      }
      console.log(doc);
      Images.find()
        .countDocuments()
        .exec((error, count) => {
          if (error) {
            return res.json(error);
          }
          res.status(200).json({
            status: "success",
            data: {
              totalCount: count,
              data: doc,
            },
          });
        });
    });
  } catch (err) {
    res.status(400).json({
      status: "Fail",
      message: err.message,
    });
  }
};

// exports.ImagesByFollowers=async(req,res)=>{
//     const UserId=req.user.id;
//      await User.findById(UserId).select('following').populate('following','uploads').populate('uploads').exec((err,images)=>{
//       res.json({
//           data:images
//       })
//         const image =images.uploads
//         console.log(images)

//     });
//         const images = img.map((val) =>{ return {image:val.image, uploadedBy: val.uploadBy,
//         UploadedAt: val.uploadAt,total_like:likes
//     }} );
//  res.status(200).json({
//      status:'Success',
//      data:images
//  })
// }

exports.ImagesByID = async (req, res) => {
  const ImageId = req.params.id;
  try {
    const img = await Images.findOne({ _id: ImageId });
    res.status(200).json({
      status: "success",
      data: {
        img,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.uploadHandler = async (req, res, next) => {
  console.log(req);
  const { _id, name, email } = req.user;
  let token = req.headers.cookie;
  token = token.split("=");
  token = token[1];

  const myToken = jwt.decode(token);
  const { category } = req.body;

  try {
    const fileStr = req.file.path;
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      upload_preset: "feusvzqd",
    });
    await Images.create({
      category,
      image: uploadResponse.secure_url,
      uploadAt: Date.now(),
      uploadBy: myToken.name,
      userId: _id,
    }).then((image) => {
      User.findByIdAndUpdate(
        { _id: image.userId },
        { $push: { uploads: image._id } },
        (err, result) => {
          if (result) {
            res.status(201).json({
              status: "success",
              message: "Image uploaded successfully",
            });
          }
        }
      );
    });

    // res.status(201).json({
    //     status: 'Success',
    //     message: "Image uploaded successfully"
    // });
  } catch (err) {
    res.status(501).json({
      status: "fail",
      message: "Something went wrong",
    });
    console.error(err);
  }
};
// ends

exports.Like = async (req, res) => {
  const ImageId = req.params.id;
  const UserId = req.user._id;
  Images.findByIdAndUpdate(
    ImageId,
    {
      $push: { likes: UserId },
    },
    {
      new: true,
    },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      User.findByIdAndUpdate(
        UserId,
        {
          $push: { likedImages: ImageId },
        },
        { new: true }
      )
        .then((result) => {
          res.json({ status: "Success", data: true });
        })
        .catch((err) => {
          return res.status(422).json({ error: err });
        });
    }
  );
};

exports.Unlike = (req, res) => {
  const ImageId = req.params.id;
  const UserId = req.user._id;
  Images.findByIdAndUpdate(
    ImageId,
    {
      $pull: { likes: UserId },
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      res.status(200).json({
        status: "Success",
        data: "liked",
      });
    }
  });
};
