const express = require("express");
const { route } = require("../app");
const {
  Logout,
  resetPassword,
  forgotPassword,
  updateMe,
  updatePassword,
  signup,
  login,
  protect,
} = require("../Authentication/authController");
const {
  GetUserById,
  Follow,
  Unfollow,
  Like,
  followersList,
  getAllUsers,
} = require("./../controllers/userController");
const { ImagesByFollowers } = require("./../controllers/imageController");
const { Resend } = require("resend");

const resend = new Resend("re_jcmeZppN_GkxCy3b2aaw4wgwuVbpYBFoU");
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgotpassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);
router.patch("/updatepassword", updatePassword);
router.post("/logout", Logout);
// router.patch('/updation',updateMe);
router.get("/mail", async () => {
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
router.route("/userprofile/:id").get(GetUserById);

router.route("/follow/:id").put(protect, Follow);

router.route("/unfollow/:id").put(protect, Unfollow);

router.route("/likedimages/:id").get(protect, Like);

router.route("/following").post(followersList);

router.route("/userslist").get(getAllUsers);

module.exports = router;
