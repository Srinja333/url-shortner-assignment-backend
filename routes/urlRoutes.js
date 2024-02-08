const express = require("express");
const {createShortUrl,redirectToMainUrl,getShortUrlAnalyticsData,getAllShortUrlDataAsPerUser,updateUrl, deleteUrl}=require("../controllers/urlController")
const{getToken,verifyToken}=require("../controllers/authController")


const router = express.Router();


router.post("/short-url",getToken,verifyToken,createShortUrl)
router.get("/getAll",getToken,verifyToken,getAllShortUrlDataAsPerUser)
router.get("/:shortId",redirectToMainUrl)
router.get("/analytics/:shortId",getToken,verifyToken,getShortUrlAnalyticsData)
router.put("/",getToken,verifyToken,updateUrl)
router.delete("/",getToken,verifyToken,deleteUrl)

module.exports = router;