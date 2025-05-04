import * as ai from "../config/ai.config.js";
class AIController {
    static async generateAiPrompt(req, res) {
        console.log("yes listemimg");
        try {
            const { prompt } = req.query;
            const result = await ai.generateResult(prompt);
            res.send(result);
        }
        catch (error) {
            res.status(500).send({ message: error.message });
        }
    }
}
export default AIController;
