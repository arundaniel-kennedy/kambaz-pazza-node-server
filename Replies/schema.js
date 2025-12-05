import mongoose from "mongoose";

const replySchema = new mongoose.Schema({
    _id: String,
    author: { type: String, ref: "UserModel" },
    details: String,
    timestamp: Date,
    replies: [{ type: String, ref: "ReplyModel" }]
},
    { collection: "posts" }
);
export default replySchema;