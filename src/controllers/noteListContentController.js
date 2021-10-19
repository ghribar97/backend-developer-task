const db = require("../models");
const { getAccessibleNoteListContent, getAccessibleNote } = require("../services/persistence/notePersistenceService");

exports.addListContent = async (req, res, next) => {
    const userId = req.session.user.id;
    const noteId = req.params.noteId;
    const { body } = req.body;

    try {
        // check that the note exits
        await getAccessibleNote(userId, noteId);
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