
# Example AI Chat

This is a demo AI chat app that uses tools from configured MCP servers

## Getting Started

2. Copy `.env.example` to `.env.local`
3. In `.env`, fill in the keys for GROQ_API_KEY. See https://groq.com/ to get a key

  ```sh
    GROQ_API_KEY=your-api-key
  ```

Then, run the development server:

```bash
npm install
npm run dev
```

Then, configure the available MCP servers:

The MCP Servers are configured in [./app/lib/init.ts](./app/lib/init.ts). Update this based on the available MCP servers.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

