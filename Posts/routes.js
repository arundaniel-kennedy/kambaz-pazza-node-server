import PostsDao from "./dao.js";

export default function PostRoutes(app) {
  const dao = PostsDao();

  const findAllPosts = async (req, res) => {
    try {
      const posts = await dao.findAllPostsNameDesc();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const createPost = async (req, res) => {
    try {
      userID = req.session["currentUser"];
      if (userId === null) res.status(401).json({ error: "User not found" });
      const newPost = req.body;
      newPostWithUserId = { ...newPost, author: userId };
      const response = await dao.createPost(newPostWithUserId);
      res.status(201).json(response);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const deletePost = async (req, res) => {
    let { id } = req.params;
    try {
      const result = await dao.deletePost(id);
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: "Post not found" });
      }
      res.json({ message: "Post deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const getAllPostsForCourse = async (req, res) => {
    try {
      const { courseId } = req.params
      const posts = await dao.getAllPostsForCourse(courseId);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const getTodayPosts = async (req, res) => {
    try {
      const { courseId } = req.params;
      const posts = await dao.getTodayPosts(courseId);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  const getYesterdayPosts = async (req, res) => {
    try {
      const { courseId } = req.params;
      const posts = await dao.getYesterdayPosts(courseId);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const getLastWeekPosts = async (req, res) => {
    try {
      const { courseId } = req.params;
      const posts = await dao.getLastWeekPosts(courseId);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const getWeekWisePosts = async (req, res) => {
    try {
      const { courseId } = req.params;
      const posts = await dao.getWeekWisePosts(courseId);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const getViews = async (req, res) => {
    try {
      const { postId } = req.params;
      const views = await dao.getViews(postId);
      res.json(views);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const getPost = async (req, res) => {
    try {
      const { postId } = req.params;
      const post = await dao.getPost(postId);
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const editPost = async (req, res) => {
    try {
      const { postId } = req.params;
      const postUpdates = req.body;
      const userId = req.session["currentUser"]._id;
      if (userId === null) {
        res.status(401).json({ error: "User not found" });
      }
      const post = await dao.editPost(postId, postUpdates, userId);
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const readPost = async (req, res) => {
    try {
      const { postId } = req.params;
      const userId = req.session["currentUser"]._id;
      if (userId === null) {
        res.status(401).json({ error: "User not found" });
      }
      const response = await dao.readPost(postId, userId);
      res.json(response);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const createReplyToFollowup = async (req, res) => {
    try {
      const { postId, followupId } = req.params;
      const userId = req.session["currentUser"]._id;
      if (userId === null) {
        res.status(401).json({ error: "User not found" });
      }
      const reply = req.body;
      const response = await dao.createReplyToFollowup(
        postId,
        followupId,
        userId,
        reply
      );
      res.json(response);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const createReplyToReply = async (req, res) => {
    try {
      const { postId, followupId, replyId } = req.params;
      const userId = req.session["currentUser"]._id;
      if (userId === null) {
        res.status(401).json({ error: "User not found" });
      }
      const reply = req.body;
      const response = await dao.createReplyToReply(
        postId,
        followupId,
        replyId,
        userId,
        reply
      );
      res.json(response);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const createFollowupToPost = async (req, res) => {
    try {
      const { postId } = req.params;
      const userId = req.session["currentUser"]._id;
      if (userId === null) {
        res.status(401).json({ error: "User not found" });
      }
      const followup = req.body;
      const response = await dao.createFollowupToPost(postId, userId, followup);
      res.json(response);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const answerToPost = async (req, res) => {
    try {
      const { postId } = req.params;
      const userId = req.session["currentUser"]._id;
      if (userId === null) {
        res.status(401).json({ error: "User not found" });
      }
      const answer = req.body;
      const response = await dao.answerToPost(postId, userId, answer);
      res.json(response);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const editAnswer = async (req, res) => {
    try {
      const { answerId } = req.params;
      const userId = req.session["currentUser"]._id;
      if (userId === null) {
        res.status(401).json({ error: "User not found" });
      }
      const answer = req.body;
      const response = await dao.editAnswer(answerId, userId, answer);
      res.json(response);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  app.get("/api/pazza/posts", findAllPosts);
  app.post("/api/pazza/posts", createPost);
  app.delete("/api/pazza/posts/:id", deletePost);
  app.get("/api/pazza/:courseId/posts", getAllPostsForCourse);
  app.get("/api/pazza/:courseId/posts/today/", getTodayPosts);
  app.get("/api/pazza/:courseId/posts/yesterday", getYesterdayPosts);
  app.get("/api/pazza/:courseId/posts/lastweek", getLastWeekPosts);
  app.get("/api/pazza/:courseId/posts/weekwise", getWeekWisePosts);
  app.get("/api/pazza/posts/views/:postId", getViews);
  app.get("/api/pazza/posts/:postId", getPost);
  app.put("/api/pazza/posts/:postId", editPost);
  app.put("/api/pazza/posts/views/:postId", readPost);
  app.put("/api/pazza/posts/reply/:postId/:followupId", createReplyToFollowup);
  app.put(
    "/api/pazza/posts/reply/:postId/:followupId/:replyId",
    createReplyToReply
  );
  app.put("/api/pazza/posts/followup/:postId", createFollowupToPost);
  app.post("/api/pazza/posts/answer/:postId", answerToPost);
  app.put("/api/pazza/posts/answer/:answerId", editAnswer);
}
