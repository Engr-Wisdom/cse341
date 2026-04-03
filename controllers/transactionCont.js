const { trace } = require("joi")
const mongodb = require("../database/mongodb")
const { ObjectId } = require("mongodb")

const getAllTransactions = async (req, res, next) => {
    try {
        const transations = await mongodb.getdb().collection("transactions").find().toArray()
        res.status(200).json(transations)
    } catch(error) {
        next(error)
    }
}

const getSingleTransaction = async (req, res, next) => {
    try {
        const transactionId = new ObjectId(req.params.id)
        const transaction = await mongodb.getdb().collection("transactions").findOne({ _id: transactionId })
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" })
        }
        res.status(200).json(transaction)
    } catch(error) {
        next(error)
    }
}

const createTransaction = async (req, res, next) => {
  try {
    const transaction = {
      amount: req.body.amount,
      date: new Date(req.body.date),
      paymentMethod: req.body.paymentMethod,
      status: req.body.status || "Pending",
      invoiceNumber: req.body.invoiceNumber,
      notes: req.body.notes,
      createdAt: new Date()
    };

    const result = await mongodb
      .getdb()
      .collection("transactions")
      .insertOne(transaction);

    res.status(200).json(result);
  } catch(error) {
    next(error)
  }
};

const updateTransaction = async (req, res, next) => {
  try {
    const transactionId = new ObjectId(req.params.id);
    const transaction = {
      amount: req.body.amount,
      date: new Date(req.body.date),
      paymentMethod: req.body.paymentMethod,
      status: req.body.status || "Pending",
      invoiceNumber: req.body.invoiceNumber,
      notes: req.body.notes,
      createdAt: new Date()
    };

    const result = await mongodb
      .getdb()
      .collection("transactions")
      .replaceOne({ _id: transactionId }, transaction);
    res.status(200).send(result);

  } catch(error) {
    next(error)
  }
};

const deleteTransaction = async (req, res, next) => {
  try {
    const id = new ObjectId(req.params.id);
    const transaction = await mongodb.getdb().collection("transactions").deleteOne({ _id: id });
    if (!transaction.deletedCount === 0) {
      res.status(404).json({ message: "Transaction not found" })
    }
    res.status(200).send(transaction);

  } catch(error) {
    next(error)
  }
};

module.exports = {
  getAllTransactions,
  getSingleTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};