const express = require("express")
require("dotenv/config")
const app = express()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const { Notes, User } = require("./models")
const cors = require("cors")

app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.set("view engine", "ejs")

const PORT = process.env.PORT || 3001

const isLoggedIn = async (req, res, next) => {
  const bearerHearder = req.headers?.["authorization"];
  try {
    // decrypt the token
    if (bearerHearder != "") {
      // @ts-ignore
      const token = jwt.verify(bearerHearder, process.env.SECRET_KEY);
      // @ts-ignore
      const user = await User.findOne({ publicId: token.user });
      // @ts-ignore
      res.locals.user = user;
      next();
    } else {
      return res.status(403).json({ message: "Login Reqired" });
    }
  }
  catch {
    return res.status(400).json({ message: "No Authentication header provided" });
  }
};

app.get("/", isLoggedIn, async (req, res) => {
  try {
    const notes = await Notes.find()
    res.json({ data: notes })
  }
  catch (e) {
    res.status(400).json({ message: "Could not get item" })
  }
})

app.get("/find-post", isLoggedIn, async (req, res) => {
  try {
    const notes = await Notes.find({userId: res.locals.user})
    res.json({ data: notes })
  }
  catch (e) {
    res.status(400).json({ message: "Could not get item" })
  }
})

app.get("/find-post/:id", isLoggedIn, async (req, res) => {
  try {
    const { id } = req.params
    const notes = await Notes.find({ _id: id })
    res.json({ data: notes })
  }
  catch (e) {
    res.status(400).json({ message: "Could not get item" })
  }
})

app.get("/profile", isLoggedIn, async (req, res) => {
  try {
    const { id } = req.params
    const users = await User.find({ username: id })
    res.json({ data: users })
  }
  catch (e) {
    res.status(400).json({ message: "Could not get user" })
  }
})


app.get("/profile/:id", isLoggedIn, async (req, res) => {
  try {
    const { id } = req.params
    const users = await User.find({ username: id })
    res.json({ data: users })
  }
  catch (e) {
    res.status(400).json({ message: "Could not get user" })
  }
})

app.post("/", isLoggedIn, (req, res) => {
  try {
    if (req.body.title == undefined) throw new Error("No title set")
    if (req.body.body == undefined) throw new Error("No body set")
    const notes = new Notes(req.body)
    notes.userId = res.locals.user
    notes.save()
    res.json({ message: "Data saved" })
  }
  catch (e) {
    res.status(400).json({ message: e.message })
  }
})

app.post("/account/login", async (req, res) => {
  const { email, password } = req.body;
  if (email == undefined || password == undefined) return res.status(400).json({ message: "Field(s) not defined" });

  const user = await User.findOne({ email });
  if (user) {
    // @ts-ignore
    const checkPassword = await bcrypt.compare(password, user.password);
    if (checkPassword) {
      // @ts-ignore
      var token = jwt.sign({ user: user.publicId }, process.env.SECRET_KEY);
      return res.status(200).json({
        message: "Login successfull",
        data: { id: user.publicId, token },
      });
    } else {
      return res.status(400).json({ message: "Password is incorrect" });
    }
  } else {
    return res.status(404).json({ message: "Email not registered" });
  }
});

app.post("/account/signup", async (req, res) => {
  const { username, email, password } = req.body;
  if (username == "") {
    return res.status(400).json({ message: "usename is empty" });
  }
  if (email == "") {
    return res.status(400).json({ message: "email is empty" });
  }
  if (password == "") {
    return res.status(400).json({ message: "password is empty" });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const check = User.findOne({})
    const user = new User({
      username: username,
      email: email,
      password: passwordHash,
    });
    await user.save();
    return res.status(201).json({ message: "User created" });
  } catch {
    return res.status(400).json({ message: "Cannot create user" });
  }
});




app.listen(PORT, () => {
  console.log("Server is running on " + PORT)
})
