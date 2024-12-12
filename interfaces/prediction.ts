import { Prediction, PredictionStatus } from "@prisma/client";
import { Mandatory } from "./common";

export type IPrediction = Prediction & {
    prediction: PredictionStatus;
};

export type IPredictionInput = Omit<Mandatory<IPrediction, "host" | "username">, "id" | "createdAt" | "updatedAt">;

export type IPredictionCreate = Omit<Mandatory<IPrediction, "createdAt" | "updatedAt" | "host" | "username">, "predction">;

export type IPredictionUpdate = Omit<Partial<IPrediction>, "id" | "host" | "username" | "createdAt">