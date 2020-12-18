var express = require("express");
require("dotenv").config();
var app = express();
const v1 = require("./routes/");

app.use('/uploads', express.static('./uploads/'));
app.use(express.json())
app.use('/v1', v1);



app.listen(4000, () => console.log('now graphql at localhost:4000'));
