import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash",
    // systemInstruction:'just give me in short and in easy way'
 });

export const generateResult = async (prompt)=>{
    const result = await model.generateContent(prompt)

    return result.response.text()
}
