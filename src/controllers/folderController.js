const db = require("../models");
const { Op } = require("sequelize");
const { NotFoundApiError } = require("../handlers/apiError")
const { getQueryOptions } = require("../services/apiQueryService");
const { adaptFolderToDto } = require("../services/adapterService");

exports.getAllOwned = async (req, res, next) => {
    const userId = req.session.user.id;
    
    const accessibleFolders = await db.Folder.findAll({ 
        where: { owner_id: userId },         
        ...getQueryOptions(req.query)
    });

    res.status(200).json({ 
        "message": "Successfuly retrieved folders!",
        "data": accessibleFolders.map(folder => adaptFolderToDto(folder))
    });
};

exports.getOwnedById = async (req, res, next) => {
    const userId = req.session.user.id;
    const folderId = req.params.id;

    const accessibleFolder = await db.Folder.findOne({ 
        include: [{
            model: db.Note,
            as: "notes",
            required: false
        }],
        where: { 
            [Op.and]: [{owner_id: userId}, {id: folderId}] 
        } 
    });

    if (!accessibleFolder) {
        return next(new NotFoundApiError(`Folder with id '${folderId}' does not exists!`));
    }

    res.status(200).json({ 
        "message": `Successfuly retrieved folder with id ${folderId}!`,
        "data": adaptFolderToDto(accessibleFolder)
    });
};

exports.create = async (req, res, next) => {
    const userId = req.session.user.id;
    const { name } = req.body;

    const newFolder = await db.Folder.create({     
        name: name,
        owner_id: userId
    });

    res.status(200).json({ 
        "message": `Successfuly created new folder with id ${newFolder.id}!`,
        "data": adaptFolderToDto(newFolder)
    });
};

exports.update = async (req, res, next) => {
    const userId = req.session.user.id;
    const folderId = req.params.id;
    const { name } = req.body;

    const existingFolder = await db.Folder.findOne({ 
        where: { 
            [Op.and]: [{owner_id: userId}, {id: folderId}] 
        } 
    });

    if (!existingFolder) {
        return next(new NotFoundApiError(`Folder with id '${folderId}' does not exists!`));
    }

    existingFolder.name = name;
    await existingFolder.save();

    res.status(200).json({ 
        "message": `Successfuly updated folder with id ${existingFolder.id}!`,
        "data": adaptFolderToDto(existingFolder)
    });
};

exports.remove = async (req, res, next) => {
    const userId = req.session.user.id;
    const folderId = req.params.id;

    const existingFolder = await db.Folder.findOne({ 
        where: { 
            [Op.and]: [{owner_id: userId}, {id: folderId}] 
        } 
    });

    if (!existingFolder) {
        return next(new NotFoundApiError(`Folder with id '${folderId}' does not exists!`));
    }

    await existingFolder.destroy();

    res.status(200).json({ 
        "message": `Successfuly deleted folder with id ${existingFolder.id}!`,
        "data": adaptFolderToDto(existingFolder)
    });
};