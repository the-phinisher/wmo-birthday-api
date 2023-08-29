require("dotenv").config()
import express from "express"
import mongoose from "mongoose"
import bodyParser from "body-parser"
const utils = require("./utils")
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

mongoose.connect(
	process.env.MONGODB_URI
		? process.env.MONGODB_URI
		: "mongodb://localhost:27017",
)

interface birthdayEntry {
	name: string
	birthday: Date
}

const birthdaySchema = new mongoose.Schema<birthdayEntry>({
	name: {
		type: String,
		required: true,
		validate: {
			validator: (namestring: string) => {
				return /^[a-z ]+$/i.test(namestring)
			},
			message: "Invalid Name",
		},
	},
	birthday: Date,
})

const Birthday = mongoose.model<birthdayEntry>("Birthday", birthdaySchema)

app.post("/", async (req, res) => {
	let newBirthday = new Birthday({
		name: req.body.name,
		birthday: new Date(req.body.birthday + "UTC"),
	})
	try {
		await newBirthday.validate()
	} catch (err) {
		return utils.responseHandler.sendInvalid(req, res)
	}
	if (await Birthday.findOne({ name: newBirthday.name }))
		return utils.responseHandler.sendInvalid(req, res)
	let savedObject = await newBirthday.save()
	if (savedObject) return utils.responseHandler.sendJSON(res, savedObject)
	return utils.responseHandler.sendInvalid(req, res)
})

app.patch("/", async (req, res) => {
	const validationObject = new Birthday({
		name: req.body.name,
		birthday: req.body.birthday,
	})
	let entry = await Birthday.findOne({ name: req.body.name })
	try {
		await validationObject.validate()
	} catch (err) {
		return utils.responseHandler.sendInvalid(req, res)
	}
	if (!entry) return utils.responseHandler.sendInvalid(req, res)

	entry.birthday = new Date(req.body.birthday + "UTC")
	const updatedObject = await Birthday.findByIdAndUpdate(entry._id, entry)
	if (updatedObject) return utils.responseHandler.sendJSON(res, updatedObject)
	return utils.responseHandler.sendInvalid(req, res, "Database Error")
})

app.delete("/", async (req, res) => {
	let validationObject = new Birthday({
		name: req.body.name,
		birthday: req.body.birthday,
	})
	try {
		await validationObject.validate()
	} catch (err) {
		return utils.responseHandler.sendInvalid(req, res)
	}
	let entry = await Birthday.findOne({ name: req.body.name })
	if (!entry) return utils.responseHandler.sendInvalid(req, res)
	let deletedObject = await Birthday.findByIdAndDelete(entry._id)
	if (deletedObject) return utils.responseHandler.sendJSON(res, deletedObject)
	return utils.responseHandler.sendInvalid(req, res)
})

app.get("/", async (req, res) => {
	const all = await Birthday.find({})
	if (all.length == 0) {
		return utils.responseHandler.sendInvalid(req, res)
	}
	let closest:
		| (mongoose.Document<unknown, {}, birthdayEntry> &
				Omit<birthdayEntry & { _id: mongoose.Types.ObjectId }, never>)
		| null = null
	let closest_time: number = Infinity
	let today: Date = new Date()
	today.setUTCHours(0)
	today.setUTCMinutes(0)
	today.setUTCSeconds(0)
	today.setUTCMilliseconds(0)
	let year = today.getUTCFullYear()
	for (let i = 0; i < all.length; i++) {
		let birthday = new Date(all[i]["birthday"])
		birthday.setUTCFullYear(year)
		if (birthday.getTime() < today.getTime())
			birthday.setUTCFullYear(year + 1)
		let delta = birthday.getTime() - today.getTime()
		if (delta < closest_time) {
			closest_time = delta
			closest = all[i]
		}
	}
	return utils.responseHandler.sendJSON(res, closest)
})

app.listen(process.env.PORT, () => {
	console.log("Server started at " + process.env.PORT)
})
