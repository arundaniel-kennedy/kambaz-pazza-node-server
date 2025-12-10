import { v4 as uuidv4 } from "uuid";
import FollowupModel from "./model.js";
import UserModel from "../../Kambaz/Users/model.js";
import model from "../Posts/model.js"

export default function FollowupDao() {
    async function createFollowupToPost(postId, userId, followup) {
        const post = await model.findById(postId);
        const newFollowup = { ...followup, _id: uuidv4(), author: userId };
        const createdFollowup = await FollowupModel.create(newFollowup);
        post.follow_ups.push(createdFollowup);
        await post.save();
        return createdFollowup;
    }

    return {
        createFollowupToPost
    }
}