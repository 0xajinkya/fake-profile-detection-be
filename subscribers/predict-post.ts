import { IJobProcessor, queue } from "libraries";

export const PredictPost: IJobProcessor<any> = async (job) => {
    console.log("🚀 PredictPost", job);
    job.data = {};

    /**
     * @todo : Add logic to predict the post
     * @how : Send request to the deployed instance of model by passing the `feature_vector` in the body
     * @assumption : The result will be stored in resultDoc.
    */
    const resultDoc = {
        status: "Fake"
    };

    await queue.complete(job.id);

    if (resultDoc.status === "Fake") {
        /**
        * @todo : Extract the profile related to this post and add it to other queue to process profile
        * @assumption : The `profileInfo` represents the profile that is related to this post and will be passed on to the queue to do the prediction
        */

        const profileInfo = {
            username: "minl",
            host: "TWITTER",
            prediction: "REAL",
        };

        await queue.publish("PREDICT_PROFILE", profileInfo);
    }

    return true;
}