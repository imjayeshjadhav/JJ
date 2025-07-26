import express from "express"
import cors from "cors"
import {clerkMiddleware} from "@clerk/express"
import { ENV } from "./config/env.js"
import { connectDB } from "./config/db.js"
import userRouter from "./routes/userRoute.js"
import postRouter from "./routes/postRoute.js"

const app = express()

// Middlewares
app.use(cors())
app.use(express.json())
app.use(clerkMiddleware())

app.get("/", (req,res) =>{
    res.send("Hello from server")
})

app.use("/api/user", userRouter)
app.use("/api/posts", postRouter)
app.use("/api/comments", commentRouter)

// error handling middleware
app.use((err, req, res, next) => {  
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
})

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


