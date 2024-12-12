import { IPredictionCreate } from "@interfaces/prediction";
import { TwitterResponse } from "@interfaces/tweet";
import { JsonValue } from "@prisma/client/runtime/library";
import { BlockchainService } from "@services/blockchain";
import { FetcherService } from "@services/fetcher"
import { ProfilePredictionService } from "@services/profile-prediction";
import { Request, Response } from "express";

const Webhook = async (req: Request, res: Response) => {
    switch (req.body.eventType) {
        case "ACTOR.RUN.SUCCEEDED":
            console.log("🚀 Actor run succeeded");
            //@ts-ignore
            const {
                items
            }: {
                items: TwitterResponse[]
            } = await FetcherService.client.dataset(req.body.resource.defaultDatasetId).listItems();

            const stats = FetcherService.ExtractStats(items);
            const user = items[0].user;

            const featureVector = Object.values(stats);

            // This will look like the following:
            // [
            //     62227,
            //     207187857,
            //     871,
            //     44,
            //     1,
            //     0,
            //     52.4,
            //     0,
            //     0.4,
            //     0.013401538778404373,
            //     0.0005210377749116831,
            //     0
            //   ]

            let predictionRes = await ProfilePredictionService.GetByHost(items[0].user.screen_name, "TWITTER");
            let predictionDoc: IPredictionCreate;
            /**
             * @todo: Uncomment to request to the deployed model to predict!
             */
            // const predictionResponse = (await axios.post('https://random-forest-and-decision-tree.onrender.com/predict/random-forest', {
            //     feature_vector: featureVector
            // })).data.status;

            if (!predictionRes) {
                predictionDoc = {
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    host: "TWITTER",
                    username: user.screen_name,
                    profileInfo: {
                        user: user,
                        tweets: items.map(({ user, ...tweet }) => tweet),
                        statsForMl: stats
                    } as unknown as JsonValue,
                    // prediction: predictionResponse
                    prediction: "REAL"
                };
                predictionRes = await ProfilePredictionService.Add(predictionDoc);
            } else {
                predictionRes = await ProfilePredictionService.Update(predictionRes.id, {
                    profileInfo: {
                        user: user,
                        tweets: items.map(({ user, ...tweet }) => tweet),
                        statsForMl: stats
                    } as unknown as JsonValue,
                    // prediction: predictionResponse
                    prediction: "REAL"
                });
            }

            try {
                // await BlockchainService.setPredictionStatus(predictionRes!.id, predictionResponse as "Real" | "Fake");
                await BlockchainService.setPredictionStatus(predictionRes!.id, ("REAL"[0].toLocaleUpperCase() + "REAL".slice(1).toLocaleLowerCase()) as "Real" | "Fake");

                console.log(`✅ Blockchain updated with status for prediction ID: ${predictionRes!.id}`);
            } catch (error) {
                console.error("❌ Failed to update blockchain status for prediction:", error);
                // throw new Error("Blockchain update failed for prediction.");
            }
            break;
    }
    return res.status(200).json({
        status: true,
        content: {
            data: "ok"
        }
    })
}

export const ApifyController = {
    Webhook
}