const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const connection = require('./connection')
const userRoutes = require('./routes/userRoutes');


app.use('/api/users', userRoutes);



app.listen(port, () => console.log(`listening on port ${port}`));
