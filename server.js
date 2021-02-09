const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const port = process.env.PORT || 3000;

dotenv.config();
app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT,POST,PATCH,DELETE,GET");
    return res.status(200).json({});
  }
  next();
});
const connection = require("./connection");
const userRoutes = require("./routes/userRoutes");
app.use("/uploads", express.static("uploads"));
app.use("/api/users", userRoutes);


app.get("/",(req,res)=>{
  res.render('index',{title:'Home page'});
});
app.use((req, res) => {
  res.status(404).send({ url: req.originalUrl + " not found" });
});

app.listen(port, () => console.log(`listening on port ${port}`));
