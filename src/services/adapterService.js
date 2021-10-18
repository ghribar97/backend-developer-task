const { NoteType } = require('../types');

exports.adaptFolderToDto = (folder) => {
    const folderDto = {
        id: folder.id,
        name: folder.name
    }

    if (folder.notes) {
        folderDto.notes = folder.notes.map(note => {
            return {
                id: note.id,
                name: note.name,
            }
        })
    }

    return folderDto;
}

exports.adaptNoteToDto = (note) => {
    const noteDto = {
        id: note.id,
        name: note.name,
        heading: note.heading,
        type: note.type,
        access_policy: note.access_policy,
    }

    if (note.note_contents && note.type === NoteType.TEXT) {
        noteDto.body = note.note_contents[0].body
    }
    else if (note.note_contents && note.type === NoteType.LIST) {
        noteDto.items = note.note_contents.map(nc => {
            return {
                id: nc.id,
                body: nc.body,
            }
        })
    }

    return noteDto;
}