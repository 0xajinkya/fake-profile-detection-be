import { IPredictionInput } from "@interfaces/prediction";
import { Host, PredictionStatus } from "@prisma/client";
import { database } from "libraries";

const Add = async (data: IPredictionInput) => {
    const {
        username,
        host,
        remarks,
        prediction
    } = data;

    if (await GetByHost(username, host)) {
        throw new Error("❌ Profile already exists");
    }

    const predictionDoc = await database.instance?.prediction.create({
        data: {
            username,
            host,
            remarks,
            ...(prediction !== undefined && { prediction: prediction as PredictionStatus })
        }
    });
    return predictionDoc;
};

const GetByHost = async (username: string, host: Host) => {
    const predictionDoc = await database.instance?.prediction.findFirst({
        where: {
            username,
            host
        }
    });
    return predictionDoc;
};

const Get = async (id: string) => {
    const predictionDoc = await database.instance?.prediction.findFirst({
        where: {
            id
        }
    });
    return predictionDoc;
};

export const ProfilePredictionService = {
    Add,
    GetByHost,
    Get
};