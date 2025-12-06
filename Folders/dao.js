import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export default function PazzaFolderDao() {
    function findFoldersForCourse(courseId) {
        return model.findOne({ "course._id": courseId })
    }
    function createFolder(courseId, folder) {
        const newFolder = { ...folder, _id: uuidv4(), course: courseId };
        return model.create(newFolder);
    }
    return {
        findFoldersForCourse,
        createFolder
    }
};
