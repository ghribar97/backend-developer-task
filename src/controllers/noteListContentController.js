const db = require("../models");
const { NoteType } = require('../types');
const { ApiError } = require("../handlers/apiError");
const { getAccessibleNoteListContent, getNoteForUpdate } = require("../services/persistence/notePersistenceService");

exports.addListContent = async (req, res, next) => {
    const userId = req.session.user.id;
    const noteId = req.params.noteId;
    const { body } = req.body;

    try {
        // check that the note exits
        const note = await getNoteForUpdate(userId, noteId);
        if (note.type === NoteType.TEXT) {
            throw new ApiError(400, `Can not add item to note of type ${NoteType.TEXT}`);
        }
    } catch (err) {
        return next(err);
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

    try {
        var noteContent = await getAccessibleNoteListContent(userId, noteId, contentId);
        
        noteContent.body = body;
        await noteContent.save();
    } catch (err) {
        return next(err);
    }

    res.status(200).json({ 
        "message": "Successfuly updated note content!",
        "data": noteContent
    });
};

exports.deleteListContent = async (req, res, next) => {
    const userId = req.session.user.id;
    const noteId = req.params.noteId;
    const contentId = req.params.id;

    try {
        var noteContent = await getAccessibleNoteListContent(userId, noteId, contentId);
        await noteContent.destroy();
    } catch (err) {
        return next(err);
    }

    res.status(200).json({ 
        "message": "Successfuly deleted note content!",
        "data": noteContent
    });
};