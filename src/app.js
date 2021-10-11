const express = require('express');
const config = require("./config/config");
const folders = require("./api/folders");
const notes = require("./api/notes");
const logger = require('morgan');

const app = express();

app.use('/folders', folders);
app.use("/notes", notes);

const port = process.env.PORT;

// Log requests to the console.
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(port, () => {
      console.log(`Now listening on port ${port}`);
});