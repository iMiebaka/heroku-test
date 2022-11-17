const express = require("express")
const app = express()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const server = require('http').createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
// const io = require('socket.io').Server(server);

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require("swagger-jsdoc"),
  options = require("./docs")

require("dotenv/config")



const { Notes, User } = require("./models")
const cors = require("cors");
const axios = require("axios");

app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.set("view engine", "ejs")



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
const specs = swaggerJsdoc(options);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));

app.get("/test-socket", (req, res) => {
  res.render("index")
})


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
    const notes = await Notes.find({ userId: res.locals.user })
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

// const DOMAIN = "https://api.mailgun.net/v3/sandbox79ac47a5e89546bca0eb0096053979ce.mailgun.org"
// // const DOMAIN = "sandbox79ac47a5e89546bca0eb0096053979ce.mailgun.org"
// const apiKey = "key-99cec63ccdaabe701dcc5cc60bb4b1ca"
// const data = {
//   from: `Excited User <mailgun@${DOMAIN}>`,
//   to: "miebakaiwarri.dev@gmail.com",
//   subject: "Hello",
//   text: "Testing some Mailgun awesomness!"
// }

// axios.post(`https://api.mailgun.net/v3/${DOMAIN}/messages`, data,
//   {
//     auth: {
//       username: "api",
//       password: apiKey,
//     },
//     headers: {
//       "Content-Type": "application/x-www-form-urlencoded"
//     }
//   }
// )
//   .then(res => console.log(res))
//   .catch(err => console.log(err.message))

  // curl -s --user 'api:820c467a974326591ccb48c3842222ef-2de3d545-e095ad56' https://api.mailgun.net/v3/sandbox79ac47a5e89546bca0eb0096053979ce.mailgun.org/messages -F from='Excited User <mailgun@https://api.mailgun.net/v3/sandbox79ac47a5e89546bca0eb0096053979ce.mailgun.org>' -F to=YOU@https://api.mailgun.net/v3/sandbox79ac47a5e89546bca0eb0096053979ce.mailgun.org 	-F to=miebakaiwarri@gmail.com -F subject='Hello' -F text='Testing some Mailgun awesomeness!'

// const mailgun = require("mailgun-js");
// const DOMAIN = "sandbox79ac47a5e89546bca0eb0096053979ce.mailgun.org"
// const mg = mailgun({ apiKey: "820c467a974326591ccb48c3842222ef-2de3d545-e095ad56", domain: DOMAIN });
// const data = {
//   from: 'Excited User <me@samples.mailgun.org>',
//   to: 'miebakaiwarri.dev@gmail.com',
//   subject: 'Hello',
//   text: 'Testing some Mailgun awesomness!'
// };
// mg.messages().send(data, function (error, body) {
//   if (error) {
//     console.log(error.message);
//   }
//   else{
//     console.log(body);
//   }
// })
const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // use TLS
  auth: {
    user: "miebakaiwarri.dev@gmail.com",
    pass: "kaqacjgyatgaurqc",
  },
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false,
  },
});


// verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});


transporter.sendMail({
  from: '"Fred Foo 👻" <foo@example.com>', // sender address
  to: "miebakaiwarri@gmail.com", // list of receivers
  subject: "Miebaka's server test", // Subject line
  text: "Trying from the server", // plain text body
  html: "<b>Hello world</b>", // html body
}).then(info => {
  console.log(info.response);
  console.log(info.messageId);
})

const PORT = process.env.PORT || 3001


io.on('connection', function (client) {
  client.on("user_join", function (data) {
    this.username = data;
    client.broadcast.emit("user_join", data);
  });

  client.on("chat_message", function (data) {
    // data.username = this.username;
    client.broadcast.emit("chat_message", data);
  });

  client.on("disconnect", function (data) {
    client.broadcast.emit("user_leave", this.username);
  });
});

server.listen(PORT, () => {
  console.log("Server is running on " + PORT)
})