import { v4 as uuidv4 } from "uuid";
import model from "./model.js";
import CourseModel from "../../Kambaz/Courses/model.js"

export default function PazzaFolderDao() {
    function findFoldersForCourse(courseId) {
        return model.find({ "course": courseId })
    }
    async function createFolder(courseId, folder) {
        if (Array.isArray(folder)) {
            const updatedFolder = folder.map(f => {
                return {
                    _id: uuidv4(), 
                    course: courseId,
                    name: f
                }
            })
            return model.insertMany(updatedFolder)
        } else {
            const newFolder = { ...folder, _id: uuidv4(), course: courseId };
            return model.create(newFolder);
        }
    }
    return {
        findFoldersForCourse,
        createFolder
    }
};
