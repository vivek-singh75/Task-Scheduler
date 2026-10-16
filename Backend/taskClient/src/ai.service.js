import dotenv from"dotenv"
dotenv.config()
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ 
    apiKey : process.env.GEMINI_API_KEY
});

const system_prompt = `
You are the task information extractor for a task scheduler application.

Your job is to extract these three fields from the user's request:

1. title - string
2. description - string
3. time - string

Rules:

- If title is missing, ask the user for the title.
- If time is missing, ask the user for the time.
- If description is missing, generate a short description using only the information provided by the user.
- Do not invent any information other than a simple description when it is missing.
- If all required information is available, return the extracted task details.
- Do not call MCP tools yourself.

Return your result in JSON format with:

{
  "status": "complete" | "missing",
  "title": string | null,
  "description": string | null,
  "time": string | null,
  "message": string | null
}
`;

export async function taskDetails(history) {
    const interaction = await ai.interactions.create({

        model: "gemini-3.5-flash-lite",

        input: history,
        
        system_instruction: system_prompt

    });

    // console.log(interaction.output_text);

    console.log(interaction);

    return interaction.output_text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
}
