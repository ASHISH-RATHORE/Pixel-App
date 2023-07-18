const express = require("express");
const AppError = require("./utils/appError");
const imgRouter = require("./Routes/imgRoutes");
const assRouter = require("./Routes/assetRoutes");
const local = require("./Routes/localOperatorRoutes");
const globalErrorHandler = require("./Authentication/errorController");
const userRouter = require("./Routes/userRoutes");
const imgController = require("./controllers/imageController");
const cookie = require("cookie-parser");
const cors = require("cors");
const compression = require("compression");
const { Resend } = require("resend");

const resend = new Resend("re_jcmeZppN_GkxCy3b2aaw4wgwuVbpYBFoU");
const app = express();

app.use(cors());
app.use(express.static("public"));
app.use(cookie());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(compression());

// Routes for pixel
app.use("/api/v1/img", imgRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/mail", async (req, res) => {
  try {
    const data = await Resend.emails.send({
      from: "onboarding@resend.dev",
      to: ["ashishr97@gmail.com", "souravsinha1604@gmail.com"],
      subject: "Hello World",
      html: "<strong>It works!</strong>",
    });

    console.log(data);
    res.send("success");
  } catch (error) {
    console.error(error);
  }
});
// app.use('/api/v1',assRouter)
// app.use('/hdmi',assRouter)
// app.use('/api/v1/assetmgr',local)
// app.use('/api/v1/operator',local)

console.log("test");
app.all("*", (req, res, next) => {
  return next(
    new AppError(`can't find ${req.originalUrl} on this Server`, 404)
  );
});

app.use(globalErrorHandler);

//socket

module.exports = app;
