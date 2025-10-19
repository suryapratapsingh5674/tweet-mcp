#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { TwitterApi } from "twitter-api-v2";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = [
  "TWITTER_API_KEY",
  "TWITTER_API_SECRET",
  "TWITTER_ACCESS_TOKEN",
  "TWITTER_ACCESS_SECRET",
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Error: Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

// Initialize Twitter client
const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY!,
  appSecret: process.env.TWITTER_API_SECRET!,
  accessToken: process.env.TWITTER_ACCESS_TOKEN!,
  accessSecret: process.env.TWITTER_ACCESS_SECRET!,
});

const rwClient = twitterClient.readWrite;

// Define the available tools
const TOOLS: Tool[] = [
  {
    name: "post_tweet",
    description:
      "Post a tweet to X (Twitter). The tweet can be up to 280 characters (or more if you have X Premium). You can include text content for your tweet.",
    inputSchema: {
      type: "object",
      properties: {
        text: {
          type: "string",
          description: "The content of the tweet to post",
        },
      },
      required: ["text"],
    },
  },
  {
    name: "post_tweet_with_reply",
    description:
      "Post a tweet as a reply to another tweet. Useful for threading or responding to existing tweets.",
    inputSchema: {
      type: "object",
      properties: {
        text: {
          type: "string",
          description: "The content of the tweet to post",
        },
        reply_to_id: {
          type: "string",
          description: "The ID of the tweet to reply to",
        },
      },
      required: ["text", "reply_to_id"],
    },
  },
];

// Create server instance
const server = new Server(
  {
    name: "twitter-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Handler for listing available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: TOOLS,
  };
});

// Handler for executing tools
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === "post_tweet") {
      const { text } = args as { text: string };

      if (!text || typeof text !== "string") {
        throw new Error("Invalid or missing 'text' parameter");
      }

      if (text.length === 0) {
        throw new Error("Tweet text cannot be empty");
      }

      // Post the tweet
      const tweet = await rwClient.v2.tweet(text);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                success: true,
                message: "Tweet posted successfully!",
                tweet_id: tweet.data.id,
                text: tweet.data.text,
                url: `https://twitter.com/user/status/${tweet.data.id}`,
              },
              null,
              2
            ),
          },
        ],
      };
    } else if (name === "post_tweet_with_reply") {
      const { text, reply_to_id } = args as {
        text: string;
        reply_to_id: string;
      };

      if (!text || typeof text !== "string") {
        throw new Error("Invalid or missing 'text' parameter");
      }

      if (!reply_to_id || typeof reply_to_id !== "string") {
        throw new Error("Invalid or missing 'reply_to_id' parameter");
      }

      if (text.length === 0) {
        throw new Error("Tweet text cannot be empty");
      }

      // Post the tweet as a reply
      const tweet = await rwClient.v2.reply(text, reply_to_id);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                success: true,
                message: "Reply posted successfully!",
                tweet_id: tweet.data.id,
                text: tweet.data.text,
                reply_to: reply_to_id,
                url: `https://twitter.com/user/status/${tweet.data.id}`,
              },
              null,
              2
            ),
          },
        ],
      };
    } else {
      throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error: any) {
    // Handle Twitter API errors
    if (error.code === 403) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                success: false,
                error: "Authentication failed. Please check your Twitter API credentials.",
                details: error.message,
              },
              null,
              2
            ),
          },
        ],
        isError: true,
      };
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              success: false,
              error: error.message || "An error occurred while posting the tweet",
              details: error.data || error.toString(),
            },
            null,
            2
          ),
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Twitter MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
