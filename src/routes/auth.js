var express = require('express');
const { celebrate, Joi, Segments } = require('celebrate');
const { login, logout } = require('../controllers/authController');

var router = express.Router();

router.post(
    "/login",
    celebrate({
        [Segments.BODY]: Joi.object().keys({
            username: Joi.string().required(),
            password: Joi.string().required()
        })
    }),
    login
);

router.get(
    "/logout",
    logout
);

module.exports = router;