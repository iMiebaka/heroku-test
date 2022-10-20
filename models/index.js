const mongoose = require("mongoose");
const { v4 } = require("uuid")

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
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
});
const Notes = mongoose.model("Notes", NotesScheme)

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    publicId: {
        type: String,
        default: v4(),
    },
})

const User = mongoose.model("User", UserSchema)
module.exports = { Notes, User };