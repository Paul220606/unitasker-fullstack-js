import {model} from "../configs/gemini.js"

class AIController {
    async suggest(req, res) {
        const {title, description, categories} = req.body
        try {
            const prompt = `
You are a task management assistant.
Given a task title and description, suggest:
1. A category from exactly these options: ${categories}
2. A priority from exactly these options: 'Low', 'Medium', 'High'

Task title: ${title}
Task description: ${description || "No description provided"}

Respond in JSON format only, no explanation, no markdown:
{"category": "...", "priority": "..."}
`
            const result = await model.generateContent(prompt)
            const text = result.response.text().trim()
            const suggestion = JSON.parse(text.replace(/```json|```/g, '').trim())
            return res.status(200).json({success: true, suggestion})
        } catch (err) {
            console.log(err)
            return res.status(500).json({success: false, message: "AI suggestion failed"})
        }
    }
}

const aiController = new AIController()
export default aiController