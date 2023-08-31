import express from "express"
import utils from "../utils"
import { Birthday } from "../Models/Birthday"
import birthdayController from "../Controllers/birthdayController"
const apiRouter = express.Router()

apiRouter.get("/", async (req, res) => {
	return await birthdayController.getNearestBirthday(res)
})

apiRouter.delete("/", async (req, res) => {
	return await birthdayController.deleteBirthday(req, res)
})

apiRouter.patch("/", async (req, res) => {
	return await birthdayController.updateBirthday(req, res)
})

apiRouter.post("/", async (req, res) => {
	return await birthdayController.addBirthday(req, res)
})

export default apiRouter
