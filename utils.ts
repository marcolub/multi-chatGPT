import OpenAI from "openai";

import type { ServerWebSocket } from "bun";
import type { ChatGPTRequest } from ".";

const openai = new OpenAI({ apiKey: Bun.env.OPENAI_API_KEY });

export async function handlePrompt(ws: ServerWebSocket<ChatGPTRequest>, prompt: string) {
    ws.data.prompt = prompt;
    ws.data.messages.push({ role: "user", content: prompt });
    await chatgpt(prompt)
        .then((response) => {
            ws.data.messages.push({ role: "assistant", content: response });
        })
}

async function chatgpt(message: string | Buffer) {
    const stream = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message.toString() }],
        stream: true,
    });
    var messages = [];
    for await (const chunk of stream) {
        const response = chunk.choices[0]?.delta?.content || "";
        messages.push(response);
    }
    return messages.join("\n");
}
