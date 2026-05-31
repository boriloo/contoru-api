import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { authRouter } from "./routes/authRouter";
import { userRouter } from "./routes/userRouter";
import { desktopRouter } from "./routes/desktopRouter";
import { fileRouter } from "./routes/fileRouter";
import { authMiddleware } from "./middlewares/authMiddleware";
import { Bindings } from './types/bindings'
import { storageRouter } from './routes/storageRouter';

const app = new Hono<{ Bindings: Bindings }>()

app.use('*', logger());

app.use('*', cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:4173'
    ],
    credentials: true,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    exposeHeaders: ['Set-Cookie']
}))

app.route("/auth", authRouter);
app.route("/user", userRouter);
app.route("/desktop", desktopRouter);
app.route("/file", fileRouter);
app.route("/storage", storageRouter);

export default app;