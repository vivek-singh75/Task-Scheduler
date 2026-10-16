import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import {taskDetails} from "./ai.service.js"

const client  = new Client({
    name : "task scheduler client",
    version: "1.0.0"
});

const transport = new StreamableHTTPClientTransport(
    new URL("http://localhost:3000/mcp")
);


await client.connect(transport);
 
console.log(`mcp client is connected to the mcp server`);

const tools = await client.listTools();

console.log("Availble tools are" ,
    tools.tools.map(tool => tool.name) 
);

let history = []

export async function createTask(req , res) { 
    const { userQuery } = req.body;
    // const {title ,  description , time } = req.body;

    if(!userQuery){
        return res.status(400).json({
            message: "user query is not defined"
        })
    }

    history.push({
        type: "text",
        text: `${userQuery} user Input`
    });

    const aiResponse = await taskDetails(history)

    let response = JSON.parse(aiResponse);

        // AI says information is missing
    if (response.status === "missing") {
            response = response.message
            history.push({
                type : "text",
                text: `${response} model previous Output`
            })
            console.log(response)
            return res.status(400).json({
                message: response
            });
    }
    console.log(history)

    console.log(response)

    const result = await client.callTool({
        name : "createTask",
        arguments: {
            title: response.title,
            description : response.description,
            time : response.time
        }
    }) 

    const output = JSON.parse(result.content[0].text)

    res.status(200).json({
        result : output
    })
}



export async function listAlltask(req , res) {
    
    const result = await client.callTool({
        name : "listTask",
        arguments:{}
    })

    const finalResult = JSON.parse(result.content[0].text)


    res.status(200).json({
        message : "all task are",
        tasks :  finalResult
    })
}