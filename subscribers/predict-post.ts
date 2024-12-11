import { IPredictionPost } from "@interfaces/prediction";
import axios from "axios";
import { database, IJobProcessor, queue } from "libraries";

export const PredictPost: IJobProcessor<any> = async (job) => {
    try {
        console.log("📥 Received Job:", job);
        console.log("🚀 PredictPost", job);
        const postData = job.data as IPredictionPost;
        console.log("🔍 Extracted Profile Data:", postData);

        let resultDoc;

        try {
            const res = await axios.post('https://sih-post.onrender.com/', {
                postData
            });

            console.log(res, "this is res from ai api");

            resultDoc = res.data.prediction === 0 
                ? { status: "FAKE" } 
                : { status: "REAL" };

            console.log("✅ Prediction Result from ML Model:", resultDoc);
        } catch (error) {
            console.error("❌ Error calling ML model API:", error);
            throw new Error("Failed to get prediction result from ML model API.");
        }

        let predictionRes;
        try {
            predictionRes = await database.instance?.predictionPost.findFirst({
                where: {
                    host: postData.host,
                    tweet: postData.tweet
                }
            });

            if (!predictionRes) {
                console.log("🔄 Prediction not found in the database. Creating a new record...");
                predictionRes = await database.instance?.predictionPost.create({
                    data: {
                        host: postData.host,
                        tweet: postData.tweet,
                        prediction: resultDoc.status as "REAL" | "FAKE",
                        profileInfo: {},
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        keywords: postData.keywords || "" // ✅ Added 'keywords' to satisfy the Prisma schema
                    }
                });
                console.log("✅ New prediction created:", predictionRes);
            } else {
                console.log("✅ Existing prediction found:", predictionRes);
            }
        } catch (error) {
            console.error("❌ Error finding or creating prediction in the database:", error);
            throw new Error("Database operation failed for prediction.");
        }

        try {
            await queue.complete(job.id);
            console.log("✅ Job successfully completed.");
        } catch (error) {
            console.error("❌ Error marking job as complete:", error);
            throw new Error("Failed to mark job as complete.");
        }

        return true;

    } catch (error: any) {
        console.error("❌ Overall error in PredictProfile:", error);
        try {
            await queue.fail(job.id, error.message || "An unknown error occurred.");
            console.log("❌ Job failed and marked as such in the queue.");
        } catch (queueError) {
            console.error("❌ Error marking job as failed in the queue:", queueError);
        }
        return false;
    }
};
