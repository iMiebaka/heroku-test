const express = require("express")
const app = express()
require("dotenv/config")
const Notes = require("./models")
const cors = require("cors")

app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.set("view engine", "ejs")

const PORT = process.env.PORT || 3001

app.get("/", async (req, res) => {
  try {
    const notes = await Notes.find()
    console.log(notes);
    res.json({ data: notes })
  }
  catch (e) {
    res.status(400).json({ message: "Could not get item" })
  }
})

app.get("/:id", async (req, res) => {
  try {
    const { id } = req.params
    const notes = await Notes.find({ userId: id })
    res.json({ data: notes })
  }
  catch (e) {
    res.status(400).json({ message: "Could not get item" })
  }
})

app.post("/", (req, res) => {
  try {
    if (req.body.title == undefined) throw new Error("No title set")
    if (req.body.body == undefined) throw new Error("No body set")
    if (req.body.userId == undefined) throw new Error("No userId set")
    const notes = new Notes(req.body)
    notes.save()
    res.json({ message: "Data saved" })
  }
  catch (e) {
    res.status(400).json({ message: e.message })
  }
})


app.listen(PORT, () => {
  console.log("Server is running on " + PORT)
})
