import expressAsyncHandler from "express-async-handler";
import User from "../models/user.js";
import jwt from "jsonwebtoken";

export const verifyAuth = expressAsyncHandler(async( req , res, next)=>{
    try {
        const token =  req.header("Authorization")?.replace("Bearer " , "")
        if(!token){
           return res.status(401).json({ message: "Unauthorized request" });
        }
        let decodedToken;
        try {
           decodedToken= jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            console.log(error)
            return res.status(401).json({ message: "Your Session has been expired",expiredSession:true });
        }
        if(!decodedToken){
            return res.status(401).json({ message: "Your Session has been expired",expiredSession:true });
         }

    
        const  user = await User.findById(decodedToken._id).select("-password");

         if(!user){
           return res.status(401).json({ message: "Invalid token" });
        }
        req.user = user;
        next();
    } catch (error) {
        console.log(error)
        return res.status(401).json({ message: "Your Session has been expired",expiredSession:true });
    }

})