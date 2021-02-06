const UserSchema = require("../models/userModel");
const { registerValidation } = require("../controllers/validateUser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
exports.getAll = async (req, res) => {
  try {
    const str = req.query.str;
    const { page = 1, limit = 10 } = req.query;

    const count = await UserSchema.countDocuments();
    const users = await UserSchema.find()
      .sort(req.query.sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select({ name: 1, email: 1, description: 1 });
    res.status(200).json({
      status: "success",
      limit: limit,
      data: users,
      currentPage: page,
      count: count,
    });
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

exports.getOne = async (req, res) => {
  try {
    const user = await UserSchema.find({ _id: req.params.id });
    if (user.length == 0)
      return res.status(400).send({ message: "Object not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(400).send({ message: err });
  }
};

exports.createOne = async (req, res) => {
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
    description: req.body.description,
  });
  try {
    const savedusers = await user.save();
    res.status(200).json(savedusers);
  } catch (err) {
    res.status(400).send({ message: err });
  }
};

exports.Search = async (req, res) => {
  const searchedField = req.query.name;
  UserSchema.find({
    name: { $regex: searchedField, $options: "$i" },
  }).then((data) => {
    res.send(data);
  });
};

exports.deactivate = async (req, res) => {
  try {
    await UserSchema.findByIdAndUpdate(req.params.id, {
      active: false,
    });

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    res.status(400).send({ message: err });
  }
};
