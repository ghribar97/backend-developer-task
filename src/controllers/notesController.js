const db = require("../models");
const { Op } = require("sequelize");
const { ApiError } = require("../handlers/apiError");
const { getQueryOptions } = require("../services/apiQueryService");
const { AccessPolicy, NoteType } = require('../types');
const { adaptNoteToDto } = require("../services/adapterService");
const { getAccessibleNote } = require("../services/persistence/notePersistenceService");
const { getAccessibleFolder } = require("../services/persistence/folderPersistenceService");


exports.getAllAccessible = async (req, res, next) => {
    var userId = req.session.user !== null ? req.session.user.id : null;

    const accessibleNotes = await db.Note.findAll({
        where: {
            [Op.or]: [{access_policy: AccessPolicy.PUBLIC}, {owner_id: userId}] 
        },
        ...getQueryOptions(req.query)
    });

    res.status(200).json({ 
        "message": "Successfuly retrieved notes!",
        "data": accessibleNotes.map(note => adaptNoteToDto(note))
    });
};

exports.getAccessibleById = async (req, res, next) => {
    var userId = req.session.user !== null ? req.session.user.id : null;
    const noteId = req.params.id;

    try {
        var accessibleNote = await getAccessibleNote(userId, noteId, true);
    } catch (err) {
        return next(err);
    }

    res.status(200).json({ 
        "message": `Successfuly retrieved note with id ${noteId}!`,
        "data": adaptNoteToDto(accessibleNote)
    });
};

exports.create = async (req, res, next) => {
    const userId = req.session.user.id;
    
    const t = await db.sequelize.transaction();

    try {
        const newNote = await db.Note.create({ owner_id: userId, ...req.body }, { transaction: t });

        const { type, note_content } = req.body;
        if (type === NoteType.TEXT) {
            db.NoteContent.create({     
                body: note_content,
                note_id: newNote.id
            }, {transaction: t});
        }
        else if (type === NoteType.LIST) {
            note_content.forEach(content => {
                db.NoteContent.create({     
                    body: content,
                    note_id: newNote.id
                });
            }, {transaction: t});
        };

        newNote.note_contents = note_content;
    
        await t.commit();
        
        res.status(200).json({ 
            "message": `Successfuly created new note with id ${newNote.id}!`,
            "data": adaptNoteToDto(newNote)
        });

    } catch(error) {
        await t.rollback();
        return next(new ApiError(500, error.message))
    }
};

exports.update = async (req, res, next) => {
    const userId = req.session.user.id;
    const noteId = req.params.id;
    const { name, folder_id, heading, access_policy, body } = req.body;

    try {
        var existingNote = await getAccessibleNote(userId, noteId);
        // validate that the folder exists
        await getAccessibleFolder(userId, folder_id);
    } catch (err) {
        return next(err);
    }

    existingNote.name = name;
    existingNote.folder_id = folder_id;
    existingNote.heading = heading;
    existingNote.access_policy = access_policy;

    const t = await db.sequelize.transaction();

    try {
        db.Note.update(existingNote, {
             where: { note_id: existingNote.id }, 
             transaction: t,
        });

        if (existingNote.type === NoteType.TEXT) {
            db.NoteContent.update(
                { body: body },
                { where: { note_id: existingNote.id }}
            );
        }
        
        await t.commit();
    } catch(error) {
        await t.rollback();
        return next(new ApiError(500, error.message))
    }

    res.status(200).json({ 
        "message": `Successfuly updated note with id ${existingNote.id}!`,
        "data": adaptNoteToDto(existingNote)
    });
};

exports.remove = async (req, res, next) => {
    const userId = req.session.user.id;
    const noteId = req.params.id;

    try {
        var existingNote = await getAccessibleNote(userId, noteId);
        await existingNote.destroy();
    } catch (err) {
        return next(err);
    }

    res.status(200).json({ 
        "message": `Successfuly deleted note with id ${existingNote.id}!`,
        "data": adaptNoteToDto(existingNote)
    });
};