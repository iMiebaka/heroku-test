const express = require("express")
const app = express()
require("dotenv/config")
const Notes = require("./models")

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.set("view engine", "ejs")

const PORT = process.env.PORT || 3000

app.get("/", (req, res) => {
  const notes = Notes.find()
  res.json({ data: notes })
})

app.get("/:id", (req, res) => {
  const { id } = req.params
  const notes = Notes.find({ userId: id })
  res.json({ data: notes })
})

app.post("/", (req, res) => {
  const notes = new Notes(req.body)
  notes.save()
  res.json({ message: "Data saved" })
})


app.listen(PORT, () => {
  console.log("Server is running on " + PORT)
})
