import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import signalsRouter from "./signals";
import marketRouter from "./market";
import watchlistRouter from "./watchlist";
import checkoutRouter from "./checkout";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(signalsRouter);
router.use(marketRouter);
router.use(watchlistRouter);
router.use(checkoutRouter);

export default router;
