import { Request,Response,NextFunction } from "express";
import jwt from "jsonwebtoken";

const authMiddleware = (req:Request, res:Response, next:NextFunction) =>{
    console.log("tokennn",req)
    const authHandler = req.headers.authorization;

    if(authHandler==null || authHandler==undefined)
    {
        res.status(401).json({
            status:401,
            message:"UnAuthorized"
        })
    }
    const token = authHandler.split(" ")[1]
    jwt.verify(token, process.env.JWT_SECRET,(err,user)=>{
        if(err)
        {
            res.status(401).json({
                status:401,
                message:"UnAuthorized"
            })
        }
        console.log("userrrrr",user)
        req.user = user as AuthUser
        next()
    })
}

export default authMiddleware