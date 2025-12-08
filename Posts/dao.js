import { v4 as uuidv4 } from "uuid";
import model from "./model.js";
export default function PostsDao() {
  async function getAllPostsForCourse(courseId) {
    return await model.find({ course: courseId });
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
  };
}
