const urlModel = require("../models/urlModel")
const userModel = require("../models/userModel");
const shortid = require('shortid');

exports.createShortUrl = async (req, res) => {
    try {
        if (req.body.redirectUrl==undefined||req.body.redirectUrl==null||req.body.redirectUrl=="") {
           return res.status(401).json({
                message: "please provide base url"
            })
        }
        const userData= await userModel.findOne({
            email:req.body.authData?.email
        })
        req.body.user=userData?._id
        req.body.shortId = shortid();
        req.body.clickHistory = [];
        const urlData = new urlModel({ ...req.body })
        await urlData.save()
        res.status(201).json({
            message: "url shorted successfully",
            urlData
        })

    } catch (error) {
        res.status(500).json({
            message: "error in createShortUrl function",
            error
        })
    }
}

exports.redirectToMainUrl = async (req, res) => {
    const paramsShortId = req.params.shortId;
    let updatedData = {};
    try {
        updatedData = await urlModel.findOneAndUpdate({
            shortId: paramsShortId
        }, {
            $push: {
                clickHistory: {
                    timestamp: Date.now()
                }
            }
        })


    } catch (error) {
        res.status(500).json({
            message: "error in redirectToMainUrl function ",
            error
        })
    } finally {

        res.redirect(updatedData?.redirectUrl)

    }
}

exports.getShortUrlAnalyticsData=async(req,res)=>{
    const paramsShortId = req.params.shortId;
    let analyticsData = {};
    try {
       
        analyticsData = await urlModel.findOne({
            shortId: paramsShortId
        })


    } catch (error) {
        res.status(500).json({
            message: "error in getShortUrlAnalyticsData function ",
            error
        })
    } finally {

        res.status(201).json({
            message: "url Analytics Data got successfully",
            analyticsData
        })

    }
}

exports.getAllShortUrlDataAsPerUser = async (req, res) => {
    let allData = []
    try {
        allData = await urlModel.find({ user: req.body.authData._id })
    } catch (error) {
        res.status(500).json({
            message: "error in getAllShortUrlDataAsPerUser function ",
            error
        })
    } finally {
        res.status(201).json({
            message: "url data got successfully",
            allData
        })
    }
}

exports.updateUrl = async (req, res) => {
    let updatedData = {}
    try {
        const sId = req.body.shortId
        updatedData = await urlModel.findOneAndUpdate({ shortId: sId }, {
            redirectUrl: req.body.redirectUrl
        },{
            new: true
          })

    } catch (error) {
        res.status(500).json({
            message: "error in updateUrl function ",
            error
        })
    } finally {
       
            res.status(201).json({
                message: "url updated successfully",
                updatedData
            })
        
    }
}

exports.deleteUrl=async(req,res)=>{
    let deletedData = {}
    try {
        const sId = req.body.shortId
        deletedData = await urlModel.findOneAndDelete({ shortId: sId })

    } catch (error) {
        res.status(500).json({
            message: "error in deleteUrl function ",
            error
        })
    } finally {
     
            res.status(201).json({
                message: "url deleted successfully",
                deletedData
            })
        
    }
}
