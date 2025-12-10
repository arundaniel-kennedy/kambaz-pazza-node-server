import AnswerDao from "./dao.js";

export default function AnswerRoutes(app) {
    const dao = AnswerDao();

    const answerToPost = async (req, res) => {
        try {
            const { postId } = req.params;
            const userId = req.session["currentUser"]._id;
            if (userId === null) {
                res.status(401).json({ error: "User not found" });
            }
            const answer = req.body;
            const response = await dao.answerToPost(postId, userId, answer);
            res.json(response);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    const editAnswer = async (req, res) => {
        try {
            const { answerId } = req.params;
            const userId = req.session["currentUser"]._id;
            if (userId === null) {
                res.status(401).json({ error: "User not found" });
            }
            const answer = req.body;
            const response = await dao.editAnswer(answerId, userId, answer);
            res.json(response);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    app.post("/api/pazza/posts/:postId/answer", answerToPost);
    app.put("/api/pazza/posts/answer/:answerId", editAnswer);
};
