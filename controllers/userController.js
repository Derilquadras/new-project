const UserSchema = require("../models/userModel");

exports.getAll = async (req, res) => {
  try {
    const str = req.query.str;
    const { page = 1, limit = 10 } = req.query;

    //const count = await CarSchema.countDocuments();
    const users = await UserSchema.find()
      .sort(req.query.sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.status(200).json({
      status: "success",
      data: {
        limit: brands.length,
        brands,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
      },
    });
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

exports.adminLogin = async (req, res) => {};
