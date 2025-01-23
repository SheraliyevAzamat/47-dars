import fs from "fs/promises";
import path from "path";

const postsFilePath = path.resolve("src/db/blog.json");
const commentsFilePath = path.resolve("src/db/comments.json");

const readPosts = async () => {
  try {
    const data = await fs.readFile(postsFilePath, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
};

const writePosts = async (posts) => {
  await fs.writeFile(postsFilePath, JSON.stringify(posts, null, 2));
};

const readComments = async () => {
  try {
    const data = await fs.readFile(commentsFilePath, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
};

const writeComments = async (comments) => {
  await fs.writeFile(commentsFilePath, JSON.stringify(comments, null, 2));
};

export const getPosts = async (req, res) => {
  const posts = await readPosts();
  res.json(posts);
};

export const getPostById = async (req, res) => {
  const { postId } = req.params;
  const posts = await readPosts();

  const post = posts.find((p) => p.id === parseInt(postId));
  if (!post) {
    return res.status(404).json({ message: "Post topilmadi!" });
  }

  res.json(post);
};

export const createPost = async (req, res) => {
  const { title, content, authorId } = req.body;

  if (!title || !content || !authorId) {
    return res.status(400).json({ message: "Barcha maydonlarni to'ldiring!" });
  }

  const posts = await readPosts();
  const newPost = {
    id: posts.length > 0 ? posts[posts.length - 1].id + 1 : 1,
    title,
    content,
    authorId,
  };

  posts.push(newPost);
  await writePosts(posts);

  res.status(201).json(newPost);
};

export const updatePost = async (req, res) => {
  const { postId } = req.params;
  const { title, content, authorId } = req.body;
  const posts = await readPosts();

  const postIndex = posts.findIndex((p) => p.id === parseInt(postId));
  if (postIndex === -1) {
    return res.status(404).json({ message: "Post topilmadi!" });
  }

  posts[postIndex] = {
    ...posts[postIndex],
    title,
    content,
    authorId,
  };

  await writePosts(posts);
  res.json(posts[postIndex]);
};

export const deletePost = async (req, res) => {
  const { postId } = req.params;
  const posts = await readPosts();
  const comments = await readComments();

  const filteredPosts = posts.filter((p) => p.id !== parseInt(postId));
  const filteredComments = comments.filter((c) => c.postId !== parseInt(postId));

  if (filteredPosts.length === posts.length) {
    return res.status(404).json({ message: "Post topilmadi!" });
  }

  await writePosts(filteredPosts);
  await writeComments(filteredComments);

  res.json({ message: "Post va uning kommentariyalari o'chirildi!" });
};

// Kommentariyalar uchun CRUD
export const getComments = async (req, res) => {
  const comments = await readComments();
  res.json(comments);
};

export const getCommentById = async (req, res) => {
  const { commentId } = req.params;
  const comments = await readComments();

  const comment = comments.find((c) => c.id === parseInt(commentId));
  if (!comment) {
    return res.status(404).json({ message: "Kommentariya topilmadi!" });
  }

  res.json(comment);
};

export const createComment = async (req, res) => {
  const { postId, content, authorId } = req.body;

  if (!postId || !content || !authorId) {
    return res.status(400).json({ message: "Barcha maydonlarni to'ldiring!" });
  }

  const comments = await readComments();
  const newComment = {
    id: comments.length > 0 ? comments[comments.length - 1].id + 1 : 1,
    postId,
    content,
    authorId,
  };

  comments.push(newComment);
  await writeComments(comments);

  res.status(201).json(newComment);
};

export const updateComment = async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;
  const comments = await readComments();

  const commentIndex = comments.findIndex((c) => c.id === parseInt(commentId));
  if (commentIndex === -1) {
    return res.status(404).json({ message: "Kommentariya topilmadi!" });
  }

  comments[commentIndex] = {
    ...comments[commentIndex],
    content,
  };

  await writeComments(comments);
  res.json(comments[commentIndex]);
};

export const deleteComment = async (req, res) => {
  const { commentId } = req.params;
  const comments = await readComments();

  const filteredComments = comments.filter((c) => c.id !== parseInt(commentId));

  if (filteredComments.length === comments.length) {
    return res.status(404).json({ message: "Kommentariya topilmadi!" });
  }

  await writeComments(filteredComments);
  res.json({ message: "Kommentariya o'chirildi!" });
};