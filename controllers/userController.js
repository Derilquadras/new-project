const UserSchema = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  registerValidation,
  loginValidation,
} = require("../controllers/validateUser");
/**
 * User Registration
 * @param {import('express').Request<{}, {}, showRequestBody, showRequestQuery>} req
 * @param {import('express').Response} res
 * @description To register a user
 */
exports.Register = async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).json({message:error.details[0].message});

  //if User exist
  const userExist = await UserSchema.findOne({ email: req.body.email });
  if (userExist) return res.status(400).json({message:"Email or password is wrong"});

  //hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  try {
    const user = new UserSchema({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      profilePicture: req.file.path,
      phoneNumber: req.body.phoneNumber,
      skills: req.body.skills,
      role: req.body.role,
      active: req.body.active,
      description: req.body.description,
    });
    user.password = undefined;

    res.status(200).json({ status: "success", user });
  } catch (err) {
    res.status(400).send({ message: err });
  }
};
/**
 * User Login
 * @param {import('express').Request<{}, {}, showRequestBody, showRequestQuery>} req
 * @param {import('express').Response} res
 * @description login for a user
 */
exports.Login = async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).json({message:error.details[0].message});

  //if User doesnt exist
  const user = await UserSchema.findOne({ email: req.body.email });
  if (!user) return res.status(400).json({message:"Email or password is wrong"});

  //password is correct
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).json({message:"Email or password is wrong"});

  //create and assign a token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, {
    expiresIn: "3d",
  });
  res
    .header("auth-token", token)
    .status(200)
    .json({
      Token: token,
      message: "Logged in Successfully ",
      data: {
        Agreeableness: 13.333333333333334,
        Drive: 21.666666666666668,
        Luck: 10,
        Openess: 30,
      },
      type: "bar",
    });
};
