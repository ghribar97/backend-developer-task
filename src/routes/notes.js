var express = require('express');
const { celebrate, Joi, Segments } = require('celebrate');
const { getAllAccessible, getAccessibleById, create, update, remove } = require('../controllers/notesController');
const { authenticate } = require('../controllers/authController');
const { AccessPolicy, NoteType } = require('../types');

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
            type: Joi.string().valid(NoteType.TEXT, NoteType.LIST).required(),
            access_policy: Joi.string().valid(AccessPolicy.PRIVATE, AccessPolicy.PUBLIC).required(),
            body: Joi.when('type', {
                is: Joi.string().valid(NoteType.TEXT),
                then: Joi.string().required(),
            }),
            items: Joi.when('type', {
                is: Joi.string().valid(NoteType.LIST),
                then: Joi.array().items(Joi.string().required()).required(),
            }),
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
            access_policy: Joi.string().valid(AccessPolicy.PRIVATE, AccessPolicy.PUBLIC).required(),
            body: Joi.string()
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