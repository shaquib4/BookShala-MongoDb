const express = require("express");
const dotenv = require("dotenv")
const DbConnection = require("./databaseConnection")
const userRouter = require("./routes/users.js")
const bookRouter = require("./routes/books.js")

dotenv.config()
const app=express();
DbConnection()
const port=8081

app.use(express.json())


app.use("/users",userRouter);
app.use("/books",bookRouter);
app.get("/",(req,res)=>{
    res.status(200).json({
        message: "Server is running perfectly"
    })
})


app.get("*",(req,res)=>{
    res.status(404).json({
        message: "This route does not exist"
    })
})

app.listen(port,()=>{
    console.log(`server started running on port : ${port}`)
})

