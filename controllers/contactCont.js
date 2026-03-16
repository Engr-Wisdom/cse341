const mongodb = require("../database/mongodb")
const { ObjectId } = require("mongodb")

const getAll = async (req, res) => {
    const contacts = await mongodb.getdb().collection("contacts").find().toArray()
    res.json(contacts)
}

const getSingle = async (req, res) => {
    const contactId = new ObjectId(req.params.id)
    const contact = await mongodb.getdb().collection("contacts").findOne({ _id: contactId })
    res.json(contact)
}

const createContact = async (req, res) => {
    const contact = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        favoriteColor: req.body.favoriteColor,
        birthday: req.body.birthday
    }

    const result = await mongodb.getdb().collection("contacts").insertOne(contact)
    res.status(200).json(result)
}

const updateContact = async (req, res) => {
    const contactId = new ObjectId(req.params.id)
    const contact = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        favoriteColor: req.body.favoriteColor,
        birthday: req.body.birthday
    }

    const result = await mongodb.getdb().collection("contacts").replaceOne({ _id: contactId }, contact )
    res.status(200).send(result)
}

const deleteContact = async (req, res) => {
    const id = new ObjectId(req.params.id)
    const contact = mongodb.getdb().collection("contacts").deleteOne({ _id: id })
    res.status(200).send(contact)
}

module.exports = { getAll, getSingle, createContact, updateContact, deleteContact }