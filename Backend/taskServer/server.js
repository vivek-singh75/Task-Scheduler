import express from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

import { z } from "zod";

const app=  express();

app.use(express.json())

async function createMCPserver() {
  const server = new McpServer({
    name: "task scheduler server",
    version: "1.0.0"
  });


  server.tool(
    "create task",
    "create a new task ",
    {
      title : z.string(),
      description : z.string(),
      time : z.number()
    },

    async ({title , description, time}) => {
      console.log("creating tasks" , {title, description, time});

      return{
        content:[
          {
            type: "text",
            text: JSON.stringify({
              message : "task created successfully",
              task: {
                title,
                description, 
                time
              }
            })
          }
        ]
      }
    }
  )
// can add more tools here

  return server
}

app.post("/mcp" , async(req , res)=>{

  try {
    const McpServer = new createMCPserver();

    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined
    });

    await McpServer.connect(transport);

    await transport.handleRequest(res , res , req.body);

  } catch (error) {

    console.error("MCP Error:", error);

    if (!res.headersSent) {

      res.status(500).json({
        error: error.message
      });
    }
  }


})


const PORT = 3000

app.listen(PORT , ()=>{
  console.log(`Task Scheduler MCP Server running on port ${PORT}`)
})