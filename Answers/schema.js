import mongoose from "mongoose";

const AnswerSchema = new mongoose.Schema({
    _id: String,
    author: { type: String, ref: "UserModel" },
    details: String,
    timestamp: Date,
},
    { collection: "posts" }
);
export default AnswerSchema;