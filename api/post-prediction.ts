import { PostPredictionController } from "controller";
import { Router } from "express";

export const PostPredictionRouter = Router();

//@ts-ignore
PostPredictionRouter.post("/", PostPredictionController.Add)

//@ts-ignore
PostPredictionRouter.get("/by-host", PostPredictionController.GetByHost)

//@ts-ignore
PostPredictionRouter.get("/:id", PostPredictionController.Get)