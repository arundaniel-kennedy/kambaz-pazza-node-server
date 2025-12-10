import model from "../Posts/model.js"

export default function AnswerDao() {
    async function answerToPost(postId, userId, answer) {
        const post = await model.findById(postId);
        const newAnswer = { ...answer, _id: uuidv4(), author: userId };
        post.answer.push(newAnswer._id);
        post.save();
        return AnswerModel.create(newAnswer);
    }
    async function editAnswer(answerId, userId, answerUpdates) {
        const oldAnswer = await AnswerModel.findById(answerId).populate("author");
        if (!oldAnswer) {
            throw new Error("Answer not found");
        }
        const isInstr = oldAnswer.author?.role === "FACULTY";
        if (oldAnswer.author._id !== userId || !isInstr) {
            throw new Error("Not authorized to edit this answer");
        }
        Object.assign(oldAnswer, answerUpdates);
        oldAnswer.author = userId;
        oldAnswer.timestamp = Date.now();

        const updatedAnswer = await oldAnswer.save();
        return updatedAnswer;
    }

    return {
        answerToPost,
        editAnswer,
    }
};
