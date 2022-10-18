const mongoose = require("mongoose");


mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => {
        console.log("Database Connected and open for business");
    })
    .catch((e) => {
        console.log(e.message);
        console.log("Cannot connect to database");
    });


const NotesScheme = new mongoose.Schema({
    title: {
        type: String,
    },
    body: {
        type: String,
    },
    userId: {
        type: String,
    },
});
const Notes = mongoose.model("Notes", NotesScheme)

module.exports = Notes;