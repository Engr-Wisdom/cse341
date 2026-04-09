const mongodb = require("../database/mongodb")
const { ObjectId } = require("mongodb")
const bcrypt = require("bcrypt")

const getAll = async (req, res) => {
    try {
        const users = await mongodb.getdb()
            .collection("users")
            .find({}, { projection: { password: 0 } })
            .toArray()
        res.status(200).json(users)
    } catch(error) {
        res.status(500).json({ error: "Failed to fetch users"})
    }
}

const getSingle = async (req, res) => {
    try {
        const userId = req.params.id
        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID"})
        }

        const user = await mongodb.getdb()
            .collection("users")
            .findOne(
                { _id: new ObjectId(userId) }, 
                { projection: { password: 0 } }
            )

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        res.status(200).json(user)
    } catch(error) {
        res.status(500).json({ error: "Error retrieving users" })
    }
}

const createUser = async (req, res, next) => {
    try {
        const { firstName, lastName, password, role, phone, address } = req.body

        if (!req.body.email || !firstName || !lastName || !password || !phone || !address) {
            return res.status(400).json({ message: "Missing required fields" })
        }

        const email = req.body.email.toLowerCase()

        const existingUser = await mongodb.getdb().collection("users").findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" })
        }
        const hashedPassword = await bcrypt.hash(password, 10)

        const user = {
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role: role || "user",
            phone,
            address,
            createdAt: new Date(),
            updatedAt: new Date()
        }
        const result = await mongodb.getdb().collection("users").insertOne(user)
        res.status(201).json(result)
    } catch(error) {
        res.status(500).json({ error: "Failed to create user" })
    }
}
const updateUser = async (req, res, next) => {
    try {
        const userId = req.params.id

        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID" })
        }

        const { firstName, lastName, email, password, role } = req.body

        if (!firstName && !lastName && !email && !password && !role) {
            return res.status(400).json({ message: "No field provided to update" })
        }

        const updatedFields = {}

        if (firstName && firstName.trim() !== "") {
            updatedFields.firstName = firstName
        }

        if (lastName && lastName.trim() !== "") {
            updatedFields.lastName = lastName
        }

        if (email && email.trim() !== "") {
            updatedFields.email = email
        }

        if (password) {
            if (password.length < 6) {
                return res.status(400).json({ message: "Password must be at least 6 characters" })
            }
            updatedFields.password = await bcrypt.hash(password, 10)
        }

        updatedFields.updatedAt = new Date()

        const result = await mongodb.getdb().collection("users").updateOne(
            { _id: new ObjectId(userId) },
            { $set: updatedFields }
        )

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "User not found" })
        }

        res.status(200).json({ message: "User updated successfully" })

    } catch (error) {
        console.error("UPDATE USER ERROR:", error)
        res.status(500).json({ 
            error: "Failed to update user",
            details: error.message
        })
    }
}

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id
        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID" })
        }
        const result = await mongodb.getdb().collection("users").deleteOne({ _id: new ObjectId(userId) })

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "User not found"})
        }
        
        res.status(200).json({ message: "User deleted successfully" })
    } catch(error) {
        res.status(500).json({ error: "Failed to delete user" })
    }
}

module.exports = {
    getAll,
    getSingle,
    createUser,
    updateUser,
    deleteUser
}