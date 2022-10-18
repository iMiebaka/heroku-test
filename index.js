const express = require("express")
const app = express()
require("dotenv/config")
const Notes = require("./models")
const cors = require("cors")

app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.set("view engine", "ejs")

const PORT = process.env.PORT || 3000

app.get("/", async (req, res) => {
  const notes = await Notes.find()
  console.log(notes);
  res.json({ data: notes })
})

app.get("/:id", async (req, res) => {
  const { id } = req.params
  const notes = await Notes.find({ userId: id })
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
