import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    _id: String,
    post_type: {
        type: String,
        enum: ["QUESTION", "NOTE", "POLL"],
        default: "QUESTION",
    },
    is_private: Boolean,
    is_anonymous: Boolean,
    course: { type: String, ref: "CourseModel" },
    author: { type: String, ref: "UserModel" },
    folder: { type: String, ref: "FolderModel" },
    summary: String,
    details: String,
    folow_ups: [{ type: String, ref: "FollowupModel" }],
    timestamp: Date
},
    { collection: "posts" }
);
export default postSchema;

