import { aj } from "../config/arcjet.js";

export const arcjetMiddleware = async (req,res,next) =>{
    try {
        const decision = await aj.protect(req,{
            requested :1,
        })

        if(decision.isDenied) {
            if (decision.reason.isRateLimit()){
                return res.status(429).json({
                    error :"Too many requests",
                    message: "Rate limit exceeded. Please try again later."
                });
            } else if (decision.reason.isBot()) {
                return res.status(403).json({
                    error: "Bot detected",
                    message: "Access denied for bots."
                });
            } else{
                return res.status(403).json({
                    error: "Access denied",
                    message: "You are not allowed to access this resource."
                });
            }
        }

        // check the spoofed bots
        if (decision.results.some((result) => result.reason.isBot())) {
            return res.status(403).json({
                error: "Bot detected",
                message: "Access denied for bots."
            });
        }

        next();

    } catch (error) {
        console.error("Arcjet middleware error:", error);
        return res.status(500).json({
            error: "Internal Server Error",
            message: "An error occurred while processing your request."
        });
    }
}