import PostDao from "./dao.js";

export default function PostRoutes(app) {
  
  const dao = PostDao();

  const findAllPosts = async (req, res) => {
    try {
      const posts = await dao.findAllPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const createPost = async (req, res) => {
    try {
      const newPost = await dao.createPost(req.body);
      res.status(201).json(newPost);
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

  app.get("/api/posts", findAllPosts);
  app.post("/api/posts", createPost);
  app.delete("/api/posts/:id", deletePost);

}

