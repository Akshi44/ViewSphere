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

export{app}
