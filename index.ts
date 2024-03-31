import { handlePrompt } from "./utils";

export type ChatGPTRequest = {
    prompt: string;
    messages: { role: "user" | "assistant"; content: string }[];
};

const ChatGPTRequest = {
    prompt: "The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.",
    messages: [],
};

const server = Bun.serve<ChatGPTRequest>({
    fetch(req, server) {
        if (server.upgrade(req, { data: { ...ChatGPTRequest } })) return
    },
    websocket: {
        open(ws) {
            ws.send("Welcome to the chat!");
        },
        message(ws, message) {
            if (typeof message !== "string") return
            handlePrompt(ws, message)
                .then(() => {
                    const response = ws.data.messages.filter((message) => message.role === 'assistant').at(-1)?.content!;
                    ws.send(`You said: ${ws.data.prompt}`);
                    ws.send(`Assistant said: ${response.replace(/\n/g, " ")}`);
                })
        },
        close(ws) {
            return
        },
    },
})

process.on("SIGINT", () => {
    server.stop()
})
