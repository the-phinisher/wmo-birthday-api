import { Response } from "express"
import mongoose from "mongoose"

const sendJSON = (
	res: Response,
	obj: {} | mongoose.Document<unknown, {}, unknown>,
) => {
	res.setHeader("statusCode", 200)
	res.setHeader("Content-Type", "application/json")
	res.end(JSON.stringify(obj))
}

const sendInvalid = (res: Response, text: string = "Invalid request") => {
	res.writeHead(400)
	return res.end(text)
}

export default { sendJSON, sendInvalid }
