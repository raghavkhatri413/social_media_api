import express from 'express';
const app = express();
import authRoutes from './routes/auth.route.js';
import postRoutes from './routes/post.route.js';
import commentRoutes from './routes/comment.route.js';
import dotenv from 'dotenv';
import errorHandler from './utils/errorHandler.js';
import userRoutes from './routes/users.route.js';
import permissionRoutes from './routes/permission.route.js';
import roleRoutes from './routes/role.route.js';
import post_comment_routes from './routes/post_comment.route.js';
import pool from "./db.js";
import cron from "node-cron";
dotenv.config();

import cors from "cors";
import { sendReminderEmailToAllUsers } from './utils/reminderCron.js';
import { ControllerCreateAutomatedPost } from './controllers/post.controller.js';

cron.schedule('* * * * *', () => {
    console.log('Running automated post creation...');
    ControllerCreateAutomatedPost();
});

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/posts', post_comment_routes);
app.use('/api/comments', commentRoutes);
app.use('/api/users', userRoutes);

app.use('/api/roles', roleRoutes);
app.use('/api/permissions', permissionRoutes);

app.get('/api/posts/:post_id', async (req, res) => {
  const { post_id } = req.params;
  try {
    const { rows } = await pool.query(`
      SELECT 
        posts.*, 
        users.username, 
        roles.role_name 
      FROM posts 
      JOIN users ON users.user_id = posts.user_id 
      JOIN roles ON roles.role_id = users.role_id 
      WHERE posts.post_id = $1
    `, [post_id]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.get('/api/permissions/:role_id', async (req, res) => {
  const { role_id } = req.params;
  try {
    const { rows } = await pool.query(`
      SELECT p.permissions 
      FROM permissions p 
      JOIN role_permissions rp ON p.permission_id = rp.permission_id 
      WHERE rp.role_id = $1
    `, [role_id]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.get('/api/users/:user_id', async (req, res) => {
  const { user_id } = req.params;

  try {
    const { rows } = await pool.query(`
      SELECT 
        users.user_id,
        users.username,
        users.role_id,
        roles.role_name
      FROM users
      JOIN roles ON users.role_id = roles.role_id
      WHERE users.user_id = $1
    `, [user_id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching user info:', err);
    res.status(500).send('Server error');
  }
});




app.use(errorHandler);
app.listen(port, () => {
  console.log("Server running on port: ", port)
});

export default app;