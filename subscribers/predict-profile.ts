import { ML_MODEL_ENDPOINT } from "@config/env";
import { IPrediction } from "@interfaces/prediction";
import { InputJsonObject } from "@prisma/client/runtime/library";
import { BlockchainService } from "@services/blockchain";
import axios from "axios";
import { database, IJobProcessor, queue } from "libraries";

export const PredictProfile: IJobProcessor<any> = async (job) => {
    try {
        console.log("📥 Received Job:", job);

        // Extract and log profile data
        const profileData = job.data as IPrediction & { feature_vector: number[] };
        console.log("🔍 Extracted Profile Data:", profileData);

        /**
         * Step 1️⃣: Send feature vector to the ML model API for prediction
         */
        let resultDoc;
        try {
            const res = await axios.post(ML_MODEL_ENDPOINT!, {
                feature_vector: profileData.feature_vector
            });

            if (res.data.prediction === 0) {
                resultDoc = {
                    status: "FAKE" // Default to "FAKE" if status is not returned
                };
            }
            else {

                resultDoc = {
                    status: "REAL" // Default to "FAKE" if status is not returned
                };
            }
        } catch (error) {
            throw new Error("Failed to get prediction result from ML model API.");
        }

        /**
         * Step 2️⃣: Check if a prediction already exists in the database for this profile (host + username)
         */
        let predictionRes;
        try {
            predictionRes = await database.instance?.prediction.findFirst({
                where: {
                    host: profileData.host,
                    username: profileData.username
                }
            });

            if (!predictionRes) {
                console.log("🔄 Prediction not found in the database. Creating a new record...");
                predictionRes = await database.instance?.prediction.create({
                    data: {
                        host: profileData.host,
                        username: profileData.username,
                        prediction: resultDoc.status as "REAL" | "FAKE",
                        profileInfo: {},
                        createdAt: new Date(),
                        updatedAt: new Date()
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

        /**
         * Step 3️⃣: Fetch additional profile information
         */
        let profileInfo;
        try {
            // Mocked profile info. Replace this with an actual API call if available.
            profileInfo = {
                username: profileData.username,
                host: profileData.host,
                name: "John Doe",
                bio: "Software Engineer with a passion for AI and ML",
                profile_picture: "https://example.com/profile.jpg",
                cover_photo: "https://example.com/cover.jpg",
                location: "San Francisco, USA",
                website: "https://johndoe.com",
                followers: 1500,
                following: 300,
                posts: 50,
                media: 20,
                created_at: "2022-01-15T00:00:00.000Z",
                updated_at: "2022-09-15T00:00:00.000Z"
            };
            console.log("✅ Fetched profile information successfully:", profileInfo);
        } catch (error) {
            console.error("❌ Failed to fetch profile information. Using default values.", error);
            profileInfo = {};
        }

        /**
         * Step 4️⃣: Update the prediction in the database with the prediction status and profile info
         */
        try {
            await database.instance?.prediction.update({
                data: {
                    prediction: resultDoc.status as "REAL" | "FAKE",
                    profileInfo: profileInfo as InputJsonObject,
                    updatedAt: new Date()
                },
                where: {
                    id: predictionRes.id
                }
            });
            console.log(`✅ Prediction record (ID: ${predictionRes.id}) updated in the database.`);
        } catch (error) {
            console.error("❌ Error updating prediction in the database:", error);
            throw new Error("Failed to update prediction record in the database.");
        }

        /**
         * Step 5️⃣: Update the blockchain with the prediction status
         */
        // try {
        //     await BlockchainService.setPredictionStatus(predictionRes.id, resultDoc.status as "Real" | "Fake");
        //     console.log(`✅ Blockchain updated with status for prediction ID: ${predictionRes.id}`);
        // } catch (error) {
        //     console.error("❌ Failed to update blockchain status for prediction:", error);
        //     throw new Error("Blockchain update failed for prediction.");
        // }

        /**
         * Step 6️⃣: Mark the job as complete
         */
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
            await queue.fail(job.id, error.message || "An unk   nown error occurred.");
            console.log("❌ Job failed and marked as such in the queue.");
        } catch (queueError) {
            console.error("❌ Error marking job as failed in the queue:", queueError);
        }
        return false;
    }
};