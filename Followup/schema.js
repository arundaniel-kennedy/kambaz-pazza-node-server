import mongoose from "mongoose";

const FollowupSchema = new mongoose.Schema({
    _id: String,
    author: { type: String, ref: "UserModel" },
    details: String,
    is_resolved: Boolean,
    timestamp: Date,
    replies: [{ type: String, ref: "ReplyModel" }]
},
    { collection: "posts" }
);
export default FollowupSchema;