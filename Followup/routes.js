import FollowupDao from "./dao.js"

export default function FollowupRoutes(app) {
    const dao = FollowupDao();

    const createFollowupToPost = async (req, res) => {
        try {
            const { postId } = req.params;
            const userId = req.session["currentUser"]._id;
            if (userId === null) {
                res.status(401).json({ error: "User not found" });
            }
            const followup = req.body;
            const response = await dao.createFollowupToPost(postId, userId, followup);
            res.json(response);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    app.post("/api/pazza/posts/:postId/followup", createFollowupToPost);
} 