const mongoose = require('mongoose');
const {data} = require('./data.js');
const Listing = require('../models/listing.js');

const MONGO_URL = "mongodb://localhost:27017/wanderlust";

main()
.then(() => {
    console.log("Connected to MongoDB");
})
.catch(err => console.log(err));

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  try {
    await Listing.deleteMany({});
    const updatedData = data.map((obj) => ({ ...obj, owner: "6908524144b2bf439ac85db7" }));
    await Listing.insertMany(updatedData);
    console.log("Database initialized with sample data.");
  } catch (err) {
    console.log(err);
  }
};


initDB();