const db = require("../../models");
const { Op } = require("sequelize");
const { NoteType, AccessPolicy } = require('../../types');
const { NotFoundApiError } = require("../../handlers/apiError");

exports.getAccessibleNote = async (userId, noteId, details) => {
    var querySpec = { 
        where: {
            [Op.or]: [{access_policy: AccessPolicy.PUBLIC}, {owner_id: userId}],
            id: noteId
        }
    };

    if (details) {
        // add join by associated note contents
        querySpec.include = [ { model: db.NoteContent, as: "note_contents", required: false } ];
    };

    const accessibleNote = await db.Note.findOne(querySpec);

    if (!accessibleNote) {
        throw new NotFoundApiError(`Note with id '${noteId}' does not exists!`);
    }

    return accessibleNote;
};

exports.getAccessibleNoteListContent = async (userId, noteId, contentId, details) => {
    var querySpec = { 
        where: {
            [Op.and]: [{note_id: noteId}, {id: contentId}] 
        }
    };

    if (details) {
        // add join by associated note
        querySpec.include = [ {model: db.Note, reqired: true, where: { [Op.and]: [ {owner_id: userId}, {type: NoteType.LIST} ]}}];
    }

    const noteContent = await db.NoteContent.findOne(querySpec);

    if (!noteContent) {
        throw new NotFoundApiError(`NoteContent with id '${contentId}' does not exists!`);
    }
    return noteContent;
};