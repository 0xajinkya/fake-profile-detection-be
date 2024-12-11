import { Host } from "@prisma/client";
import { PostPredictionService } from "@services/post-prediction";
import { Request, Response } from "express"
import { queue } from "libraries";

const Add = async (req: Request, res: Response) => {
    const postPredRes = await PostPredictionService.Add(req.body);

    /**
     * @todo: This will be changed as we'll know how the feature_vector will look like
     */
    const someSamplePostMetadataForPrediction = {
        ...postPredRes
    };

    queue.publish("PREDICT_PROFILE", {
        ...someSamplePostMetadataForPrediction
    });

    return res.status(201).json({
        status: true,
        content: {
            data: postPredRes
        }
    })
}

const GetByHost = async (req: Request, res: Response) => {
    const {
        tweet,
        host
    } = req.query;
    const postPredRes = await PostPredictionService.GetByHost(tweet as string, host as Host);

    return res.status(200).json({
        status: true,
        content: {
            data: postPredRes
        }
    })
}

const Get = async (req: Request, res: Response) => {
    const {
        id,
    } = req.params;
    const postPredRes = await PostPredictionService.Get(id as string);

    return res.status(200).json({
        status: true,
        content: {
            data: postPredRes
        }
    })
}

export const PostPredictionController = {
    Add,
    GetByHost,
    Get
}