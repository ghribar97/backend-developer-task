const db = require("../models");
const { Op } = require("sequelize");
const { NotFoundApiError, ApiError } = require("../handlers/apiError");
const { NoteType } = require('../types');

exports.addListContent = async (req, res, next) => {
    const userId = req.session.user.id;
    const noteId = req.params.noteId;
    const { body } = req.body;

    const accessibleNote = await db.Note.findOne({
        where: {
            [Op.or]: [{owner_id: userId}],
            id: noteId
       } 
   });

   if (!accessibleNote) {
    return next(new NotFoundApiError(`Note with id '${noteId}' does not exists!`));
}

    const noteContent = await db.NoteContent.create({
        note_id: noteId,
        body: body
    });

    res.status(200).json({ 
        "message": "Successfuly added note content to the list!",
        "data": noteContent
    });
};

exports.updateListContent = async (req, res, next) => {
    const userId = req.session.user.id;
    const noteId = req.params.noteId;
    const contentId = req.params.id;
    const { body } = req.body;

    const noteContent = await db.NoteContent.findOne({
        include: [{
            model: db.Note,
            reqired: true,
            where: { [Op.and]: [{owner_id: userId}, {type: NoteType.LIST}] }
        }],
        where: {
            [Op.and]: [{note_id: noteId}, {id: contentId}] 
        }
    });

    
    if (!noteContent) {
        return next(new NotFoundApiError(`NoteContent with id '${contentId}' does not exists!`));
    }

    noteContent.body = body;
    await noteContent.save();

    res.status(200).json({ 
        "message": "Successfuly updated note content!",
        "data": noteContent
    });
};

exports.deleteListContent = async (req, res, next) => {
    const userId = req.session.user.id;
    const noteId = req.params.noteId;
    const contentId = req.params.id;

    const noteContent = await db.NoteContent.findOne({
        include: [{
            model: db.Note,
            required: true,
            where: { [Op.and]: [{owner_id: userId}, {type: NoteType.LIST}] }
        }],
        where: {
            [Op.and]: [{note_id: noteId}, {id: contentId}] 
        }
    });

    
    if (!noteContent) {
        return next(new NotFoundApiError(`NoteContent with id '${contentId}' does not exists!`));
    }

    await noteContent.destroy();

    res.status(200).json({ 
        "message": "Successfuly deleted note content!",
        "data": noteContent
    });
};