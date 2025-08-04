import express from "express"
import cors from "cors"
import {clerkMiddleware} from "@clerk/express"
import { ENV } from "./config/env.js"
import { connectDB } from "./config/db.js"
import userRouter from "./routes/userRoute.js"
import postRouter from "./routes/postRoute.js"
import commentRouter from "./routes/commentRoute.js"
import notificationRouter from "./routes/notificationRoute.js"
import { arcjetMiddleware } from "./middleware/arcjetMiddleware.js"

const app = express()

// Middlewares
app.use(cors())
app.use(express.json())
app.use(clerkMiddleware())
app.use(arcjetMiddleware)

app.get("/", (req,res) =>{
    res.send("Hello from server")
})

app.use("/api/user", userRouter)
app.use("/api/posts", postRouter)
app.use("/api/comments", commentRouter)
app.use("/api/notifications", notificationRouter)

// error handling middleware
app.use((err, req, res, next) => {  
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
})

const startServer = async () =>{
    try {
        await connectDB()
        if (ENV.NODE_ENV !== "production") {
            app.listen(ENV.PORT, () =>{
                console.log(`Server running on PORT: ${ENV.PORT}`)
            })
        }
    } catch (error) {
        console.log("Failed to start server", error.message)
        process.exit(1);
    }
}

startServer()

// export for vercel
export default app;


