const express = require("express");
const connectDB = require("./config/db");
const cors =require("cors");
const dotenv = require("dotenv");
const urlRoutes=require("./routes/urlRoutes")
const authRoutes=require("./routes/authRoutes")

dotenv.config();
connectDB();
const app = express();
app.use(cors());
app.use(express.json()); 


app.use("/api/v1/url",urlRoutes)
app.use("/api/v1/auth",authRoutes)

const PORT = process.env.PORT;
app.listen(
  PORT,
  console.log(`Server running on PORT ${PORT}...`.yellow.bold)
);