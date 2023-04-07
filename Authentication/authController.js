const User = require("./../models/userModel");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const { promisify } = require("util");
const sendEmail = require("../utils/email");
const crypto = require("crypto");

const filterObj = (obj, ...alowedFields) => {
  Object.keys(obj).forEach((el) => {
    if (alowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

const signToken = (id, name) => {
  return jwt.sign({ id: id, name: name }, process.env.SECRET_KEY, {
    expiresIn: process.env.EXPIRES_IN,
  });
};

exports.signup = async (req, res, next) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      passwordChangedAt: req.body.passwordChangedAt,
    });

    const token = signToken(newUser._id, newUser.name);

    // res.cookie('jwt',token,{
    //     expires:new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES*24*60*60*1000),
    //     expires:new Date(Date.now()+1*60*1000),
    //     // secure:true,
    //     httpOnly:true,
    // })
    // const subject = `Welcome ${newUser.name}`;
    // const message = `Hi ${newUser.name},Welcome to pixel. We're thrilled to see you here !`;

    // sendEmail({
    //   email: newUser.email,
    //   subject,
    //   message,
    // });
    res.status(201).json({
      status: "success",
      data: {
        user: newUser,
      },
      messsage: "Successfully",
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // if email and password exist
    if (!email || !password) {
      return next(new AppError("please provide email and password", 400));
    }
    //    email and password is correct

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError("incorrect email or password", 401));
    }

    // send token

    const token = signToken(user._id, user.name);
    res.cookie("jwt", token, {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
      ),
      // secure:true,
      httpOnly: true,
    });
    res.status(200).json({
      status: "success",
      token,
      name: user?.name,
      id: user?._id,
      email: user?.email,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.protect = async (req, res, next) => {
  try {
    //1 get the token and check if it there
    let token;

    if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return next(new AppError("Please Login ", 401));
    }

    //2 validate token?
    const decoded = await promisify(jwt.verify)(token, process.env.SECRET_KEY);

    //3 check user is still exist
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(new AppError("The user does not exist", 400));
    }

    //4 check if user change password after the token issued
    //   if(!currentUser.passwordChanged(decoded.iat)){
    //        return next(new AppError('passoword recently changed please login again',401));
    //   };

    req.user = currentUser;
    next();
  } catch (err) {
    res.status(403).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    //  get the user
    const user = (await User.findById(req.user.id)) / select("+password");

    //  check old password is correct
    if (
      !(await user.correctPassword(req.body.passwordCurrent, user.password))
    ) {
      return next(new AppError("password is wrong", 401));
    }
    //  update the password

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
    //  log user in,send jwt
    const token = signToken(user._id);

    res.status(200).json({
      status: "success",
      token,
    });
  } catch (err) {
    res.status(401).json({
      status: "fail",
      message: err,
    });
  }
};

exports.updateMe = async (req, res, next) => {
  try {
    const filterBody = filterObj(req.body, "name", "email");
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: {
        user: updatedUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    //  1 get user based on email

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(new AppError("There is no user", 400));
    }
    // 2 generate the random reset token

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // 3 send it to user's email
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/resetPassword/${resetToken}`;
    const subject = "Forget Password";
    const message = `Forgot your password? Submit a patch request with your new password
    and passwordConfirm to ${resetURL}\nif you didn't forget your password,plaease ignore this email!`;
    try {
      await sendEmail({
        email: user.email,
        subject,
        message,
      });
      res.status(200).json({
        status: "success",
        message: "Token sent to email",
      });
    } catch (err) {
      user.createPasswordResetToken = undefined;
      user.passwordResetExpires = undefined;

      await user.save({ validateBeforeSave: false });

      return next(new AppError("error while sending", 500));
    }
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.resetPassword = async (req, res, next) => {
  // 1 get user based on token

  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2 if token not expired and there is user,and set new password
  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetExpires = undefined;
  await user.save();
  // 3 update changepassword At property for the user

  // 4 log the user in send jwt

  const token = signToken(user._id);

  res.status(200).json({
    status: "success",
    token,
  });
};

exports.Logout = async (req, res, next) => {
  const token = null;
  res.cookie("jwt", token, {
    httpOnly: true,
  });

  res.status(200).json({
    status: "success",
    token,
    message: "successfully logout",
  });
};
