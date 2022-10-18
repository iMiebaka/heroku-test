const mongoose = require("mongoose");

const NAMESPACE = "Database"


console.log(process.env.DATABASE_URL);
mongoose
    // .connect("mongodb://localhost/notedb")
    .connect(process.env.DATABASE_URL)
    // .connect(db)
    .then(() => {
        console.log("Database Connected and open for business");
    })
    .catch((e) => {
        // console.log(e);
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