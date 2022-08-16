import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import postroutes from './routes/postRoutes';

const app = express();

// add cors
app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/posts', postroutes);

app.get('/', (req, res) => {
  return res.send('Hello world!');
});

export default app;
