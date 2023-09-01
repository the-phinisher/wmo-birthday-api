import express from "express"
import birthdayController from "../Controllers/birthdayController"
const apiRouter = express.Router()

apiRouter.get("/", birthdayController.getNearestBirthday)

apiRouter.delete("/", birthdayController.deleteBirthday)

apiRouter.patch("/", birthdayController.updateBirthday)

apiRouter.post("/", birthdayController.addBirthday)

export default apiRouter
