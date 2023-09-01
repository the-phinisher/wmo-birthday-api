import mongoose from "mongoose"
import utils from "../utils"
import { Birthday } from "../Models/Birthday"
import { Request, Response } from "express"

const getNearestBirthday = async (req: Request, res: Response) => {
	const all = await Birthday.find({})
	if (all.length == 0) {
		return utils.responseHandler.send(
			res,
			"invalid",
			"no entries in database",
		)
	}
	let today: Date = new Date()
	today.setUTCHours(0)
	today.setUTCMinutes(0)
	today.setUTCSeconds(0)
	today.setUTCMilliseconds(0)
	let year = today.getUTCFullYear()
	let closest: mongoose.Document<unknown, {}, birthdayEntry> = all[0]
	let closest_time: number = Infinity
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
	return utils.responseHandler.send(res, "json", "", closest)
}

const deleteBirthday = async (req: Request, res: Response) => {
	let birthdayEntry = await Birthday.findOne({ name: req.body.name })
	if (birthdayEntry == null)
		return utils.responseHandler.send(
			res,
			"invalid",
			`Cannot find ${req.body.name} in the database`,
		)
	let deletedEntry = await Birthday.findByIdAndDelete(birthdayEntry._id)
	if (deletedEntry)
		return utils.responseHandler.send(res, "json", "", deletedEntry)
	return utils.responseHandler.send(
		res,
		"invalid",
		"Database Error: Deletion failed",
	)
}

const updateBirthday = async (req: Request, res: Response) => {
	let entry = await Birthday.findOne({ name: req.body.name })
	if (!entry)
		return utils.responseHandler.send(res, "invalid", "No database entry")

	entry.birthday = new Date(req.body.birthday + "UTC")
	const updatedEntry = await Birthday.findByIdAndUpdate(entry._id, entry)
	if (updatedEntry)
		return utils.responseHandler.send(res, "json", "", updatedEntry)
	return utils.responseHandler.send(res, "invalid", "Database Error")
}

const addBirthday = async (req: Request, res: Response) => {
	let newBirthday = new Birthday({
		name: req.body.name,
		birthday: new Date(req.body.birthday + "UTC"),
	})
	if (await Birthday.findOne({ name: newBirthday.name }))
		return utils.responseHandler.send(
			res,
			"invalid",
			"Birthday already exists",
		)
	let savedEntry = await newBirthday.save()
	if (savedEntry)
		return utils.responseHandler.send(res, "json", "", savedEntry)
	return utils.responseHandler.send(res, "invalid", "Entry already exists")
}

export default {
	getNearestBirthday,
	deleteBirthday,
	updateBirthday,
	addBirthday,
}
