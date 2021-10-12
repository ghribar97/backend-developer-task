const db = require("../models");
const { Op } = require("sequelize");
const { NotFoundApiError, ApiError } = require("../errors/apiErrror")

exports.getAllAccessible = async (req, res, next) => {
    const userId = null;
    if (req.session.user) {
        const userId = req.session.user.id;
    }

    // type is checked in middleware
    const limit = parseInt(req.query.limit) || 5;
    const offset = parseInt(req.query.offset) || 0;
    var order = req.query.order || 'heading';
    var orderType = 'ASC';
    if (order.startsWith('-')) {
        orderType = 'DESC';
        order = order.substring(1);
    }

    const accessibleNotes = await db.Note.findAll({
        where: {
            [Op.or]: [{access_policy: 'PUBLIC'}, {owner_id: userId}] 
        },
        order: [[ order, orderType ]],
        limit:  limit,
        offset: offset
    });

    res.status(200).json({ 
        "message": "Successfuly retrieved notes!",
        "data": accessibleNotes
    });
};

exports.getAccessibleById = async (req, res, next) => {
    const userId = req.session.user.id;
    const noteId = req.params.id;

    const accessibleNote = await db.Note.findOne({
        include: [{
            model: db.NoteContent,
            as: "note_contents",
            required: false
        }],
        where: {
            [Op.or]: [{access_policy: 'PUBLIC'}, {owner_id: userId}],
            id: noteId
       } 
   });

    if (!accessibleNote) {
        return next(new NotFoundApiError(`Note with id '${noteId}' does not exists!`));
    }

    res.status(200).json({ 
        "message": `Successfuly retrieved folder with id ${noteId}!`,
        "data": accessibleNote
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
    
        const { type, note_contents } = req.body;
        if (type === 'TEXT') {
            db.NoteContent.create({     
                body: note_contents,
                note_id: newNote.id
            }, {transaction: t});
        }
        else if (type === 'LIST') {
            note_contents.array.forEach(content => {
                db.NoteContent.create({     
                    body: content,
                    note_id: newNote.id
                });
            }, {transaction: t});
        };
    
        await t.commit();
    } catch(error) {
        await t.rollback();
        return next(new ApiError(500, error.message))
    }

    newNote.note_contents = note_contents;

    res.status(200).json({ 
        "message": `Successfuly created new note with id ${newNote.id}!`,
        "data": newNote
    });
};

exports.update = async (req, res, next) => {
    const userId = req.session.user.id;
    const noteId = req.params.id;
    const { name, folder_id, heading, access_policy, type, note_contents } = req.body;

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
    existingNote.type = type;

    const t = await db.sequelize.transaction();

    try {
        db.Note.update(existingNote, {transaction: t})

        db.NoteContent.destroy({
            where: {
                note_id: noteId
            },
            truncate: true
        }, {transaction: t}
        )

        if (type === 'TEXT') {
            db.NoteContent.create({     
                body: note_contents,
                note_id: existingNote.id
            }, {transaction: t});
        }
        else if (type === 'LIST') {
            note_contents.array.forEach(content => {
                db.NoteContent.create({     
                    body: content,
                    note_id: existingNote.id
                });
            }, {transaction: t});
        };
        
        await t.commit();
    } catch(error) {
        await t.rollback();
        return next(new ApiError(500, error.message))
    }

    res.status(200).json({ 
        "message": `Successfuly updated note with id ${existingNote.id}!`,
        "data": existingNote
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
        "data": existingNote
    });
};