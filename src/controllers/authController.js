const db = require("../models");
const bcrypt = require('bcrypt')
const { InvalidCredentialsApiError } = require("../errors/apiErrror")

exports.login = async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    const dbUser = await db.User.findOne({ where: { username: username } })

    if (!dbUser) {
        return next(new InvalidCredentialsApiError());
    }

    const isPasswordValid = await bcrypt.compare(password, dbUser.password);

    if (!isPasswordValid) {
        return next(new InvalidCredentialsApiError());
    }

    req.session.user = {
        id: dbUser.id,
        username: dbUser.username,
        name: dbUser.name
    };

    res.status(200).json({ 
        "message": "Login successful"
    });
};

exports.logout = async (req, res, next) => {
    req.session.destroy();
    res.status(200).json({ 
        "message": "Logout successful"
    });
};