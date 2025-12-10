import { v4 as uuidv4 } from "uuid";
import model from "./model.js";
import UserModel from "../../Kambaz/Users/model.js";
import AnswerModel from "../Answers/model.js";

export default function PostsDao() {
  function getAllPostsForCourse(courseId) {
    return model
      .find({ course: courseId })
      .sort({ timestamp: -1 })
      .populate("author")
      .populate("folder")
  }

  function getPost(postId) {
    return model
      .findById(postId)
      .populate("author")
      .populate({ path: 'student_answer.author', model: UserModel })
      .populate({ path: 'instructor_answer.author', model: UserModel })
  }

  function createPost(posts) {
    const newPost = { ...posts, _id: uuidv4() };
    return model.create(newPost);
  }

  async function editPost(postId, postUpdates, userId) {
    const oldPost = await model.findById(postId).populate("author");
    if (!oldPost) {
      throw new Error("Post not found");
    }
    Object.assign(oldPost, postUpdates);
    oldPost.author = userId;
    oldPost.timestamp = Date.now();

    const updatedPost = await oldPost.save();
    return updatedPost;
  }

  function deletePost(postId) {
    return model.deleteOne({ _id: postId });
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

  return {
    getAllPostsForCourse,
    getPost,
    readPost,
    createPost,
    editPost,
    deletePost,
  };
}
