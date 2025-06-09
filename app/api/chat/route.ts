// import { openai } from "@ai-sdk/openai";
import { groq } from '@ai-sdk/groq';
import { frontendTools } from "@assistant-ui/react-ai-sdk";
import { streamText, Tool, tool } from "ai";
import { z } from 'zod';
import { mcpRegistry } from '@/app/lib/mcpRegistry';

// export const runtime = "edge";
export const runtime = "nodejs";
export const maxDuration = 30;

// Initialize MCP registry when the module loads
import { initializeMCPRegistry } from '@/app/lib/init';

initializeMCPRegistry().catch(console.error);

const otherTools = {
  weather: tool({
    description: 'Get the weather in a location (fahrenheit)',
    parameters: z.object({
      location: z.string().describe('The location to get the weather for'),
    }),
    execute: async ({ location }) => {
      const temperature = Math.round(Math.random() * (90 - 32) + 32);
      return {
        location,
        temperature,
      };
    },
  }),
  convertFahrenheitToCelsius: tool({
    description: 'Convert a temperature in fahrenheit to celsius',
    parameters: z.object({
      temperature: z
        .number()
        .describe('The temperature in fahrenheit to convert'),
    }),
    execute: async ({ temperature }) => {
      const celsius = Math.round((temperature - 32) * (5 / 9));
      return {
        celsius,
      };
    },
  }),
  getMCPServerTools: tool({
    description: 'Gets the list of available MCP server tools',
    parameters: z.object({}),
    execute: async () => {
      const tools: Record<string, Tool> = { 
        ...mcpRegistry.getTools(),
        ...otherTools,
      };
      return {
        tools,
      };
    },
  })

}



export async function POST(req: Request) {
  const { messages, system, tools } = await req.json();

  try {
    // const transport = new StreamableHTTPClientTransport(
    //   new URL('http://localhost:4000/mcp'),
    // );
    // const customClient = await createMCPClient({
    //   transport,
    // });

    // const toolSetStreamableHTTP = await customClient.tools();
    // const mcpTools = {
    //   ...toolSetStreamableHTTP, 
    // };

    // console.log('mcpTools:', mcpTools);

    const mcpTools = mcpRegistry.getTools();
    console.log('mcpTools:', mcpTools);

    const result = streamText({
      // model: openai("gpt-4o"),
      model: groq("meta-llama/llama-4-scout-17b-16e-instruct"),
      // model: groq("llama3-8b-8192"),
      // model: groq("llama3-70b-8192"),
      // model: groq("gemma2-9b-it", {
      //   parallelToolCalls: true,
      // }),
        // model: groq("llama3-8b-8192", {
        //   parallelToolCalls: true,
        // }),
      messages,
      // forward system prompt and tools from the frontend
      toolCallStreaming: true,
      system,
      tools: {
        ...frontendTools(tools),
        ...otherTools,
        ...mcpTools,
      },
      onFinish: async () => {
        console.log('onFinish');
        // await customClient.close();
      },
      // Closing clients onError is optional
      // - Closing: Immediately frees resources, prevents hanging connections
      // - Not closing: Keeps connection open for retries
      onError: async error => {
        console.error('onError:', error);
        // await customClient.close();
      },
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}



// // import { openai } from "@ai-sdk/openai";
// import { groq } from '@ai-sdk/groq';
// import { frontendTools } from "@assistant-ui/react-ai-sdk";
// import { streamText, tool } from "ai";
// import { z } from 'zod';
// import { experimental_createMCPClient as createMCPClient } from "ai";
// import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

// export const runtime = "edge";
// export const maxDuration = 30;

// // const mcpClient = await createMCPClient({

// //   // TODO adjust this to point to your MCP server URL
// //   transport: {
// //     type: "",
// //     url: "http://localhost:4000/mcp",
// //   },
// // });

// // const mcpTools = await mcpClient.tools();

// const otherTools = {
//   weather: tool({
//     description: 'Get the weather in a location (fahrenheit)',
//     parameters: z.object({
//       location: z.string().describe('The location to get the weather for'),
//     }),
//     execute: async ({ location }) => {
//       const temperature = Math.round(Math.random() * (90 - 32) + 32);
//       return {
//         location,
//         temperature,
//       };
//     },
//   }),
//   convertFahrenheitToCelsius: tool({
//     description: 'Convert a temperature in fahrenheit to celsius',
//     parameters: z.object({
//       temperature: z
//         .number()
//         .describe('The temperature in fahrenheit to convert'),
//     }),
//     execute: async ({ temperature }) => {
//       const celsius = Math.round((temperature - 32) * (5 / 9));
//       return {
//         celsius,
//       };
//     },
//   })
// }



// export async function POST(req: Request) {
//   const { messages, system, tools } = await req.json();

//   try {
//     const transport = new StreamableHTTPClientTransport(
//       new URL('http://localhost:4000/mcp'),
//     );
//     const customClient = await createMCPClient({
//       transport,
//     });

//     const toolSetStreamableHTTP = await customClient.tools();
//     const mcpTools = {
//       ...toolSetStreamableHTTP, 
//     };

//     // console.log('mcpTools:', mcpTools);


//     const result = streamText({
//       // model: openai("gpt-4o"),
//       model: groq("meta-llama/llama-4-scout-17b-16e-instruct"),
//       // model: groq("llama3-8b-8192"),
//       // model: groq("llama3-70b-8192"),
//       // model: groq("gemma2-9b-it", {
//       //   parallelToolCalls: true,
//       // }),
//         // model: groq("llama3-8b-8192", {
//         //   parallelToolCalls: true,
//         // }),
//       messages,
//       // forward system prompt and tools from the frontend
//       toolCallStreaming: true,
//       system,
//       tools: {
//         ...frontendTools(tools),
//         ...otherTools,
//         ...mcpTools,
//       },
//       onFinish: async () => {
//         console.log('onFinish');
//         await customClient.close();
//       },
//       // Closing clients onError is optional
//       // - Closing: Immediately frees resources, prevents hanging connections
//       // - Not closing: Keeps connection open for retries
//       onError: async error => {
//         console.error('onError:', error);
//         await customClient.close();
//       },
//     });

//     return result.toDataStreamResponse();
//   } catch (error) {
//     console.error(error);
//     return new Response("Internal Server Error", { status: 500 });
//   }
// }
