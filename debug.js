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
      validator: (v) => {
        return /^[A-Za-z]*$/.test(v)
      },
      message: "Name regex does not match",
    },
  },
  bday: Date,
})

const Birthday = mongoose.model("Birthday", bdaySchema)
const bday = new Birthday({ name: "Perfectname", bday: "nomnom" })
console.log(bday.validate())
