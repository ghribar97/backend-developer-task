var express = require('express');
var router = express.Router();

const basePath = "";

router.get(basePath, function (req, res) {
    res.send(`GET ${basePath}`);
});

router.post(basePath, function (req, res) {
    res.send(`POST ${basePath}`);
});

router.put(basePath, function (req, res) {
    res.send(`PUT ${basePath}`);
});

router.delete(basePath, function (req, res) {
    res.send(`DELETE ${basePath}`);
});

module.exports = router;