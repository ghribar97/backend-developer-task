var express = require('express');
const { celebrate, Joi, Segments } = require('celebrate');
const authController = require('../controllers/authController');

var router = express.Router();

router.post(
    "/login",
    celebrate({
        [Segments.BODY]: Joi.object().keys({
            username: Joi.string().required(),
            password: Joi.string().required()
        })
    }),
    authController.login
);

router.get(
    "/logout",
    authController.logout
);

module.exports = router;