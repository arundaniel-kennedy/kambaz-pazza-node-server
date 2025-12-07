import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export default function PostDao(db) {
  function findAllPosts() {
    return model.find({}, { name: 1, description: 1 });
  }

function createPost(posts) {
  const newPost = { ...posts, _id: uuidv4() };
  return model.create(newPost);
}


function deletePost(postId) {
   return model.deleteOne({ _id: postId });
 }


  return {
  findAllPosts,
  createPost,
  deletePost,
};

}

