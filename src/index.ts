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

const corsOptions = {
    // 1. Especifique as origens permitidas (sem '*')
    origin: (origin) => {
        const allowedOrigins = [
            'http://localhost:5173',
            'http://localhost:4173',
            'https://project-cr2dn.vercel.app'
        ];
        return allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
    },
    // 2. Mude credentials para true
    credentials: true,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    exposeHeaders: ['Set-Cookie']
}

app.options('*', cors(corsOptions))
app.use('*', cors(corsOptions))

app.use('*', async (c, next) => {
    console.log('Origin recebido:', c.req.header('origin'))
    await next()
})

app.route("/auth", authRouter);
app.route("/user", userRouter);
app.route("/desktop", desktopRouter);
app.route("/file", fileRouter);
app.route("/storage", storageRouter);

export default app;