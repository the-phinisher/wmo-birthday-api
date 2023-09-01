import { Response } from "express"
import mongoose from "mongoose"

const send = (
	res: Response,
	type: string = "invalid",
	content: string = "",
	obj:
		| {}
		| (mongoose.Document<unknown, {}, birthdayEntry> &
				Omit<
					birthdayEntry & {
						_id: mongoose.Types.ObjectId
					},
					never
				>) = {},
) => {
	res.setHeader("statusCode", type == "invalid" ? 200 : 400)
	if (type == "json") {
		res.setHeader("Content-Type", "application/json")
		return res.end(JSON.stringify(obj))
	}
	return res.end(content)
}

export default { send }
