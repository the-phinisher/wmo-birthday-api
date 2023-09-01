import express from "express"
import birthdayController from "../Controllers/birthdayController"
const apiRouter = express.Router()

apiRouter.get("/", async (req, res) => {
	return await birthdayController.getNearestBirthday(req, res)
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
