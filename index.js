var express = require("express");
require("dotenv").config();
var app = express();
const v1 = require("./routes/");

app.use('/postman', express.static('./postman/'));
app.use(express.json())
app.use('/v1', v1);

app.use('/', (req, res)=>{
  res.redirect("http://35.184.178.64:3000/v1/docs");
})

app.listen(3000, () => console.log('now graphql at localhost:3000'));
