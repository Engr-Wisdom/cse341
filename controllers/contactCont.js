const mongodb = require("../database/mongodb");
const { ObjectId } = require("mongodb");

const getAll = async (req, res, next) => {
  try {
    const contacts = await mongodb.getdb().collection("contacts").find().toArray();
    res.status(200).json(contacts);

  } catch(error) {
    next(error)
  }
};

const getSingle = async (req, res, next) => {
  try {
    const contactId = new ObjectId(req.params.id);
    const contact = await mongodb.getdb().collection("contacts").findOne({ _id: contactId });    
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" })
    }
    res.status(200).json(contact);

  } catch(error) {
    next(error)
  }
};

const createContact = async (req, res, next) => {
  try {
    const contact = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      favoriteColor: req.body.favoriteColor,
      birthday: req.body.birthday,
      phone: req.body.phone,
      address: req.body.address
    };

    const result = await mongodb
      .getdb()
      .collection("contacts")
      .insertOne(contact);

    res.status(200).json(result);
  } catch(error) {
    next(error)
  }
};

const updateContact = async (req, res, next) => {
  try {
    const contactId = new ObjectId(req.params.id);
    const contact = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      favoriteColor: req.body.favoriteColor,
      birthday: req.body.birthday,
      phone: req.body.phone,
      address: req.body.address
    };

    const result = await mongodb
      .getdb()
      .collection("contacts")
      .replaceOne({ _id: contactId }, contact);
    res.status(200).send(result);

  } catch(error) {
    next(error)
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const id = new ObjectId(req.params.id);
    const contact = await mongodb.getdb().collection("contacts").deleteOne({ _id: id });
    if (!contact.deletedCount === 0) {
      res.status(404).json({ message: "Contact not found" })
    }
    res.status(200).send(contact);

  } catch(error) {
    next(error)
  }
};

module.exports = {
  getAll,
  getSingle,
  createContact,
  updateContact,
  deleteContact,
};