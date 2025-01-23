import express from "express";
import userRouter from "./router/user.router.js";
import blogRouter from "./router/blog.router.js";

const app = express();

app.use(express.json());

app.use(userRouter);
app.use(blogRouter);

const PORT = 3000;

app.listen(PORT, () => {
	console.log(`Server ishga tushdi.http://localhost:${PORT} `);
});