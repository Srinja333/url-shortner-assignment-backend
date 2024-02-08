const express = require("express");
const { signup,signin, allUsers, tokenVerification, getToken } = require("../controllers/authController");


const router = express.Router();

router.post("/signup",signup)
router.post("/signin",signin)
router.get("/",allUsers)
router.get("/verifyToken",getToken,tokenVerification)
module.exports = router;