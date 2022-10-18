const express = require("express")
const app = express()
require("dotenv/config")

console.log(process.env.DATABASE_URL)

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.set("view engine", "ejs")

const PORT = process.env.PORT || 3000

app.get("/", (req, res) => {
  res.json({message: "the api is working. checking auto deploy"})
})

app.get("/page", (req, res) => {
 res.render("index")
})


app.listen(PORT, () => {
console.log("Server is running on " + PORT)
})
