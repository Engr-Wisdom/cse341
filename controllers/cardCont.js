const mongodb = require("../database/mongodb");
const { ObjectId } = require("mongodb");

const accountExists = async (accountId) => {
    try {
        const account = await mongodb.getdb().collection("cards").findOne({ _id: new ObjectId(accountId) })
        return account ? true : false
    } catch(error) {
        return false
    }
}

const generateCardNumber = () => {
    const prefix = "4";
    let number = prefix
    for (let i = 0; i < 15; i++) {
        number += Math.floor(Math.random() * 10)
    }
    return number.replace(/(\d{4})(?=\d)/g, "$1 ")
};

const generateExpiryDate = () => {
    const date = new Date()
    date.setFullYear(date.getFullYear() * 5)
    return date
}
const getAll = async (req, res) => {
  try {
    const cards = await mongodb.getdb().collection("cards").find().toArray();

    res.status(200).json(cards);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch cards" });
  }
};

const getSingle = async (req, res) => {
  try {
    const cardId = new ObjectId(req.params.id);

    const card = await mongodb
      .getdb()
      .collection("cards")
      .findOne({ _id: cardId });

    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    res.status(200).json(card);
  } catch (error) {
    return res.status(500).json({ error: "Error retrieving card" });
  }
};

const createCard = async (req, res) => {
  try {
    const { accountId, name, cardType, brand, status } = req.body;

    const isValidAccount = await accountExists(accountId)

    if (!isValidAccount) {
        return res.status(400).json({
            success: false,
            message: "Account does not exist. Cannot create card." 
        })
    }

    const newCard = {
      accountId,
      name,
      cardNumber: generateCardNumber(),
      cardType,
      brand,
      expiryDate: generateExpiryDate(),
      status: status || "active",
      issuedDate: new Date(),
      createdDate: new Date(),
      updatedDate: new Date(),
    };

    const result = await mongodb.getdb().collection("cards").insertOne(newCard);

    res.status(201).json({
        success: true,

        message: "Card created successfully",
        cardId: result.insertedId,
        data: newCard,
    });
  } catch (error) {
    return res.status(500).json({
        success: false,
        error: "Failed to create card" 
    });
  }
};

const updateCard = async (req, res) => {
  try {
    const cardId = new ObjectId(req.params.id);

    const updateData = {
      ...req.body,
      updatedDate: new Date(),
    };

    const result = await mongodb
      .getdb()
      .collection("cards")
      .updateOne({ _id: cardId }, { $set: updateData });

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Card not found" });
    }

    res.status(200).json({
      message: "Card updated successfully",
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to update card" });
  }
};

const blockCard = async (req, res) => {
  try {
    const cardId = new ObjectId(req.params.id);

    const result = await mongodb
      .getdb()
      .collection("cards")
      .updateOne(
        { _id: cardId },
        {
          $set: {
            status: "blocked",
            updatedDate: new Date(),
          },
        },
      );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Card not found" });
    }

    res.status(200).json({
      message: "Card blocked successfully",
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to block card" });
  }
};

const deleteCard = async (req, res) => {
  try {
    const cardId = new ObjectId(req.params.id);

    const result = await mongodb
      .getdb()
      .collection("cards")
      .deleteOne({ _id: cardId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Card not found" });
    }

    res.status(200).json({
      message: "Card deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete card" });
  }
};

module.exports = {
  getAll,
  getSingle,
  createCard,
  updateCard,
  blockCard,
  deleteCard,
};
