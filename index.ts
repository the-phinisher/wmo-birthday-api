require("dotenv").config()
import express from "express"
import bodyParser from "body-parser"
import { PORT } from "./Config"
import apiRouter from "./Routers/apiRouter"
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use("/", apiRouter)

app.listen(PORT, () => {
	console.log("Server started at " + PORT)
})
