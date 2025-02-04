const dotenv=require('dotenv');
dotenv.config();
const jwt=require('jsonwebtoken');


const GenaratToken=(res,user)=>{
    const token=jwt.sign({userId:user._id},process.env.JWT_KEY,{expiresIn:'1d'})
    res.cookie("token",token,{
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24*60*60*1000, // 1 divas
    }).json({
        success:true, // 1 day
        message:"Logged In Successfully",
        user,
        token
    })
}

module.exports={GenaratToken}