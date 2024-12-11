import { Host } from "@prisma/client";
import { ProfilePredictionService } from "@services/profile-prediction"
import { Request, Response } from "express"
import { queue } from "libraries";

const Add = async (req: Request, res: Response) => {
    const profilePredRes = await ProfilePredictionService.Add(req.body);

    /**
     * @todo: This will be changed as we'll know how the feature_vector will look like
     */
    const someSampleProfileMetadataForPrediction = {
        ...profilePredRes,
        feature_vector: [
            10,
            66,
            321,
            150,
            1,
            0,
            213,
            0,
            1,
            14.390000343,
            1.9700000286,
            0,
            1.5,
            0,
            0,
            0.2068260014,
            230.41285706
        ]
    };

    queue.publish("PREDICT_PROFILE", {
        ...someSampleProfileMetadataForPrediction
    });

    return res.status(201).json({
        status: true,
        content: {
            data: profilePredRes
        }
    })
}

const GetByHost = async (req: Request, res: Response) => {
    const {
        username,
        host
    } = req.query;
    const profilePredRes = await ProfilePredictionService.GetByHost(username as string, host as Host);

    return res.status(200).json({
        status: true,
        content: {
            data: profilePredRes
        }
    })
}

const Get = async (req: Request, res: Response) => {
    const {
        id,
    } = req.params;
    const profilePredRes = await ProfilePredictionService.Get(id as string);

    return res.status(200).json({
        status: true,
        content: {
            data: profilePredRes
        }
    })
}

export const ProfilePredictionController = {
    Add,
    GetByHost,
    Get
}