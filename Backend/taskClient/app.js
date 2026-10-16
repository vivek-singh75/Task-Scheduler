import dotenv from"dotenv"
dotenv.config()
import express  from"express";
import {createTask , listAlltask} from "./src/taskClient.js"

const app = express();

app.use(express.json());  
  
app.post("/create" , createTask)

app.get("/list" , listAlltask)

const PORT = 3001

app.listen(PORT , ()=>{
    console.log(`server is running on port ${PORT}`)
});


