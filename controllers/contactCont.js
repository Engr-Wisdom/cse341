const mongodb = require("../database/mongodb");
const { ObjectId } = require("mongodb");

// GET ALL
const getAll = async (req, res, next) => {
  try {
    const contacts = await mongodb.getdb().collection("contacts").find().toArray();
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch contacts" });
  }
};

// GET SINGLE
const getSingle = async (req, res, next) => {
  try {
    const contactId = new ObjectId(req.params.id);
    const contact = await mongodb.getdb().collection("contacts").findOne({ _id: contactId });

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving contact" });
  }
};

// CREATE (POST)
const createContact = async (req, res, next) => {
  try {
    // SIMPLE VALIDATION (important for assignment)
    if (!req.body.firstName || !req.body.lastName || !req.body.email) {
      return res.status(400).json({ error: "Missing required fields" });
    }

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

    res.status(201).json(result); // ✅ FIXED
  } catch (error) {
    res.status(500).json({ error: "Failed to create contact" });
  }
};

// UPDATE (PUT)
const updateContact = async (req, res, next) => {
  try {
    if (!req.body.firstName || !req.body.lastName || !req.body.email) {
      return res.status(400).json({ error: "Missing required fields" });
    }

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

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to update contact" });
  }
};

// DELETE
const deleteContact = async (req, res, next) => {
  try {
    const id = new ObjectId(req.params.id);

    const result = await mongodb.getdb().collection("contacts").deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete contact" });
  }
};

module.exports = {
  getAll,
  getSingle,
  createContact,
  updateContact,
  deleteContact,
};