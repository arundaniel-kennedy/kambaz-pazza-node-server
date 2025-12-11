import { v4 as uuidv4 } from "uuid";
import model from "../Posts/model.js"
import AnswerModel from "./model.js"

export default function AnswerDao() {
    async function studentAnswerToPost(postId, userId, answer) {
        const post = await model.findById(postId);
        const newAnswer = { ...answer, _id: uuidv4(), author: userId };
        post.student_answer = newAnswer._id;
        post.save();
        const createdAnswer = await AnswerModel.create(newAnswer);
        return createdAnswer.populate("author")
    }
    async function instructorAnswerToPost(postId, userId, answer) {
        const post = await model.findById(postId);
        const newAnswer = { ...answer, _id: uuidv4(), author: userId };
        post.instructor_answer = newAnswer._id;
        post.save();
        const createdAnswer = await AnswerModel.create(newAnswer);
        return createdAnswer.populate("author")
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
        return updatedAnswer.populate("author");
    }

    return {
        studentAnswerToPost,
        instructorAnswerToPost,
        editAnswer,
    }
};
