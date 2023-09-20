import { error } from "console"
import express, {Application, Request, Response} from "express"
import process from "process"
import mongoose from "mongoose"


const app: Application = express()
const port: number = 8080
const url: string = "mongodb://0.0.0.0:27017/client"

interface client {
    name: string,
    age: number,
    isActive: boolean;
    email: string
}

interface iClient extends client, mongoose.Document {}
const schemaClient = new mongoose.Schema({
    name: {
        type:String
    },
    email: {
        type:String
    },
    age: {
        type: Number
    },
    isActive: {
        type:Boolean
    },

})

const dataModel = mongoose.model<iClient>("client", schemaClient)

app.use(express.json())
app.post("/api/v1/post-client", async(req: Request, res: Response) => {
    try{
        const {name, email, isActive, age} = req.body
        if(!name || !email || (!isActive && isActive) || !age)
        {
            return res.status(404).json({
                message:"all field is important"
            })
        }
        const  data = await dataModel.create({
            name,
            age,
            isActive,
            email
        })
        return res.status(201).json({
            message: "created sucessfully",
            result: data
        })
    } catch (error: any)
    {
      return res.status(404).json({
        message: error.message
      })
    }
   
})

app.get("/api/v1/get-all", async(req: Request, res:Response) => {
    try{
        const dataAll = await dataModel.find()

        return res.status(200).json ({
            message: "all data",
            result: dataAll
        })
    } catch(error: any) {
        return res.status(404).json({
            message:error.message
        })
    }
})


app.delete("/api/v1/delete-by-id/:id", async(req: Request, res:Response) => {
   try {
    const DataId = req.params.id
    const deleteDataId = await dataModel.findByIdAndRemove(DataId).exec()
    return res.status(200).json({
    sucess: deleteDataId,
    message: "ur sins are forgiven"
    })
    
   } catch (error) {
    return res.status(404).json({
        status: "failed",
        message: "input correct id"
    })
   }
})
    
    

mongoose.connect(url).then(() => {
    console.log("data base connected sucessfully"
    )
}).catch((error:any) => {
    console.log("an error occured", error)
})

const server = app.listen(port, () => {
    console.log("listening om port" , port)
})
process.on ("uncaughtException", (ERROR: Error) => {
    console.log("stop here: uncaughtExcepition")
    console.log(error)
    process.exit(1)
})


process.on("unhandledRejection", (reason: any) => {
    console.log("stop right here: unhandleRejection")
    console.log(reason)

    server.close(() => {
        process.exit(1)
    })
})

 