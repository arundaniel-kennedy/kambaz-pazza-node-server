import model from "../Posts/model.js"
import ReplyModel from "./model.js"
import { v4 as uuidv4 } from "uuid";
export default function ReplyDao() {
    async function createReplyToFollowup(postId, followupId, userId, reply) {
        const post = await model.findById(postId);
        const followup = post.follow_ups.id(followupId);
        if (!followup) throw new Error("Followup not found");
        const newReply = { ...reply, _id: uuidv4(), author: userId };
        const createdReply = await ReplyModel.create(newReply);
        followup.replies.push(createdReply);

        await post.save();

        return createdReply;
    }
    async function createReplyToReply(
        postId,
        followupId,
        replyId,
        userId,
        newReply
    ) {
        const post = await model.findById(postId);
        if (!post) throw new Error("Post not found");
        const followup = post.follow_ups.id(followupId);
        if (!followup) throw new Error("Followup not found");

        const reply = followup.replies.id(replyId);
        if (!reply) throw new Error("Reply not found");

        const newReplyWithId = { ...newReply, _id: uuidv4(), author: userId };
        const createdReply = await ReplyModel.create(newReplyWithId);
        reply.replies.push(createdReply);

        await post.save();

        return createdReply;
    }

    return {
        createReplyToFollowup,
        createReplyToReply,
    }
};
