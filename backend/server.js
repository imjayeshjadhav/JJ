import express from "express"
import cors from "cors"
import {clerkMiddleware} from "@clerk/express"
import { ENV } from "./config/env.js"
import { connectDB } from "./config/db.js"
import userRouter from "./routes/userRoute.js"

const app = express()

// Middlewares
app.use(cors())
app.use(express.json())
app.use(clerkMiddleware())

app.get("/", (req,res) =>{
    res.send("Hello from server")
})

app.use("/api/user", userRouter)

const startServer = async () =>{
    try {
        await connectDB()
        app.listen(ENV.PORT, () =>{
            console.log(`Server running on PORT: ${ENV.PORT}`)
        })
    } catch (error) {
        console.log("Failed to start server", error.message)
        process.exit(1);
    }
}

startServer()


