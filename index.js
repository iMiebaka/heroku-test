const express = require("express")
const app = express()


app.use(express.urlencoded({ extended: false }))
app.use(express.json())

const PORT = process.env.PORT || 3000

app.get("/", (req, res) => {
res.json({"message": "the api is working"})})


app.listen(PORT, () => {
console.log("Server is running")
})
