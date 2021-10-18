const express = require('express');
const config = require("./config/config");
const folders = require("./routes/folders");
const notes = require("./routes/notes");
const noteListContent = require("./routes/noteListContent");
const auth = require("./routes/auth");
const logger = require('morgan');
const cors = require("cors");
const db = require("./models");
const handlers = require("./handlers/handlers")
const cookieParser = require("cookie-parser");
const sessions = require('express-session');

//db.sequelize.sync();
const app = express();

// Log requests to the console.
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

app.use(sessions({
    secret: process.env.SESSION_SECRET || 'my_secret',
    saveUninitialized: false,
    cookie: { 
      maxAge: 1000 * 60 * 60  // one hour
     },
    resave: false 
}));

// cookie parser middleware
app.use(cookieParser());

// routes
app.use('/folders', folders);
app.use("/notes", notes);
app.use("/notes", noteListContent);
app.use("/auth", auth);

// Error handlers
app.use(handlers.celebrateErrorHandling);
app.use(handlers.commonErrorHandling);

const port = process.env.PORT;

app.listen(port, () => {
      console.log(`Now listening on port ${port}`);
});