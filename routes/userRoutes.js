const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verify = require("../middleware/verifyToken");
const UserSchema = require("../models/userModel");
const { getAll, postOne } = require("../controllers/userController");
const upload = require("../middleware/multerUpload");

const {
  registerValidation,
  loginValidation,
} = require("../controllers/validateUser");

router.route("/").get(getAll);

router.route("/:id");
// .get(getOne)

router.post("/register", upload.single("profilePicture"), async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //if User exist
  const userExist = await UserSchema.findOne({ email: req.body.email });
  if (userExist) return res.status(400).send("Email already exists");

  //hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new UserSchema({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
    profilePicture: req.file.path,
    phoneNumber: req.body.phoneNumber,
    skills: req.body.skills,
    role: req.body.role,
    active: req.body.active,
  });
  try {
    const savedusers = await user.save();
    res.status(200).json(savedusers);
  } catch (err) {
    res.status(400).send({ message: err });
  }
});

router.post("/login", async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //if User doesnt exist
  const user = await UserSchema.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email or password is wrong");

  //password is correct
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("Email or password is wrong");

  //create and assign a token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, {
    expiresIn: "1d",
  });
  res.header("auth-token", token).send(token);

  res.send("Logged in");
});

module.exports = router;
