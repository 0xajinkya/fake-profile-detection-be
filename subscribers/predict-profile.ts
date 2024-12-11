import { IPrediction } from "@interfaces/prediction";
import { InputJsonObject } from "@prisma/client/runtime/library";
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
        /**
         * @todo: Create a prediction object if it does not exists!
         */
        return false;
    }

    /**
     * @todo: Make an API or run a function to fetch the details of the profile
    */
    //Sample profileInfo
    const profileInfo = {
        username: profileData.username,
        host: profileData.host,
        name: "Min Lee",
        bio: "I am a software engineer",
        profile_picture: "https://avatars.githubusercontent.com/u/10028315?v=4",
        cover_photo: "https://avatars.githubusercontent.com/u/10028315?v=4",
        location: "Seoul, Korea",
        website: "https://github.com/minlee",
        followers: 100,
        following: 100,
        posts: 100,
        media: 100,
        created_at: "2021-09-01T00:00:00.000Z",
        updated_at: "2021-09-01T00:00:00.000Z"
    };

    await database.instance?.prediction.update({
        data: {
            prediction: resultDoc.status as "REAL" | "FAKE",
            profileInfo: profileInfo as InputJsonObject,
            updatedAt: new Date()
        },
        where: {
            id: predictionRes.id,
        }
    })

    BlockchainService.setPredictionStatus(predictionRes.id, resultDoc.status as "Real" | "Fake");

    await queue.complete(job.id);

    return true;
}