import {  IPredictionPostInput } from "@interfaces/prediction";
import { Host, PredictionStatus } from "@prisma/client";
import { database } from "libraries";

const Add = async (data: IPredictionPostInput) => {
    const {
        tweet,
        host,
        remarks,
        prediction
    } = data;

    if (await GetByHost(tweet, host)) {
        throw new Error("❌ Post already exists");
    }
    const predictionDoc = await database.instance?.predictionPost.create({
        data: {
            tweet,
            host,
            remarks,
            prediction: prediction as PredictionStatus,
            keywords: "default" // Assuming "default" as a placeholder for required keywords field
        }
    });
    return predictionDoc;
};

const GetByHost = async (tweet: string, host: Host) => {
    const predictionDoc = await database.instance?.predictionPost.findFirst({
        where: {
            tweet,
            host
        }
    });
    return predictionDoc;
};

const Get = async (id: string) => {
    const predictionDoc = await database.instance?.predictionPost.findFirst({
        where: {
            id
        }
    });
    return predictionDoc;
};

export const PostPredictionService = {
    Add,
    GetByHost,
    Get
};