const express = require('express');

const app = express();
const port = 8080;

app.get('/', function (req, res) {
    res.send('GET request to homepage')
  })


app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
});