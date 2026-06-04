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
    origin: '*',  // temporário para testar
    credentials: false, // com * não pode usar credentials: true
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