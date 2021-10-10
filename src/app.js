const express = require('express');
const logger = require('morgan');

const app = express();
const port = process.env.PORT;

// Log requests to the console.
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(port, () => {
      console.log(`Now listening on port ${port}`);
});