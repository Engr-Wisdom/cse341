const dns = require("dns")
dns.setServers(["208.67.222.222"])

const { MongoClient } = require("mongodb")
require("dotenv").config({ quiet: true })

let db;

async function initdb() {
    const uri = process.env.MONGODB_URI 
    const client = new MongoClient(uri)

    try {
        await client.connect()
        db = client.db("cse341")
    } catch(error) {
        console.error(error.message)
    }
}

function getdb() {
    return db
}

module.exports = { initdb, getdb }