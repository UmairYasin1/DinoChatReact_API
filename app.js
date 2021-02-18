const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const mongoStore = require("connect-mongo")(session);
const methodOverride = require("method-override");
const path = require("path");
const fs = require("fs");
const logger = require("morgan");
var cors = require('cors');
//const socketio = require("socket.io");


const app = express();
const http = require("http").Server(app);
//io = socketio.listen(http);

var useragent = require('express-useragent');

//port setup
const port = process.env.PORT || 5002;

//socket.io

//require("./libs/chatNew.js").sockets(http);
require("./libs/chat.js").sockets(http);

app.use(logger("dev"));

app.use(useragent.express());

app.use(cors());
app.use(cookieParser());

//db connection
//const dbPath = "mongodb://localhost/socketChatDB";
//const dbPath = "mongodb://localhost:27017/DinoChatTest";
const dbPath = "mongodb://umairyasin:03333088323@dinochatcluster-shard-00-00-dtwkz.mongodb.net:27017,dinochatcluster-shard-00-01-dtwkz.mongodb.net:27017,dinochatcluster-shard-00-02-dtwkz.mongodb.net:27017/DinoChatTest?replicaSet=DinoChatCluster-shard-0&ssl=true&authSource=admin";
//const dbPath = `mongodb://github_demo:Pass\#12@ds149511.mlab.com:49511/socketionodejschat`;
mongoose.connect(dbPath, { useNewUrlParser: true });
mongoose.connection.once("open", function() {
  console.log("Database Connection Established Successfully.");
});

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   //res.header('Access-Control-Allow-Credentials', 'true');
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Expose-Headers", "*");
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//   res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Headers', 'Origin, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  next();
});



//http method override middleware
app.use(
  methodOverride(function(req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      var method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

//session setup
const sessionInit = session({
  name: "userCookie",
  secret: "9743-980-270",
  resave: true,
  httpOnly: true,
  saveUninitialized: true,
  store: new mongoStore({ mongooseConnection: mongoose.connection }),
  cookie: { maxAge: 80 * 80 * 800 }
});

app.use(sessionInit);


//public folder as static
app.use(express.static(path.resolve(__dirname, "./public")));

//views folder and setting ejs engine
app.set("views", path.resolve(__dirname, "./app/views"));
app.set("view engine", "ejs");

//parsing middlewares
app.use(bodyParser.json({ limit: "10mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));


//including models files.
fs.readdirSync("./app/models").forEach(function(file) {
  if (file.indexOf(".js")) {
    require("./app/models/" + file);
  }
});

//including controllers files.
fs.readdirSync("./app/controllers").forEach(function(file) {
  if (file.indexOf(".js")) {
    var route = require("./app/controllers/" + file);
    //calling controllers function and passing app instance.
    route.controller(app);
  }
});

//handling 404 error.
app.use(function(req, res) {
  res.status(404).render("message", {
    title: "404",
    msg: "Page Not Found.",
    status: 404,
    error: "",
    user: req.session.user,
    chat: req.session.chat
  });
});

//app level middleware for setting logged in user.

const userModel = mongoose.model("User");

app.use(function(req, res, next) {
  if (req.session && req.session.user) {
    userModel.findOne({ email: req.session.user.email }, function(err, user) {
      if (user) {
        req.user = user;
        delete req.user.password;
        req.session.user = user;
        delete req.session.user.password;
        next();
      }
    });
  } else {
    next();
  }
}); //end of set Logged In User.


http.listen(port, function() {
  console.log("Chat App started at port :" + port);
});
