import mongoose from "mongoose";
import schema from "./schema.js";
const model = mongoose.model("PazzaPostsModel", schema);
export default model;