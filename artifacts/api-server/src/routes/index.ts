import { Router, type IRouter } from "express";
import healthRouter from "./health";
import signalsRouter from "./signals";
import marketRouter from "./market";
import watchlistRouter from "./watchlist";

const router: IRouter = Router();

router.use(healthRouter);
router.use(signalsRouter);
router.use(marketRouter);
router.use(watchlistRouter);

export default router;
