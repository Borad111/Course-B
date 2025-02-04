const jwt=require('jsonwebtoken');


const isAuthenticatedMiddleWare=async(req,res,next)=>{
    try {
        const token=req.cookies.token;
        if(!token){
             return res.status(401).json({
                success: false,
                message:"User Not isAuthenticated", 
             })
        }
        const decoded=jwt.verify(token,process.env.JWT_KEY);
        if(!decoded){
            return res.status(401).json({
                success:false,
                message:"Token is Invalid"
            })
        }
        req.userId=decoded.userId;
        next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Error in isAuthenticated Api",
            error:error.message,
        })
    }
}   

module.exports={isAuthenticatedMiddleWare }