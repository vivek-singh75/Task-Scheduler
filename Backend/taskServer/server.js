import express from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

import { z } from "zod";
import { type } from "node:os";

const app=  express();

app.use(express.json())

const allTask = []

function createMCPServer() {
  const server = new McpServer({
    name: "task scheduler server",
    version: "1.0.0"
  });


  server.tool(
    "createTask",
    "create a new task ",
    {
      title : z.string(),
      description : z.string(),
      time : z.string()
    },

    async ({title , description, time}) => {
      console.log("creating tasks" , {title, description, time});

      allTask.push({
        title: title,
        description: description,
        time : time
      })

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

  server.tool(
    "listTask",
    "list all task",
    {},
    
    async () => {

      console.log("all scheduled task are" , allTask)

      return{
        content:[
          {
            type: "text",
            text: JSON.stringify(allTask)
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
    const McpServer =  createMCPServer();

    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined
    });

    await McpServer.connect(transport);

    await transport.handleRequest(req , res , req.body);

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