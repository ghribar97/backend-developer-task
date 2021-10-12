const db = require("../models");
const bcrypt = require('bcrypt')
const { InvalidCredentialsApiError, UnauthorizedApiError } = require("../errors/apiErrror")

exports.login = async (req, res, next) => {
    const { username, password } = req.body;

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
        "message": "Login successful!"
    });
};

exports.logout = async (req, res, next) => {
    req.session.destroy();
    res.status(200).json({ 
        "message": "Logout successful!"
    });
};

exports.authenticate = async (req, res, next) => {
    const user = req.session.user;

    if (!user) {
        return next(new UnauthorizedApiError);
    }
    next();
}