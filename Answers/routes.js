import AnswerDao from "./dao.js";

export default function AnswerRoutes(app) {
    const dao = AnswerDao();

    const studentAnswerToPost = async (req, res) => {
        try {
            const { postId } = req.params;
            const userId = req.session["currentUser"]._id;
            if (userId === null) {
                res.status(401).json({ error: "User not found" });
            }
            const answer = req.body;
            const response = await dao.studentAnswerToPost(postId, userId, answer);
            res.json(response);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
    const instructorAnswerToPost = async (req, res) => {
        try {
            const { postId } = req.params;
            const userId = req.session["currentUser"]._id;
            if (userId === null) {
                res.status(401).json({ error: "User not found" });
            }
            const answer = req.body;
            const response = await dao.instructorAnswerToPost(postId, userId, answer);
            res.json(response);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
    const editAnswer = async (req, res) => {
        try {
            const { answerId } = req.params;
            const currentUser = req.session["currentUser"];
            console.log(currentUser)
            const userId = currentUser._id
            if (userId === null) {
                res.status(401).json({ error: "User not found" });
            }
            const answer = req.body;
            const response = await dao.editAnswer(answerId, userId, answer);
            res.json(response);
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: error.message });
        }
    };

    app.post("/api/pazza/posts/:postId/student_answer", studentAnswerToPost);
    app.post("/api/pazza/posts/:postId/instructor_answer", instructorAnswerToPost);
    app.put("/api/pazza/posts/answer/:answerId", editAnswer);
};
