import { Prediction, PredictionPost, PredictionStatus } from "@prisma/client";
import { Mandatory } from "./common";

/**
 * Type for IPrediction, combining Prisma's Prediction type with a prediction status.
 */
export type IPrediction = Prediction & {
    prediction: PredictionStatus;
};

/**
 * Type for IPredictionPost, reusing the structure of IPrediction.
 */
export type IPredictionPost = PredictionPost &{
    prediction: PredictionStatus
};

/**
 * Input type for creating a new prediction. 
 * Requires 'host' and 'username', omits 'id', 'createdAt', and 'updatedAt'.
 */
export type IPredictionInput = Omit<Mandatory<IPrediction, "host" | "username">, "id" | "createdAt" | "updatedAt">;

/**
 * Type for creating a prediction. 
 * Requires 'id', 'createdAt', 'updatedAt', 'host', and 'username'.
 * 'prediction' is not included as it is expected to be set later.
 */
export type IPredictionCreate = Omit<Mandatory<IPrediction, "id" | "createdAt" | "updatedAt" | "host" | "username">, "prediction">;

/**
 * Type for updating a prediction. 
 * Allows partial updates for most fields except 'id', 'host', 'username', and 'createdAt'.
 */
export type IPredictionUpdate = Omit<Partial<IPrediction>, "id" | "host" | "username" | "createdAt">;

/**
 * Input type for creating a new post prediction. 
 * Requires 'host' and 'tweet', omits 'id', 'createdAt', and 'updatedAt'.
 */
export type IPredictionPostInput = Omit<Mandatory<IPredictionPost, "host" | "tweet">, "id" | "createdAt" | "updatedAt">;

/**
 * Type for creating a post prediction. 
 * Requires 'id', 'createdAt', 'updatedAt', 'host', and 'tweet'.
 * 'prediction' is not included as it is expected to be set later.
 */
export type IPredictionPostCreate = Omit<Mandatory<IPredictionPost, "id" | "createdAt" | "updatedAt" | "host" | "tweet">, "prediction">;

/**
 * Type for updating a post prediction. 
 * Allows partial updates for most fields except 'id', 'host', 'tweet', and 'createdAt'.
 */
export type IPredictionPostUpdate = Omit<Partial<IPredictionPost>, "id" | "host" | "tweet" | "createdAt">;
