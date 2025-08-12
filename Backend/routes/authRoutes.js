const express = require('express')
const {login,signup} = require('../controllers/authController')
const verifyToken = require('../middlewares/verifyToken')
const User = require('../models/userModel')

const router = express.Router();

router.post('/signup',signup)
router.post('/login',login)

router.get("/me",verifyToken,async(req,res)=>{
    try{
        const user = await User.findById(req.user.userId).select("-password")
        if(!user){
            return res.status(404).json({
                error:"User not Found"
            })
        }
        res.status(200).json({
            success:true,
            user:user
        })
    }
    catch(err){
        res.status(500).json({error:err.message})
    }
})

module.exports = router