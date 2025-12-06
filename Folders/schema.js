import mongoose from "mongoose";

const FolderSchema = new mongoose.Schema({
    _id: String,
    name: {type: String, unique: true},
    course: { type: String, ref: "CourseModel" }
},
    { collection: "folders" }
);
export default FolderSchema;