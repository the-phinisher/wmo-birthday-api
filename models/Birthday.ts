import { Schema, model } from "mongoose"

export interface birthdayEntry {
	name: string
	birthday: Date
}

const birthdaySchema = new Schema<birthdayEntry>({
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

export const Birthday = model<birthdayEntry>("Birthday", birthdaySchema)
