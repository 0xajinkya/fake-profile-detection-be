import { IPrediction } from "@interfaces/prediction";
import { BlockchainService } from "@services/blockchain";
import { database, IJobProcessor, queue } from "libraries";

export const PredictProfile: IJobProcessor<any> = async (job) => {

    console.log(job);

    const profileData = job.data as IPrediction & { feature_vector: number[] };

    console.log(profileData);
    /**
    * @todo : Add logic to predict the profile
    * @how : Send request to the deployed instance of model by passing the `feature_vector` of `profileData` in the body
    * @assumption : The result will be stored in resultDoc.
    */

    const resultDoc = {
        status: "Real"
    };

    /**
     * @todo : Get the profile from the database. It is stored as Prediction in DB. Query in that table to find the Prediction for the hostname and usename and update it's status to the result of this `resultDoc.status` and now take the id of that row along with this prediction and update on the blockchain.
     */

    const predictionRes = await database.instance?.prediction.findFirst({
        where: {
            host: profileData.host,
            username: profileData.username
        }
    });

    if (!predictionRes) {
        return false;
    }

    await database.instance?.prediction.update({
        data: {
            prediction: resultDoc.status as "REAL" | "FAKE"
        },
        where: {
            id: predictionRes.id
        }
    })

    BlockchainService.setPredictionStatus(predictionRes.id, resultDoc.status as "Real" | "Fake");

    await queue.complete(job.id);

    return true;
}