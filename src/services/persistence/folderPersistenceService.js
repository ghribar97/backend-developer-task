const db = require("../../models");
const { Op } = require("sequelize");
const { NotFoundApiError } = require("../../handlers/apiError");

exports.getAccessibleFolder = async (userId, folderId, details) => {
    var querySpec = { 
        where: { [Op.and]: [{owner_id: userId}, {id: folderId}] } 
    };

    if (details) {
        // add join by associated notes
        querySpec.include = [ {model: db.Note, as: "notes", required: false} ];
    }

    const existingFolder = await db.Folder.findOne(querySpec);

    if (!existingFolder) {
        throw new NotFoundApiError(`Folder with id '${folderId}' does not exists!`);
    }

    return existingFolder;
};