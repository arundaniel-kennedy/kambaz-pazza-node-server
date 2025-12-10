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
    const updateFolderName = async (req, res) => {
        const { folderId } = req.params
        const folderName = req.body.name
        try {
            const status = await dao.updateFolderName(folderId, folderName)
            res.json(status)
        } catch (e) {
            console.log(e)
            res.status(400).json({
                "status": "failed",
                "message": e.errorResponse
            })
        }
    }
    const deleteFolders = async (req, res) => {
        const { courseId } = req.params
        const folderNames = req.body
        const status = await dao.deleteFolders(courseId, folderNames)
        res.sendStatus(200)
    }
    app.put("/api/pazza/:courseId/folders/:folderId", updateFolderName)
    app.put("/api/pazza/:courseId/folders/delete", deleteFolders)
    app.post("/api/pazza/:courseId/folders", createFolderForCourse)
    app.get("/api/pazza/:courseId/folders", findFoldersForCourse)
};
