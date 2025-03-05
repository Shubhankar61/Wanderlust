const initdata = require("./data.js");
const mongoose = require("mongoose");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main().then(() => {
    console.log("connected to DB");
}).catch(err => {
    console.error(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    try {
        await Listing.deleteMany({});
        initdata.data = initdata.data.map((obj) => ({ ...obj, owner: "67c8119eff4c746d4a3ce424", }));
        const result = await Listing.insertMany(initdata.data);
        console.log("Data was initialized", result);
    } catch (error) {
        console.error("Error initializing data:", error);
    }
};

initDB();
