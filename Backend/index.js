const express = require('express')
const dotenv = require('dotenv')
const ConnectDB = require('./db')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const authRoutes = require('./routes/authRoutes')

const app = express()


app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.use(cors({
    origin:true,
    credentials:true
}))

dotenv.config()



ConnectDB()


app.use('/auth',authRoutes)

const port = process.env.PORT


app.listen(port, ()=>{
       console.log(`Server is Running at port ${port}`)
})