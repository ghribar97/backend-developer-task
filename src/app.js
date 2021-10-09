const express = require('express');
const config = require("./config/config");

const app = express();
const port = config.app.port;

app.get('/', function (req, res) {
    res.send('GET request to homepage')
  })


app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
});