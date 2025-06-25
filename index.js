import express from 'express';
const app=express();
import authRoutes from './routes/auth.route.js';
import postRoutes from './routes/post.route.js';
import commentRoutes from './routes/comment.route.js';
import dotenv from 'dotenv';
import errorHandler from './utils/errorHandler.js';
dotenv.config();

const port=process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth',authRoutes);
app.use('/api/posts',postRoutes);
app.use('/api/posts',commentRoutes);
app.use('/api/comments',commentRoutes);

app.use(errorHandler);
app.listen(port, () => {
    console.log("Server running on port: ", port)
});

export default app;