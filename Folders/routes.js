import PazzaFolderDao from "./dao.js";

export default function PazzaFolderRoutes(app) {
    const dao = PazzaFolderDao();
    const findFoldersForCourse = async (req, res) => {
        const { courseId } = req.params;
        const folders = await dao.findFoldersForCourse(courseId)
        res.json(folders)
    }
    const createFolderForCourse = async (req, res) => {
        const { courseId } = req.params;
        const folderData = req.body
        try {
            const status = await dao.createFolder(courseId, folderData)
            res.json(status)
        } catch (e) {
            console.log(e)
            res.status(400).json({
                "status": "failed",
                "message": e.errorResponse
            })
        }


    }
    app.post("/api/pazza/:courseId/folders", createFolderForCourse)
    app.get("/api/pazza/:courseId/folders", findFoldersForCourse)
};
