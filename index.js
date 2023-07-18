require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const utils = require("./utils")
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

mongoose.connect(process.env.MONGODB_URI)

const bdaySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    validate: {
      validator: (namestring) => {
        return /^[a-z ]+$/i.test(namestring)
      },
      message: "Invalid Name",
    },
  },
  bday: Date,
})

const Birthday = mongoose.model("Birthday", bdaySchema)

app.post("/", async (req, res) => {
  let newBirthday = new Birthday({
    name: req.body.name,
    bday: new Date(req.body.bday + "UTC"),
  })
  try {
    await newBirthday.validate()
  } catch (err) {
    return utils.responseHandler.sendInvalid(req, res)
  }
  if (await Birthday.findOne({ name: newBirthday.name }))
    return utils.responseHandler.sendInvalid(req, res)
  let savedObject = await newBirthday.save()
  if (savedObject)
    return utils.responseHandler.sendJSON(
      req,
      res, savedObject
    )
  return utils.responseHandler.sendInvalid(req, res)
})

app.patch("/", async (req, res) => {
  let validationObject = new Birthday({
    name: req.body.name,
    bday: req.body.bday,
  })
  let entry = await Birthday.findOne({ name: req.body.name })
  try {
    await validationObject.validate()
  } catch (err) {
    return utils.responseHandler.sendInvalid(req, res)
  }
  if (!entry) return utils.responseHandler.sendInvalid(req, res)

  entry.bday = new Date(req.body.bday + "UTC")
  let result = await Birthday.findByIdAndUpdate(entry._id, entry)
  if (result)
    return utils.responseHandler.sendJSON(
      req,
      res, result
    )
  return utils.responseHandler.sendInvalid(
    req,
    res, "Database Error",
  )
})

app.delete("/", async (req, res) => {
  let validationObject = new Birthday({
    name: req.body.name,
    bday: req.body.bday,
  })
  try {
    await validationObject.validate()
  } catch (err) {
    return utils.responseHandler.sendInvalid(req, res)
  }
  let entry = await Birthday.findOne({ name: req.body.name })
  if (!entry) return utils.responseHandler.sendInvalid(req, res)
  let deletedObject = await Birthday.findByIdAndDelete(entry._id)
  if (deletedObject)
    return utils.responseHandler.sendJSON(
      req,
      res, deletedObject
    )
  return utils.responseHandler.sendInvalid(req, res)
})

app.post("/nearest", async (req, res) => {
  let all = await Birthday.find({})
  if (all.length == 0) {
    return utils.responseHandler.sendInvalid(req, res)
  }
  closest = null
  closest_time = Infinity
  let today = new Date()
  today.setUTCHours(0)
  today.setUTCMinutes(0)
  today.setUTCSeconds(0)
  today.setUTCMilliseconds(0)
  let year = today.getUTCFullYear()
  for (let i = 0; i < all.length; i++) {
    let bday = new Date(all[i]["bday"])
    bday.setUTCFullYear(year)
    if (bday.getTime() < today.getTime()) bday.setUTCFullYear(year + 1)
    let delta = bday.getTime() - today.getTime()
    if (delta < closest_time) {
      closest_time = delta
      closest = all[i]
    }
  }
  return utils.responseHandler.sendJSON(req, res, closest)
})

app.listen(process.env.PORT, () => {
  console.log("Server started at " + process.env.PORT)
})
