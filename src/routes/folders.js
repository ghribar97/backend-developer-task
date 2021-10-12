var express = require('express');
const { celebrate, Joi, Segments } = require('celebrate');
const { getAllOwned, getOwnedById, create, update, remove } = require('../controllers/folderController');
const { authenticate } = require('../controllers/authController');

var router = express.Router();
router.use(authenticate);

const folderIdValidation = {
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.number().required()
    })
  };

const folderBodyValidation = {
    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().required()
    })
};

router.get(
    "/",
    getAllOwned
);

router.get(
    "/:id",
    celebrate({
        ...folderIdValidation
    }),
    getOwnedById
);

router.post(
    "/",
    celebrate({
        ...folderBodyValidation
      }),
    create
);

router.put(
    "/:id",
    celebrate({
        ...folderIdValidation,
        ...folderBodyValidation
      }),
    update
);

router.delete(
    "/:id",
    celebrate({
        ...folderIdValidation
    }),
    remove
);

module.exports = router;