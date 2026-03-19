import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authMiddleware } from "./middlewares/authMiddleware";
import router from "./routes";

const app: Express = express();

const allowedOrigins = [
  process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : "",
  process.env.REPLIT_DEPLOYMENT_URL ? `https://${process.env.REPLIT_DEPLOYMENT_URL}` : "",
  "https://millionaire-mindset-growth--sallyadams.replit.app",
].filter(Boolean);

app.use(
  cors({
    credentials: true,
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.some((o) => origin === o || origin.endsWith(".replit.dev") || origin.endsWith(".replit.app"))) {
        callback(null, origin || true);
      } else {
        callback(null, false);
      }
    },
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(authMiddleware);

app.use("/api", router);

export default app;
