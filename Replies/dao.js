import model from "../Posts/model.js"

export default function ReplyDao() {
    async function createReplyToFollowup(postId, followupId, userId, reply) {
        const post = await model.findById(postId);
        const followup = post.follow_ups.id(followupId);
        if (!followup) throw new Error("Followup not found");
        const newReply = { ...reply, _id: uuidv4(), author: userId };
        followup.replies.push(newReply);

        await post.save();

        return newReply;
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
        reply.replies.push(newReplyWithId);

        await post.save();

        return newReplyWithId;
    }

    return {
        createReplyToFollowup,
        createReplyToReply,
    }
};
