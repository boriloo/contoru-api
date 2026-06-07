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
import { relationRouter } from './routes/relationRouter';

const app = new Hono<{ Bindings: Bindings }>()

app.use('*', logger());

const corsOptions = {
    origin: (origin: any) => {
        if (!origin) return 'http://localhost:5173';
        const allowedOrigins = [
            'http://localhost:5173',
            'http://localhost:4173',
            'https://project-cr2dn.vercel.app'
        ];
        return allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
    },
    credentials: true,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'Pragma'],
    exposeHeaders: ['Set-Cookie']
}

app.use('*', cors(corsOptions))

app.use('*', async (c, next) => {
    console.log('Origin recebido:', c.req.header('origin'))
    await next()
})

app.route("/auth", authRouter);
app.route("/user", userRouter);
app.route("/desktop", desktopRouter);
app.route("/file", fileRouter);
app.route("/relation", relationRouter);
app.route("/storage", storageRouter);

export default app;