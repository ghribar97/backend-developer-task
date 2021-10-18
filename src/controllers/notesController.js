const db = require("../models");
const { Op } = require("sequelize");
const { NotFoundApiError, ApiError } = require("../handlers/apiError");
const { getQueryOptions } = require("../services/apiQueryService");
const { AccessPolicy, NoteType } = require('../types');
const { adaptNoteToDto } = require("../services/adapterService");


exports.getAllAccessible = async (req, res, next) => {
    var userId = null;
    if (req.session.user) {
        userId = req.session.user.id;
    }

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
    var userId = null;
    if (req.session.user) {
        userId = req.session.user.id;
    }
    const noteId = req.params.id;

    const accessibleNote = await db.Note.findOne({
        include: [{
            model: db.NoteContent,
            as: "note_contents",
            required: false
        }],
        where: {
            [Op.or]: [{access_policy: AccessPolicy.PUBLIC}, {owner_id: userId}],
            id: noteId
       } 
   });

    if (!accessibleNote) {
        return next(new NotFoundApiError(`Note with id '${noteId}' does not exists!`));
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
        const newNote = await db.Note.create({     
            owner_id: userId,
            ...req.body
        }, {transaction: t});
    
        const { type, note_content } = req.body;
        if (type === NoteType.TEXT) {
            db.NoteContent.create({     
                body: note_content,
                note_id: newNote.id
            }, {transaction: t});
        }
        else if (type === NoteType.LIST) {
            console.log(note_content)
            note_content.forEach(content => {
                db.NoteContent.create({     
                    body: content,
                    note_id: newNote.id
                });
            }, {transaction: t});
        };
        // TODO: else

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

    const existingNote = await db.Note.findOne({ 
        where: {
            [Op.and]: [{id: noteId}, {owner_id: userId}],
       } 
    });

    if (!existingNote) {
        return next(new NotFoundApiError(`Note with id '${noteId}' does not exists!`));
    }

    if (folder_id) {
        const accessibleFolder = await db.Folder.findOne({ 
            where: { 
                [Op.and]: [{owner_id: userId}, {id: folder_id}] 
            } 
        });
    
        if (!accessibleFolder) {
            return next(new NotFoundApiError(`Folder with id '${folder_id}' does not exists!`));
        }
    }

    existingNote.name = name;
    existingNote.folder_id = folder_id;
    existingNote.heading = heading;
    existingNote.access_policy = access_policy;

    const t = await db.sequelize.transaction();

    try {
        db.Note.update(existingNote, {
             where: { note_id: existingNote.id }, 
             transaction: t ,
        })


        if (existingNote.type === NoteType.TEXT) {
            db.NoteContent.update(
                { body: body },
                { where: { note_id: existingNote.id }}
            )
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

    const existingNote = await db.Note.findOne({ 
        where: { 
            [Op.and]: [{owner_id: userId}, {id: noteId}] 
        } 
    });

    if (!existingNote) {
        return next(new NotFoundApiError(`Note with id '${noteId}' does not exists!`));
    }

    await existingNote.destroy();

    res.status(200).json({ 
        "message": `Successfuly deleted note with id ${existingNote.id}!`,
        "data": adaptNoteToDto(existingNote)
    });
};