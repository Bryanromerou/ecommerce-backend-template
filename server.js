const express = require("express");
const cors = require("cors");
require('dotenv').config();
const routes = require('./routes')

const PORT = process.env.PORT || 4000;
const app = express();

// const corsOptions = { origin: "*" };//This Whitelist this site

app.use(express.json());
app.use(cors());

app.use("/api/v1/users",routes.users)
app.get("/",(req,res)=>{
  res.send("home")
});

app.listen(PORT,()=>{console.log(`Server now running on port ${PORT}`)})