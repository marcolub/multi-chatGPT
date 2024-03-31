# multi-chat AI assistant using ChatGPT

To install dependencies:

```bash
bun install
```

To run the server:

```bash
bun run index.ts
```

Connect to the WebSocket and start the chat:

```bash
bunx wscat -c ws://localhost:3000
```

You can connect from multiple clients with the same model.