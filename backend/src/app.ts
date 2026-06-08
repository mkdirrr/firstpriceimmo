import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/auth.routes';
import propertyRoutes from './routes/property.routes';
import contactRoutes from './routes/contact.routes';
import statsRoutes from './routes/stats.routes';
import userRoutes from './routes/user.routes';
import transactionRoutes from './routes/transaction.routes';
import { ensureDbConnected } from './prisma';

dotenv.config();

const app = express();
const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:3000';

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin === allowedOrigin) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy: origin not allowed'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use(async (req, res, next) => {
  if (req.path === '/api/health') {
    return next();
  }

  if (app.locals.dbConnected) {
    return next();
  }

  const dbReady = await ensureDbConnected();

  if (!dbReady) {
    res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    return res.status(503).json({ error: 'Database unavailable. Please check backend database connection.' });
  }

  app.locals.dbConnected = true;
  next();
});

app.get('/api/health', async (req, res) => {
  const dbReady = await ensureDbConnected();
  res.json({ status: 'ok', dbConnected: dbReady });
});

app.get('/', (req, res) => {
  res.json({ message: 'Real Estate API is running.' });
});

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);

app.use((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.status(404).json({ error: 'Not found' });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  const payload: { error: string; details?: string } = {
    error: 'Internal Server Error',
  };

  if (process.env.NODE_ENV !== 'production') {
    payload.details = err.message ?? String(err);
  }

  res.status(err.status || 500).json(payload);
});

export default app;
