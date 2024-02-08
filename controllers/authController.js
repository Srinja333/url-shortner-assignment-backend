const jwt = require("jsonwebtoken")
const userModel = require("../models/userModel");
const bcrypt = require('bcrypt');
const validator = require('validator')

exports.signup = async (req, res) => {
    try {
        if (!req.body.name) {
            return res.status(400).send({
                success: false,
                message: "Please provide name",
            });
        }
        if (!req.body.email) {
            return res.status(400).send({
                success: false,
                message: "Please provide email",
            });
        }
        if (validator.isEmail(req.body.email) == false) {
            return res.status(400).send({
                success: false,
                message: "Please provide valid email",
            });
        }
        if (!req.body.password) {
           return  res.status(400).send({
                success: false,
                message: "Please provide password"
            });
        }
        if (req.body.password.length < 6) {
            return  res.status(400).json({
                success: false,
                message: "Password length must be greater than 6",
            });
        }

        const email = req.body.email;
        const userData = await userModel.find({ email: email });

        if (userData.length !== 0) {
            res.status(400).send({
                success: false,
                message: "user already registered",
            });
        }
        else {
         

            const password = req.body.password
            const hashedPassword = await new Promise((resolve, reject) => {
                bcrypt.hash(password, 10, function (err, hash) {
                    if (err) reject(err)
                    resolve(hash)
                });
            })
            req.body.password = hashedPassword
            const savedUserData = new userModel({ ...req.body })
            await savedUserData.save()
            res.status(201).json({
                success: true,
                message: "user registered successfully",
                savedUserData
            })

        }
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error in signup function",
            error
        });
    }
};

exports.signin = async (req, res) => {
    try {
        if (!req.body.email) {
            return res.status(400).send({
                success: false,
                message: "Please provide email",
            });
        }
        if (validator.isEmail(req.body.email) == false) {
           return res.status(400).send({
                success: false,
                message: "Please provide valid email",
            });
        }
        if (!req.body.password) {
            return res.status(400).send({
                success: false,
                message: "Please provide password",
            });
        }
        if (req.body.password.length < 6) {
            return res.status(400).send({
                success: false,
                message: "Password length must be greater than 6",
            });
        }

        const email = req.body.email;
        const password = req.body.password;

        const userData = await userModel.find({ email: email });
        
        if (userData.length !== 0) {
            const hash=userData[0]?.password
            const isValidPassword = await bcrypt.compare(password, hash)
            if(isValidPassword){
            const user = userData[0]
            
            jwt.sign(JSON.parse(JSON.stringify(user)) , process.env.JWT_SECRET_KEY,(error, token) => {
                if (error) {

                    throw "error in token creation"

                }
                else {
                    res.status(201).send({
                        success: true,
                        message: "user successfully sign in",
                        token,
                        user
                    });
                }
            })
            }
            else{
                throw "Password not matched"
            }
        }
        else {
            throw "user not registered"
        }
    } catch (error) {
        res.status(500).send({
            success: false,
            error,
            message: "Error in signin",
        });
    }
};

exports.getToken = (req, res, next) => {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== undefined) {
        const bearer = bearerHeader.split(" ")
        const token = bearer[1]
        req.token = token
        next()
    } else {
        res.status(500).send({
            success: false,
            message: "can't get token",
        })
    }
}

exports.verifyToken = (req, res, next) => {
    jwt.verify(req.token, process.env.JWT_SECRET_KEY, (err, authData) => {
        if (err) {
            res.status(500).send({
                success: false,
                message: "can't verify token",
            })
        } else {
            req.body.authData=authData;
            next()
        }
    })
}

exports.allUsers=async(req,res)=>{
    try{
const allUserData=await userModel.find({})
if(allUserData){
    res.status(201).json({
        success:true,
        message:"all user data",
        allUserData
    })
}
    }catch(error){
        res.status(500).send({
            success: false,
            error,
            message: "Error to get all user data",
        });
    }
}


exports.tokenVerification = (req, res) => {
    jwt.verify(req.token, process.env.JWT_SECRET_KEY, (err, authData) => {
        if (err) {
            res.status(500).send({
                success: false,
                message: "can't verify token",
            })
        } else {
            res.status(200).send({
                success: true,
                message: "token verified",
                authData
            })
        }
    })
}

