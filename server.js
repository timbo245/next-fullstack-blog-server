import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import morgan from 'morgan';
import cors from 'cors';

import { readdirSync } from 'fs';

// import authRoutes from './routes/auth.js';

const app = express();

app.use('/api/uploads', express.static('uploads'));

mongoose
  .connect(process.env.DATABASE)
  .then(() => {
    console.log('DB Connected.');
  })
  .catch(err => console.log('There is an error: ', err));

// Middleware
app.use(express.json({ limit: '5mb' }));
app.use(morgan('dev'));
app.use(cors());

// Routes
// app.use('/api', authRoutes);
for (const r of readdirSync('./routes')) {
  app.use('/api', (await import(`./routes/${r}`)).default);
}

app.listen(8000, () => {
  console.log('Server is running on port 8000');
});
