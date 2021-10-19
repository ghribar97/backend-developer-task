const db = require("../models");
const { getQueryOptions } = require("../services/apiQueryService");
const { adaptFolderToDto } = require("../services/adapterService");
const { getAccessibleFolder } = require("../services/persistence/folderPersistenceService");


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

    try {
        var accessibleFolder = await getAccessibleFolder(userId, folderId, true);
    } catch (err) {
        return next(err)
    }

    res.status(200).json({ 
        "message": `Successfuly retrieved folder with id ${folderId}!`,
        "data": adaptFolderToDto(accessibleFolder)
    });
};

exports.create = async (req, res, next) => {
    const userId = req.session.user.id;
    const { name } = req.body;

    try {
        var newFolder = await db.Folder.create({     
            name: name,
            owner_id: userId
        });
    } catch (err) {
        return next(err);
    }

    res.status(200).json({ 
        "message": `Successfuly created new folder with id ${newFolder.id}!`,
        "data": adaptFolderToDto(newFolder)
    });
};

exports.update = async (req, res, next) => {
    const userId = req.session.user.id;
    const folderId = req.params.id;
    const { name } = req.body;

    try {
        var existingFolder = await getAccessibleFolder(userId, folderId);

        existingFolder.name = name;
        await existingFolder.save();
    } catch (err) {
        return next(err);
    }

    res.status(200).json({ 
        "message": `Successfuly updated folder with id ${existingFolder.id}!`,
        "data": adaptFolderToDto(existingFolder)
    });
};

exports.remove = async (req, res, next) => {
    const userId = req.session.user.id;
    const folderId = req.params.id;

    try {
        var existingFolder = await getAccessibleFolder(userId, folderId);
        await existingFolder.destroy();
    } catch (err) {
        return next(err);
    }

    res.status(200).json({ 
        "message": `Successfuly deleted folder with id ${existingFolder.id}!`,
        "data": adaptFolderToDto(existingFolder)
    });
};