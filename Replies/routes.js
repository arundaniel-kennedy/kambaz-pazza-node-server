import ReplyDao from "./dao.js";

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

    const editReplyToFollowup = async (req, res) => {
        try {
            const { postId, followupId, replyId } = req.params;
            const replyUpdates = req.body;
            const userId = req.session["currentUser"]._id;
            if (userId === null) {
                res.status(401).json({ error: "User not found" });
            }
            const response = await dao.editReplyToFollowup(
                postId,
                followupId,
                replyId,
                userId,
                replyUpdates
            );
            res.json(response);
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    };

    const editReplyToReply = async (req, res) => {
        try {
            const { postId, followupId, parentReplyId, replyId } = req.params;
            const replyUpdates = req.body;
            const userId = req.session["currentUser"]._id;
            if (userId === null) {
                res.status(401).json({ error: "User not found" });
            }
            const response = await dao.editReplyToReply(
                postId,
                followupId,
                parentReplyId,
                replyId,
                userId,
                replyUpdates
            );
            res.json(response);
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    };
    app.put(
        "/api/pazza/posts/:postId/followup/:followupId/reply/:parentReplyId/:replyId",
        editReplyToReply
    );
    app.put(
        "/api/pazza/posts/:postId/followup/:followupId/reply/:replyId",
        editReplyToFollowup
    );

    app.post(
        "/api/pazza/posts/:postId/followup/:followupId/reply",
        createReplyToFollowup
    );
    app.post(
        "/api/pazza/posts/:postId/followup/:followupId/reply/:replyId",
        createReplyToReply
    );
}
