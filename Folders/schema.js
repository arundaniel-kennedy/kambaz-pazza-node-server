import mongoose from "mongoose";

const FolderSchema = new mongoose.Schema({
    _id: String,
    name: String,
    subfolders: [{_id: String, name: String}]
},
    { collection: "folders" }
);
export default FolderSchema;