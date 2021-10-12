var express = require('express');
const { celebrate, Joi, Segments } = require('celebrate');
const { getAllAccessible, getAccessibleById, create, update, remove } = require('../controllers/notesController');
const { authenticate } = require('../controllers/authController');

var router = express.Router();

const noteIdValidation = {
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.number().required()
    })
  };


router.get(
    "/",
    getAllAccessible
);

router.get(
    "/:id",
    celebrate({
        ...noteIdValidation
    }),
    getAccessibleById
);

// upper methods can be accessible without authentication
router.use(authenticate);

router.post(
    "/",
    celebrate({
        [Segments.BODY]: Joi.object().keys({
            name: Joi.string().required(),
            folder_id: Joi.number().required(),
            heading: Joi.string().required(),
            type: Joi.string().valid("TEXT", "LIST").required(),
            access_policy: Joi.string().valid("PRIVATE", "PUBLIC").required(),
            note_contents: Joi.when('type', {
                is: Joi.string().valid('TEXT'),
                then: Joi.string().required(),
                otherwise: Joi.array().items(Joi.string().required())
            }).required()
        })
      }),
    create
);

router.put(
    "/:id",
    celebrate({
        ...noteIdValidation,
        [Segments.BODY]: Joi.object().keys({
            name: Joi.string().required(),
            folder_id: Joi.number().required(),
            heading: Joi.string().required(),
            type: Joi.string().valid("TEXT", "LIST").required(),
            access_policy: Joi.string().valid("PRIVATE", "PUBLIC").required(),
            note_contents: Joi.when('type', {
                is: Joi.string().valid('TEXT'),
                then: Joi.string().required(),
                otherwise: Joi.array().items(Joi.string().required())
            }).required()
        })
      }),
    update
);

router.delete(
    "/:id",
    celebrate({
        ...noteIdValidation
    }),
    remove
);

module.exports = router;