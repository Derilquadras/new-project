const jwt = require("jsonwebtoken");
const UserSchema = require("../models/userModel");
/**
 * Authorization
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description To protect the routes with a token(Admin)
 */
exports.protect = async (req, res, next) => {
  try {
    // 1) check if the token is there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return res
        .status(401)
        .send("You are not logged in! Please login in to continue!");
    }

    // 2) Verify token
    const decode = jwt.verify(token, process.env.TOKEN_SECRET);

    // 3) check if the user is exist (not deleted)
    const user = await UserSchema.findById(decode._id);
    if (!user) {
      return res.status(401).send({ fail: "This user is no longer exist" });
    }
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

/**
 * Restriction
 * @param {*} roles
 * @description Authorization check if the user have rights to do this action
 */
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(401)
        .send({ fail: "You are not allowed to do this action" });
    }
    next();
  };
};
