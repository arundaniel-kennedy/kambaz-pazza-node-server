import ReplyDao from "./dao.js"

export default function ReplyRoutes(app) {
    const dao = ReplyDao();
    const createReplyToFollowup = async (req, res) => {
        try {
            const { postId, followupId } = req.params;
            const userId = req.session["currentUser"]._id;
            if (userId === null) {
                res.status(401).json({ error: "User not found" });
            }
            const reply = req.body;
            const response = await dao.createReplyToFollowup(
                postId,
                followupId,
                userId,
                reply
            );
            res.json(response);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    const createReplyToReply = async (req, res) => {
        try {
            const { postId, followupId, replyId } = req.params;
            const userId = req.session["currentUser"]._id;
            if (userId === null) {
                res.status(401).json({ error: "User not found" });
            }
            const reply = req.body;
            const response = await dao.createReplyToReply(
                postId,
                followupId,
                replyId,
                userId,
                reply
            );
            res.json(response);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    app.post("/api/pazza/posts/:postId/followup/:followupId/reply", createReplyToFollowup);
    app.post(
        "/api/pazza/posts/:postId/followup/:followupId/reply/:replyId",
        createReplyToReply
    );
};
