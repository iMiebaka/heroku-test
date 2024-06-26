const express = require("express");
const app = express();

const server = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc"),
  options = require("./docs");
const jwt = require("jsonwebtoken");
const { User } = require("./models")

require("dotenv/config");

const cors = require("cors");
const axios = require("axios");

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.set("view engine", "ejs");

const specs = swaggerJsdoc(options);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));

const v1 = require("./routes/v1");

app.use("", v1);

const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 465,
//   secure: true, // use TLS
//   auth: {
//     user: process.env.EMAIL_USERNAME,
//     pass: process.env.EMAIL_PASSWORD,
//   },
//   tls: {
//     // do not fail on invalid certs
//     rejectUnauthorized: false,
//   },
// });

// verify connection configuration
// transporter.verify(function (error, success) {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log("Server is ready to take our messages");
//   }
// });

// transporter.sendMail({
//   from: '"Miebaka from Grudge 💝" <foo@example.com>', // sender address
//   to: "miebakaiwarri.dev@gmail.com", // list of receivers
//   subject: "Welcome to grudge", // Subject line
//   text: "I see you have some issues to air out, let's hear em", // plain text body
//   html: "<b>Hello world env keys</b>", // html body
// }).then(info => {
//   console.log(info.response);
//   console.log(info.messageId);
// })

const PORT = process.env.PORT || 3001;

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.headers["x-access-token"];

    if (!token) {
      throw new Error("No token provided");
    }
    // Verify and decode the JWT
    const decoded = jwt.verify(token, process.env.SECRET_KEY || "secret");

    // Get the user information from the database
    const user = await User.findOne({ publicId: decoded.user });

    if (!user) {
      throw new Error("User not found");
    }

    // Attach the user object to the socket
    // socket.user = user;
    next();
  } catch (error) {
    console.error("Authentication error", error.message);
    next(new Error("Authentication error"));
  }
});

io.on("connection", function (client) {
  client.on("user_join", function (data) {
    this.username = data;
    client.broadcast.emit("user_join", data);
  });

  client.on("chat_message", function (data) {
    data.username = this.username;
    client.broadcast.emit("chat_message", data);
  });

  client.on("disconnect", function (data) {
    client.broadcast.emit("user_leave", this.username);
  });
});

server.listen(PORT, () => {
  console.log("Server is running on " + PORT);
});
