const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const port = process.env.PORT || 3000;

dotenv.config();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const connection = require("./connection");
const userRoutes = require("./routes/userRoutes");

app.use("/api/users", userRoutes);

app.use((req, res) => {
  res.status(404).send({ url: req.originalUrl + " not found" });
});

app.listen(port, () => console.log(`listening on port ${port}`));
