require("dotenv").config()
import bodyParser from "body-parser"
import express from "express"
import config from "./Config"
import apiRouter from "./Routers/apiRouter"
const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use("/", apiRouter)

app.listen(config.PORT, () => {
	console.log("Server started at " + config.PORT)
})
