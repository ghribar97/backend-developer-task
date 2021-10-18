var express = require('express');
const { celebrate, Joi, Segments } = require('celebrate');
const { addListContent, updateListContent, deleteListContent } = require('../controllers/noteListContentController');
const { authenticate } = require('../controllers/authController');

var router = express.Router();
router.use(authenticate);

const noteListContentIdValidation = {
    [Segments.PARAMS]: Joi.object().keys({
      noteId: Joi.number().required(),
      id: Joi.number().required(),
    })
  };

router.post(
    "/:noteId/noteList",
    celebrate({
        [Segments.PARAMS]: Joi.object().keys({
            noteId: Joi.number().required()
        }),
        [Segments.BODY]: Joi.object().keys({
            body: Joi.string().required()
        })
      }),
    addListContent
);

router.put(
    "/:noteId/noteList/:id",
    celebrate({
        ...noteListContentIdValidation,
        [Segments.BODY]: Joi.object().keys({
            body: Joi.string().required()
        })
      }),
    updateListContent
);

router.delete(
    "/:noteId/noteList/:id",
    celebrate({
        ...noteListContentIdValidation
    }),
    deleteListContent
);

module.exports = router;