// backend/index.js

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

// Debugging: Log the loaded API key
console.log("Loaded API Key:", process.env.GOOGLE_API_KEY);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: 'http://localhost:3000' // Update to your frontend's deployed URL in production
}));
app.use(express.json());

// Initialize GoogleGenerativeAI with API Key
let genAI;
try {
    genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
} catch (initError) {
    console.error('Failed to initialize GoogleGenerativeAI:', initError);
    process.exit(1); // Exit the application if initialization fails
}

// Endpoint to generate roadmap
app.post('/api/generate-roadmap', async (req, res) => {
    const { topic } = req.body;

    if (!topic) {
        return res.status(400).json({ error: 'Topic is required' });
    }

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const prompt = `Provide a detailed and structured learning roadmap for ${topic} from beginner to advanced levels, formatted in Markdown. Include sections, bullet points, and links to relevant videos and articles for each topic.`;

        // Debugging: Log the prompt
        console.log("Generated Prompt:", prompt);

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text();

        // Debugging: Log the response text
        console.log("Generated Roadmap:", text);

        res.json({ roadmap: text });
    } catch (error) {
        console.error('Error generating roadmap:', error);
        res.status(500).json({ error: 'Failed to generate roadmap', details: error.message });
    }
});

// Endpoint to handle Q&A
app.post('/api/ask-question', async (req, res) => {
    const { question } = req.body;

    if (!question) {
        return res.status(400).json({ error: 'Question is required' });
    }

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const prompt = `Answer the following question in a clear and concise manner: ${question}`;

        // Debugging: Log the prompt
        console.log("Generated Question Prompt:", prompt);

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const answer = await response.text();

        // Debugging: Log the response text
        console.log("Generated Answer:", answer);

        res.json({ answer: answer });
    } catch (error) {
        console.error('Error generating answer:', error);
        res.status(500).json({ error: 'Failed to generate answer', details: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
