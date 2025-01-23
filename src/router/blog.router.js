import express from "express";
import {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getComments,
  getCommentById,
  createComment,
  updateComment,
  deleteComment,
} from "../controller/blog.controller.js";

const router = express.Router();

router.get("/posts", getPosts);
router.get("/posts/:postId", getPostById);
router.post("/posts", createPost);
router.put("/posts/:postId", updatePost);
router.delete("/posts/:postId", deletePost);

router.get("/comments", getComments);
router.get("/comments/:commentId", getCommentById);
router.post("/comments", createComment);
router.put("/comments/:commentId", updateComment);
router.delete("/comments/:commentId", deleteComment);

export default router;