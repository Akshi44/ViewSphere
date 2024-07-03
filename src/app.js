import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

// app.use for middlewares, cors, cookies

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true,
}))   

app.use(express.json({limit:"20kb"}))   // for json limit, and to do not allow unlimited json from the out resources
app.use(express.urlencoded({extended:true,limit:'20kb'}))   // to read the url correctly
app.use(express.static("public"))    //for local assests
app.use(cookieParser())   // for secure cookies on server
app.use(morgan("dev"))  // Middleware for logging HTTP requests in this Express application. 

//routes import
import userRouter from './routes/user.routes.js' 
import videoRouter from './routes/video.routes.js'
import subscriptionRouter from './routes/subscription.routes.js'
import playlistRouter from './routes/playlist.routes.js'
import likeRouter from './routes/like.routes.js'
import commentRouter from './routes/comment.routes.js'
import tweetRouter from './routes/tweet.routes.js'
import dashboardRouter from './routes/dashboard.routes.js'
import isworkingRouter from './routes/isworking.routes.js'
import morgan from "morgan"


//routes declaration
// As we seperated controllers and routers so standard practice is to use middleware , hence "use" method.

// http://localhost:8000/api/v1/users/register
app.use("/api/v1/users",userRouter)
app.use("/api/v1/videos",videoRouter)
app.use("/api/v1/subscriptions",subscriptionRouter)
app.use("/api/v1/playlist",playlistRouter)
app.use("/api/v1/lokes",likeRouter)
app.use("/api/v1/comments",commentRouter)
app.use("/api/v1/tweets",tweetRouter)
app.use("/api/v1/dashboard",dashboardRouter)
app.use("/api/v1/isworking",isworkingRouter)


export{app}
