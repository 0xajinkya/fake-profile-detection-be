import { ProfilePredictionController } from "controller";
import { Router } from "express";

export const ProfilePredictionRouter = Router();

//@ts-ignore
ProfilePredictionRouter.post("/", ProfilePredictionController.Add)

//@ts-ignore
ProfilePredictionRouter.get("/by-host", ProfilePredictionController.GetByHost)

//@ts-ignore
ProfilePredictionRouter.get("/:id", ProfilePredictionController.Get)