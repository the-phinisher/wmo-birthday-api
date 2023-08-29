import { Response } from "express"

const sendJSON = (res: Response, obj: {}) => {
	res.setHeader("statusCode", 200)
	res.setHeader("Content-Type", "application/json")
	res.end(JSON.stringify(obj))
}

const sendInvalid = (res: Response, text: string = "Invalid request") => {
	res.writeHead(400)
	return res.end(text)
}

export default { sendJSON, sendInvalid }
