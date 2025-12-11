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

    const getPostsBasedOnFolderFilter = async (req, res) => {
        const { folderId } = req.params;
        const posts = await dao.findPostsBasedOnFolderFilter(folderId);
        res.json(posts);
    }

    const getAllFolders = async (req, res) => {
        const folders = await dao.getAllFolders();
        res.json(folders);
    }

    app.put("/api/pazza/:courseId/folders/:folderId", updateFolderName)
    app.put("/api/pazza/:courseId/folders/delete", deleteFolders)
    app.post("/api/pazza/:courseId/folders", createFolderForCourse)
    app.get("/api/pazza/:courseId/folders", findFoldersForCourse)
    app.get("/api/pazza/:courseId/folders/:folderId", getPostsBasedOnFolderFilter)
    app.get("/api/pazza/folders", getAllFolders)
};
