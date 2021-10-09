const express = require('express');
const config = require("./config/config");
const folders = require("./api/folders");
const notes = require("./api/notes");

const app = express();
app.use('/folders', folders);
app.use("/notes", notes);

const port = config.app.port;
app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
});