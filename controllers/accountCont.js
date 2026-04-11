const mongodb = require("../database/mongodb");
const { ObjectId } = require("mongodb");

const generateAccountNumber = () => {
  let number = "";
  for (let i = 0; i < 10; i++) {
    number += Math.floor(Math.random() * 10)
  }
  return number
}

// GET ALL
const getAll = async (req, res, next) => {
  try {
    const accounts = await mongodb.getdb().collection("accounts").find().toArray();
    res.status(200).json(accounts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch accounts" });
  }
};

// GET SINGLE
const getSingle = async (req, res, next) => {
  try {
    const accountId = new ObjectId(req.params.id);
    const account = await mongodb.getdb().collection("accounts").findOne({ _id: accountId });

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    res.status(200).json(account);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving account" });
  }
};

// CREATE (POST)
const createAccount = async (req, res, next) => {
  try {
    // Validate required fields
    const { userId, bankName, accountType, balance, currency } = req.body;

    if (!userId || !bankName || !accountNumber || !accountType) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const account = {
      userId,
      bankName,
      accountNumber: generateAccountNumber(),
      accountType,
      balance: balance || 0,
      currency: currency || "USD",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await mongodb.getdb().collection("accounts").insertOne(account);

    res.status(201).json(result);
  } catch (error) {
    console.error("Failed to create account:", error.message);
    res.status(500).json({ error: "Failed to create account" });
  }
};

// UPDATE (PUT)
const updateAccount = async (req, res, next) => {
  try {
    const accountId = req.params.id;
    if (!ObjectId.isValid(accountId)) {
      return res.status(400).json({ error: "Invalid account ID" })
    }
    const { balance, currency, accountType } = req.body;

    if (balance === undefined && !currency && !accountType) {
      return res.status(400).json({ error: "No fields provided to update" });
    }

    const updatedFields = {};
    if (balance !== undefined) updatedFields.balance = balance;
    if (currency) updatedFields.currency = currency;
    if (accountType) updatedFields.accountType = accountType;

    updatedFields.updatedAt = new Date();

    const result = await mongodb
      .getdb()
      .collection("accounts")
      .updateOne(
        { _id: new ObjectId(accountId) },
        { $set: updatedFields }
      );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Account not found" });
    }

    res.status(200).json({ message: "Account updated successfully", result });
  } catch (error) {
    console.error("Failed to update account:", error.message);
    res.status(500).json({ error: "Failed to update account" });
  }
};

// DELETE
const deleteAccount = async (req, res, next) => {
  try {
    const accountId = req.params.id;

    if (!ObjectId.isValid(accountId)) {
      return res.status(400).json({ error: "Invalid account ID" });
    }

    const result = await mongodb
      .getdb()
      .collection("accounts")
      .deleteOne({ _id: new ObjectId(accountId) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Account not found" });
    }

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Failed to delete account:", error.message);
    res.status(500).json({ error: "Failed to delete account" });
  }
};
module.exports = {
  getAll,
  getSingle,
  createAccount,
  updateAccount,
  deleteAccount,
};