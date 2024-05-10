const router = require('express').Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { Notes, User } = require("../models")
const isLoggedIn = require("../middleware/authState")


router.get("/test-socket", (req, res) => {
    res.render("index")
})


router.get("/", isLoggedIn, async (req, res) => {
    try {
        const notes = await Notes.find()
        res.json({ data: notes })
    }
    catch (e) {
        res.status(400).json({ message: "Could not get item" })
    }
})

router.get("/find-post", isLoggedIn, async (req, res) => {
    try {
        const notes = await Notes.find({ userId: res.locals.user })
        res.json({ data: notes })
    }
    catch (e) {
        res.status(400).json({ message: "Could not get item" })
    }
})

router.get("/find-post/:id", isLoggedIn, async (req, res) => {
    try {
        const { id } = req.params
        const notes = await Notes.find({ _id: id })
        res.json({ data: notes })
    }
    catch (e) {
        res.status(400).json({ message: "Could not get item" })
    }
})

router.get("/profile", isLoggedIn, async (req, res) => {
    try {
        const { id } = req.params
        const users = await User.find({ username: id })
        res.json({ data: users })
    }
    catch (e) {
        res.status(400).json({ message: "Could not get user" })
    }
})


router.get("/profile/:id", isLoggedIn, async (req, res) => {
    try {
        const { id } = req.params
        const users = await User.find({ username: id })
        res.json({ data: users })
    }
    catch (e) {
        res.status(400).json({ message: "Could not get user" })
    }
})

router.post("/", isLoggedIn, (req, res) => {
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

router.post("/account/login", async (req, res) => {
    const { email, password } = req.body;
    if (email == undefined || password == undefined) return res.status(400).json({ message: "Field(s) not defined" });

    const user = await User.findOne({ email });
    if (user) {
        // @ts-ignore
        const checkPassword = await bcrypt.compare(password, user.password);
        if (checkPassword) {
            // @ts-ignore
            var token = jwt.sign({ user: user.publicId }, process.env.SECRET_KEY || "secret");
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

router.post("/account/signup", async (req, res) => {
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
        const check = await User.findOne().or([{ username }, { email }]);
        if(check){
            return res.status(400).json({ message: "User already exist" });
        }
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


module.exports = router