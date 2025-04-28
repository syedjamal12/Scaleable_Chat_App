import * as ai from "../config/ai.config.js"
import { Request, Response } from "express";


class AIController {
    static async generateAiPrompt (req:Request,res:Response){
        console.log("yes listemimg")
        try{
            const {prompt} = req.query
            const result = await ai.generateResult(prompt)
            res.send(result)
    
        }catch(error){
            res.status(500).send({message:error.message})
        }
       
    }
}
export default AIController
