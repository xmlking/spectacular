# AI Agents

**Agentic AI** to transform  Web Apps into Hybrid AI WebApps

## Features

Chat UI Features

- Auto-scroll message area with smart scrolling behavior
- Auto-resize message input with file upload support
- Built-in prompt suggestions
- Message actions (copy, rate response, etc.)
- Elegant loading states and transitions
- Markdown support in messages
- File attachments and image preview
- Dark mode support
- TypeScript support

## Requirements

- Message history display
- Real-time typing indicators
- File attachment support
- Auto-scrolling with manual override
- Prompt suggestions for empty states
- Stop generation capability
- Fully customizable styling
- Auto-resizing textarea
- File attachments support
- Drag and drop file uploads
- Submit on Enter (configurable)
- Stop generation button
- GitHub Flavored Markdown support
- Consistent typography and spacing
- Styled tables, lists, and code blocks
- Responsive design
- Theme-aware styling
- Powered by @unifiedjs's remark
- Message List
- Chat Message
- Prompt Suggestions
- Typing Indicator
- Copy Button

## Implementation

Use [shadcn-chatbot-kit](https://github.com/Blazity/shadcn-chatbot-kit) for UI components and Vercel [AI-Swarm SDK](https://github.com/vercel/ai/tree/main/packages/swarm) for backend

## TODO

- [Natural Language PostgreSQL](https://github.com/vercel-labs/natural-language-postgres), [Demo](https://natural-language-postgres.vercel.app/)

## References

- Chat Apps
  - Vercel Svelte Chat [Demo](https://ai-chatbot-svelte.vercel.sh/), [Source](https://github.com/vercel/ai-chatbot-svelte)
  - Vercel React Chat [Docs](https://chat-sdk.dev/), [Demo](https://ai-chatbot-svelte.vercel.sh/) [Source](https://github.com/vercel/ai-chatbot)
  - shadcn-chatbot-kit [Docs](https://shadcn-chatbot-kit.vercel.app/docs), [Demo](https://shadcn-chatbot-kit.vercel.app/), [Source](https://github.com/Blazity/shadcn-chatbot-kit) - React
  - CopilotKit - Headleass Copilot UI [components](https://docs.copilotkit.ai/guides/custom-look-and-feel/built-in-ui-components), [Guardrails](https://docs.copilotkit.ai/guides/guardrails), Copilot [Textarea](https://docs.copilotkit.ai/guides/copilot-textarea) , [coagents](https://www.copilotkit.ai/coagents/)
  - [shadcn-chatbot-kit](https://github.com/Blazity/shadcn-chatbot-kit)- Works seamlessly with shadcn CLI,Voice Input,Copy & Paste Components
  - [assistant-ui](https://github.com/assistant-ui/assistant-ui) - TypeScript/React library for AI chat.

- Web AI
- [AiBrow](https://aibrow.ai/) - Use *in-browser* and *on-device* AI to enable powerful and private genAI features in your Web Applications.
  - aibrow All [Demos](https://aibrow.ai/demo.html)
  - Chrome Built-in AI [Playground](https://ai.zaps.dev/)
  - AI Agents using Web AI
- [WebLLM](https://webllm.mlc.ai/) - High-Performance In-Browser LLM Inference Engine. [Demo](https://chat.webllm.ai/)
  - [Build a local and offline-capable chatbot with WebLLM](https://web.dev/articles/ai-chatbot-webllm)
  - Example **Todo App** with [web-llm](https://github.com/christianliebel/todo-ai/tree/web-llm) and [prompt-api](https://github.com/christianliebel/todo-ai/tree/prompt-api)

- Agentic Frameworks
  - [eliza](https://elizaos.github.io/eliza/) (TypeScript) - is a powerful multi-agent simulation framework designed to create, deploy, and manage autonomous AI agents.
  - Vercel Swarm
    - SDK news <https://x.com/lgrammel/status/1852647732185285106?s=46>
    - API <https://github.com/vercel/ai/tree/main/packages/swarm>
    - Video <https://youtu.be/Rs8B8fQsl28>
- [**mastra**](https://mastra.ai/) - The TypeScript Agent Framework

- Agentic Platforms
  - **n8n** [Self-hosted AI starter kit](https://github.com/coleam00/ai-agents-masterclass/tree/main/local-ai-packaged)
  - [arkai](https://arkai.app/) - AI Workflows for everyone
  - [flowiseai](https://flowiseai.com/) - Open source low-code tool for developers to build customized LLM orchestration flow & AI agents

- AI Databases
  - [HelixDB](https://github.com/HelixDB/helix-db) - is a graph-vector database built for performance and simplicity.
  - [kuzudb](https://github.com/kuzudb/kuzu) - Embedded property graph database.Vector search and full-text search built in

- Libs
  - Gradual JSON Parser for Generative Pretrained Transformers [gjp-4-gpt](https://github.com/JacksonKearl/gjp-4-gpt)
  - zod-to-json-schema [openai-zod-to-json-schema](https://github.com/transitive-bullshit/openai-zod-to-json-schema)
  - Vercel AI SDK [Tutorial](https://www.aihero.dev/vercel-ai-sdk-tutorial)
  - Building AI Agent Workflows With Vercel’s AI SDK: [A Practical Guide](https://www.callstack.com/blog/building-ai-agent-workflows-with-vercels-ai-sdk-a-practical-guide)
  - [flows-ai](https://flows-ai.callstack.com/) - A lightweight, type-safe AI workflow orchestrator inspired by Anthropic's agent patterns. Built on top of Vercel AI SDK.
  - Vercel AI SDK [Agents](https://sdk.vercel.ai/docs/foundations/agents)

- AI Infra
  - [Arch Gateway](https://github.com/katanemo/archgw) - The intelligent (edge and LLM) proxy server for agentic applications.
  - [HelixDB](https://github.com/HelixDB/helix-db) - is a graph-vector database built for performance and simplicity.

- AI Protocols
  - **[AG-UI](https://docs.ag-ui.com/introduction):** Deep agent-user collaboration, by bringing agents into frontend applications.
  - **[MCP](https://modelcontextprotocol.io/introduction):** Standardizes tool calls and context handling across different models
  - **[A2A](https://google.github.io/A2A/):** Facilitates agent-to-agent communication and collaboration

- IDE GitHub Copilot
  - [copilot-instructions](https://copilot-instructions.md/)
  - **llms.txt**
    - [svelte-llm](https://svelte-llm.khromov.se/) - Recommended - LLM Distilled
    - [llmctx](https://llmctx.com/)
    - [shadcn-svelte](https://llmctx.com/shadcn-svelte)
    - [svelte.dev](https://svelte.dev/docs/llms)

- Tutorials
  - [AI Agents Masterclass](https://github.com/coleam00/ai-agents-masterclass)

## Terms

Model charectors (e.g., `Llama-3.2-3B-Instruct-q4f32_1-MLC`)

- **Token:** The smallest unit of text an LLM can process.
- **Context window:** The maximum number of tokens the model can process.
- **Parameters or weights:** The internal variables learned during training, counted in billions.
- **Quantization:** The number of bits representing the weights. More bits mean higher precision, but also higher memory usage.
- **Floating-point number formats:** 32-bit floating numbers (full-precision, F32) offer better accuracy, while 16-bit floating numbers (half-precision, F16) have higher speeds and less memory usage but require compatible hardware.

Model prompts

- **System prompt:** This prompt defines the model's behavior, role, and character. It can also be used for grounding, that is, feeding custom data into the model that is not part of its training set (such as your domain-specific data). You can only specify one system prompt.
- **User prompt:** Prompts entered by the user.
- **Assistant prompt:** Answers from the assistant, optional.

> [!NOTE]
> User and assistant prompts can be used for **N-shot** prompting by providing natural language examples to the LLM on how it should behave or respond.

Example:

```js
const messages = [
  { role: "system",
    content: `You are a helpful assistant. You will answer questions related to
    the user's to-do list. Decline all other requests not related to the user's
    todos. This is the to-do list in JSON: ${JSON.stringify(todos)}`
  },
  {role: "user", content: "How many open todos do I have?"}
];
```
