import dotenv from "dotenv"
import mongoose from "mongoose"
dotenv.config()

mongoose.connect(
	process.env.MONGODB_URI
		? process.env.MONGODB_URI
		: "mongodb://localhost:27017",
)

export default {
	PORT: process.env.PORT,
	MONGODB_URI: process.env.MONGODB_URI,
}
