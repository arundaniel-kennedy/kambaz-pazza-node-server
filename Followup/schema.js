import mongoose from "mongoose";
import ReplySchema from "../Replies/schema";
const FollowupSchema = new mongoose.Schema({
    _id: String,
    author: { type: String, ref: "UserModel" },
    details: String,
    is_resolved: Boolean,
    timestamp: { type: Date, default: Date.now },
    replies: [ReplySchema]
}
);
export default FollowupSchema;