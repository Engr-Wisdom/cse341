const mongodb = require("../database/mongodb");
const { ObjectId } = require("mongodb");

// GET ALL
const getAllTransactions = async (req, res) => {
  try {
    const transactions = await mongodb
      .getdb()
      .collection("transactions")
      .find()
      .toArray();

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
};

// GET SINGLE
const getSingleTransaction = async (req, res) => {
  try {
    const transactionId = new ObjectId(req.params.id);

    const transaction = await mongodb
      .getdb()
      .collection("transactions")
      .findOne({ _id: transactionId });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving transaction" });
  }
};

// CREATE (POST)
const createTransaction = async (req, res) => {
  try {
    if (!req.body.amount || !req.body.date || !req.body.paymentMethod) {
      return res.status(400).json({
        error: "amount, date, and paymentMethod are required",
      });
    }

    if (typeof req.body.amount !== "number") {
      return res.status(400).json({
        error: "amount must be a number",
      });
    }

    const transaction = {
      amount: req.body.amount,
      date: new Date(req.body.date),
      paymentMethod: req.body.paymentMethod,
      status: req.body.status || "Pending",
      invoiceNumber: req.body.invoiceNumber,
      notes: req.body.notes,
      createdAt: new Date(),
    };

    const result = await mongodb
      .getdb()
      .collection("transactions")
      .insertOne(transaction);

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to create transaction" });
  }
};

// UPDATE (PUT)
const updateTransaction = async (req, res) => {
  try {
    if (!req.body.amount || !req.body.date || !req.body.paymentMethod) {
      return res.status(400).json({
        error: "amount, date, and paymentMethod are required",
      });
    }

    if (typeof req.body.amount !== "number") {
      return res.status(400).json({
        error: "amount must be a number",
      });
    }

    const transactionId = new ObjectId(req.params.id);

    const transaction = {
      amount: req.body.amount,
      date: new Date(req.body.date),
      paymentMethod: req.body.paymentMethod,
      status: req.body.status || "Pending",
      invoiceNumber: req.body.invoiceNumber,
      notes: req.body.notes,
      createdAt: new Date(),
    };

    const result = await mongodb
      .getdb()
      .collection("transactions")
      .replaceOne({ _id: transactionId }, transaction);

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to update transaction" });
  }
};

// DELETE
const deleteTransaction = async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);

    const result = await mongodb
      .getdb()
      .collection("transactions")
      .deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete transaction" });
  }
};

module.exports = {
  getAllTransactions,
  getSingleTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};