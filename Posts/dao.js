import { v4 as uuidv4 } from "uuid";
import model from "./model.js";
import UserModel from "../../Kambaz/Users/model.js";
import AnswerModel from "../Answers/model.js";
export default function PostsDao() {
  async function getAllPostsForCourse(courseId) {
    return await model.find({ course: courseId }).sort({ timestamp: -1 }).populate("author");
  }

  async function getTodayPosts(courseId) {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    return await model.find({
      course: courseId,
      timestamp: { $gte: start, $lte: end },
    });
  }

  async function getYesterdayPosts(courseId) {
    const start = new Date();
    start.setDate(start.getDate() - 1);
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setDate(end.getDate() - 1);
    end.setHours(23, 59, 59, 999);
    return await model.find({
      course: courseId,
      timestamp: { $gte: start, $lte: end },
    });
  }

  async function getLastWeekPosts(courseId) {
    const start = new Date();
    start.setDate(start.getDate() - 7);
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setDate(end.getDate() - 1);
    end.setHours(23, 59, 59, 999);
    return await model.find({
      course: courseId,
      timestamp: { $gte: start, $lte: end },
    });
  }

  /**
   * Function that defines week wise posts.
   * @param {*} courseId gets the posts for that course.
   * @returns a map of week wise posts where the key is the date range and value is the list of posts within that range.
   */
  async function getWeekWisePosts(courseId) {
    //get all posts
    const posts = await getAllPosts(courseId);
    if (posts.length === 0) return {};

    //sort all posts according to dates
    posts.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    //find the first(oldest) post
    const firstDate = new Date(posts[0].timestamp);
    firstDate.setHours(0, 0, 0, 0);

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const lastWeekStart = new Date(yesterday);
    lastWeekStart.setDate(yesterday.getDate() - 6);
    lastWeekStart.setHours(0, 0, 0, 0);

    //get the posts till this day which is 1 day before last week date
    const lastAllowedDate = new Date(lastWeekStart);
    lastAllowedDate.setDate(lastWeekStart.getDate() - 1);
    lastAllowedDate.setHours(23, 59, 59, 999);

    //generate week ranges week 1 first day + 6 days   week 2 irst day + 7 days to first day + 13 ...
    const weekMap = {};
    let weekStart = new Date(firstDate);
    let weekNumber = 1;
    while (weekStart <= lastAllowedDate) {
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      const actualEnd = weekEnd > lastAllowedDate ? lastAllowedDate : weekEnd;

      const key = `Week from ${weekNumber}: ${weekStart
        .toISOString()
        .slice(0, 10)} to ${actualEnd.toISOString().slice(0, 10)}`;

      const weekPosts = posts
        .filter((p) => {
          const ts = new Date(p.timestamp);
          return ts >= weekStart && ts <= actualEnd;
        })
        .map((p) => ({
          summary: p.summary,
          details: p.details,
          timestamp: p.timestamp,
        }));

      weekMap[key] = weekPosts;

      weekStart.setDate(weekStart.getDate() + 7);
      weekStart.setHours(0, 0, 0, 0);
      weekNumber++;
    }

    return weekMap;
  }

  async function getViews(postId) {
    const post = await model.findById({ _id: postId }).populate("read_by");
    return post?.read_by?.length;
  }

  function findAllPostsNameDesc() {
    return model.find({}, { name: 1, description: 1 });
  }
  function createPost(posts) {
    const newPost = { ...posts, _id: uuidv4() };
    return model.create(newPost);
  }

  function deletePost(postId) {
    return model.deleteOne({ _id: postId });
  }

  //edit a post
  async function editPost(postId, postUpdates,userId) {
    const oldPost = await model.findById(postId).populate("author");
    if(!oldPost) {
      throw new Error("Post not found");
    }
    const isInstr = oldPost.author.role === "FACULTY";
    if(!isInstr || oldPost.author._id !== userId) {
      throw new Error("Not authorized to edit this post");
    }
    Object.assign(oldPost, postUpdates);
    oldPost.author = userId;
    oldPost.timestamp = Date.now();

    const updatedPost = await oldPost.save();
    return updatedPost;
  }
  //get post
  async function getPost(postId) {
    const post = await model
      .findById(postId)
      .populate("author")
      .populate("answer");
      return post;
  }

  //record a view
  async function readPost(postId, userId) {
    const post = await model.findById(postId).populate("read_by");
    const alreadyRead = post.read_by.some((user) => user._id === userId);
    const user = await UserModel.findById(userId);
    if (!alreadyRead) {
      post.read_by.push(user);
      await post.save();
    }
    return {
      views: post.read_by.length,
      alreadyRead,
    };
  }

  //replies
  async function createReplyToFollowup(postId, followupId, userId, reply) {
    const post = await model.findById(postId);
    const followup = post.follow_ups.id(followupId);
    if (!followup) throw new Error("Followup not found");
    const newReply = { ...reply, _id: uuidv4(), author: userId };
    followup.replies.push(newReply);

    await post.save();

    return newReply;
  }
  //create a reply to reply
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
  //followup
  async function createFollowupToPost(postId, userId, followup) {
    const post = await model.findById(postId);
    const newFollowup = { ...followup, _id: uuidv4(), author: userId };
    post.follow_ups.push(newFollowup);
    await post.save();
    return newFollowup;
  }

  //answers
  async function answerToPost(postId, userId, answer) {
    const post = await model.findById(postId);
    const newAnswer = { ...answer, _id: uuidv4(), author: userId };
    post.answer.push(newAnswer._id);
    post.save();
    return AnswerModel.create(newAnswer);
  }
  async function editAnswer(answerId, userId, answerUpdates) {
    const oldAnswer = await AnswerModel.findById(answerId).populate("author");
    if (!oldAnswer) {
      throw new Error("Answer not found");
    }
    const isInstr = oldAnswer.author?.role === "FACULTY";
    if (oldAnswer.author._id !== userId || !isInstr) {
      throw new Error("Not authorized to edit this answer");
    }
    Object.assign(oldAnswer, answerUpdates);
    oldAnswer.author = userId;
    oldAnswer.timestamp = Date.now();

    const updatedAnswer = await oldAnswer.save();
    return updatedAnswer;
  }
  return {
    findAllPostsNameDesc,
    createPost,
    deletePost,
    getViews,
    getAllPostsForCourse,
    getTodayPosts,
    getLastWeekPosts,
    getYesterdayPosts,
    getWeekWisePosts,
    getPost,
    readPost,
    createFollowupToPost,
    createReplyToFollowup,
    createReplyToReply,
    editPost,
    answerToPost,
    editAnswer,
  };
}
