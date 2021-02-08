const router = require("express").Router();

const verify = require("../middleware/verifyToken");
const UserSchema = require("../models/userModel");
const {
  getAll,
  createOne,
  deactivate,
  getOne,
  Search,
  chartData,
} = require("../controllers/admincontroller");
const { Register, Login } = require("../controllers/userController");

const adminController = require("../controllers/admincontroller");
const upload = require("../middleware/multerUpload");

router.post("/login", Login);
router.post("/register", upload.single("profilePicture"), Register);
// router.post("/abc", async (req, res) => {
//   const user = new UserCSchema({
//     Agreeableness: req.body.Agreeableness,
//     Drive: req.body.Drive,
//     Luck: req.body.Luck,
//     Openess: req.body.Openess,
//   });
//   res.status(200).json({ status: "success", user });
// });
router.get("/dashboard", chartData);
router.use(verify.protect);

// Only admin have permission to access for the below APIs
router.use(verify.restrictTo("admin"));

router.route("/").get(getAll).post(upload.single("profilePicture"), createOne);

router.route("/search").get(Search);

router.route("/:id").get(getOne);

router.delete("/:id", deactivate);

router.use(verify.restrictTo("admin"));

module.exports = router;
