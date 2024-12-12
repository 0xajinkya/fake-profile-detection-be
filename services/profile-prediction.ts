import { IPredictionCreate, IPredictionInput, IPredictionUpdate } from "@interfaces/prediction";
import { Host, PredictionStatus } from "@prisma/client";
import { database } from "libraries";
import { FetcherService } from "./fetcher";
import { TwitterResponse } from "@interfaces/tweet";
import { JsonValue } from "@prisma/client/runtime/library";
import { APIFY_API_KEY } from "@config/env";

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

const Search = async (username: string) => {

    console.log(APIFY_API_KEY);
    const profileInfo = await FetcherService.Fetch<TwitterResponse[]>("realDonaldTrump", true);
    // const stats = FetcherService.ExtractStats(profileInfo);

    // const user = profileInfo[0].user;

    // let predictionRes = await GetByHost(user.screen_name, "TWITTER");
    // let predictionDoc: IPredictionCreate;
    // if (!predictionRes) {
    //     predictionDoc = {
    //         createdAt: new Date(),
    //         updatedAt: new Date(),
    //         host: "TWITTER",
    //         username: user.screen_name,
    //         profileInfo: {
    //             user: user,
    //             tweets: profileInfo.map(({ user, ...tweet }) => tweet),
    //             statsForMl: stats
    //         } as unknown as JsonValue
    //     };
    //     predictionRes = await ProfilePredictionService.Add(predictionDoc);
    // } else {
    //     predictionRes = await Update(predictionRes.id, {
    //         profileInfo: {
    //             user: user,
    //             tweets: profileInfo.map(({ user, ...tweet }) => tweet),
    //             statsForMl: stats
    //         } as unknown as JsonValue
    //     });
    // }

    return profileInfo;
};

const Update = async (id: string, data: IPredictionUpdate) => {
    const {
        prediction,
        profileInfo,
        remarks
    } = data;

    const doc: IPredictionUpdate = {};

    if (prediction !== undefined) {
        doc.prediction = prediction as PredictionStatus;
    }
    if (profileInfo !== undefined) {
        doc.profileInfo = profileInfo ?? {};
    }
    if (remarks !== undefined) {
        doc.remarks = remarks as string;
    }

    const predictionRes = await database.instance?.prediction.update({
        where: {
            id: id
        },
        data: doc as any
    })

    return predictionRes;
}

export const ProfilePredictionService = {
    Add,
    GetByHost,
    Get,
    Search,
    Update
};