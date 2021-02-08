const UserSchema = require("../models/userModel");
const { registerValidation } = require("../controllers/validateUser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
/**
 * Get all users
 * @param {import('express').Request<{}, {}, showRequestBody, showRequestQuery>} req
 * @param {import('express').Response} res
 * @description To get all users(Admin)
 */
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
/**
 * Get get one user
 * @param {import('express').Request<{}, {}, showRequestBody, showRequestQuery>} req
 * @param {import('express').Response} res
 * @description To get one user based on name(Admin)
 */
exports.getOne = async (req, res) => {
  try {
    const user = await UserSchema.find({ _id: req.params.id });
    if (user.length == 0)
      return res.status(400).send({ message: "Object not found" });
    res.status(200).json({ status: "success", data: user });
  } catch (err) {
    res.status(400).send({ message: err });
  }
};
/**
 * Create a user
 * @param {import('express').Request<{}, {}, showRequestBody, showRequestQuery>} req
 * @param {import('express').Response} res
 * @description To create new user through admin(Admin)
 */
exports.createOne = async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //if User exist
  const userExist = await UserSchema.findOne({ email: req.body.email });
  if (userExist) return res.status(400).send("Email already exists");

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
 * Search a user
 * @param {import('express').Request<{}, {}, showRequestBody, showRequestQuery>} req
 * @param {import('express').Response} res
 * @description Search a user based on name(Admin)
 */
exports.Search = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const users = await UserSchema.find({
      name: { $regex: req.query.str, $options: "$i" },
    })
      .sort(req.query.sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.status(200).json({
      data: users,
    });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
/**
 * Delete a user
 * @param {import('express').Request<{}, {}, showRequestBody, showRequestQuery>} req
 * @param {import('express').Response} res
 * @description To deactivate users account(Admin)
 */
exports.deactivate = async (req, res) => {
  try {
    await UserSchema.findByIdAndUpdate(req.params.id, {
      active: false,
    });

    res.status(200).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    res.status(400).send({ message: err });
  }
};

/**
 * Dashboard for admin
 * @param {import('express').Request<{}, {}, showRequestBody, showRequestQuery>} req
 * @param {import('express').Response} res
 * @description To display a chart based on skills(Admin)
 */
exports.chartData = async (req, res) => {
  try {
    //const doc = await UserSchema.find().select('-_id skills ')
    const doc = await UserSchema.find();

    //const hasAdmin = doc.map(user => user.skillfilter((us)=>us=="node.js"))
    // const hasAdmin = doc.map(ob =>ob.skills).filter(us=>us=="node.js")

    const node = doc.filter((item) => {
      const filter = "node.js";
      return item.skills.indexOf(filter) >= 0;
    });
    const mongodb = doc.filter((item) => {
      const filter = "mongodb";
      return item.skills.indexOf(filter) >= 0;
    });
    const vue = doc.filter((item) => {
      const filter = "vue.js";
      return item.skills.indexOf(filter) >= 0;
    });
    const c = doc.filter((item) => {
      const filter = "c";
      return item.skills.indexOf(filter) >= 0;
    });
    const sql = doc.filter((item) => {
      const filter = "sql";
      return item.skills.indexOf(filter) >= 0;
    });

    res.status(200).json({
      status: "success",
      data: {
        node: node.length,
        mongodb: mongodb.length,
        vue: vue.length,
        c: c.length,
        sql: sql.length,
      },
    });
    // res.render("dashboard", {
    //   node: node.length,
    //   mongodb: mongodb.length,
    //   vue: vue.length,
    //   c: c.length,
    //   sql: sql.length,
    // });
  } catch (error) {
    console.log(error);
  }
};
