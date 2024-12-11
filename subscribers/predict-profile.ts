// import { IPrediction } from "@interfaces/prediction";
// import { InputJsonObject } from "@prisma/client/runtime/library";
// import { BlockchainService } from "@services/blockchain";
// import axios from "axios";
// import { database, IJobProcessor, queue } from "libraries";

// export const PredictProfile: IJobProcessor<any> = async (job) => {

//     console.log(job);

//     const profileData = job.data as IPrediction & { feature_vector: number[] };

//     console.log("i am here",profileData);
//     /**
//     * @todo : Add logic to predict the profile
//     * @how : Send request to the deployed instance of model by passing the `feature_vector` of `profileData` in the body
//     * @assumption : The result will be stored in resultDoc.
//     */

//     // const res = axios.post('https://random-forest-and-decision-tree.onrender.com/predict/random-forest', profileData)

//     // console.log("this is the result ",res)
//     // const resultDoc = {
//     //     status: "Real"
//     // };
//     const res = await axios.post(
//         'https://random-forest-and-decision-tree.onrender.com/predict/random-forest',
//         { feature_vector: profileData.feature_vector }
//       );
//       const resultDoc = {
//         status: res.data?.status || "FAKE", // Default to "FAKE" if no status is returned
//       };

//       console.log("Prediction Result:", resultDoc);

//     /**
//      * @todo : Get the profile from the database. It is stored as Prediction in DB. Query in that table to find the Prediction for the hostname and usename and update it's status to the result of this `resultDoc.status` and now take the id of that row along with this prediction and update on the blockchain.
//      */

//     const predictionRes = await database.instance?.prediction.findFirst({
//         where: {
//             host: profileData.host,
//             username: profileData.username
//         }
//     });


//     if (!predictionRes) {
//         /**
//          * @todo: Create a prediction object if it does not exists!
//          */
//         return false;
//     }

//     /**
//      * @todo: Make an API or run a function to fetch the details of the profile
//     */
//     //Sample profileInfo
//     const profileInfo = {
//         username: profileData.username,
//         host: profileData.host,
//         name: "Min Lee",
//         bio: "I am a software engineer",
//         profile_picture: "https://avatars.githubusercontent.com/u/10028315?v=4",
//         cover_photo: "https://avatars.githubusercontent.com/u/10028315?v=4",
//         location: "Seoul, Korea",
//         website: "https://github.com/minlee",
//         followers: 100,
//         following: 100,
//         posts: 100,
//         media: 100,
//         created_at: "2021-09-01T00:00:00.000Z",
//         updated_at: "2021-09-01T00:00:00.000Z"
//     };

//     await database.instance?.prediction.update({
//         data: {
//             prediction: resultDoc.status as "REAL" | "FAKE",
//             profileInfo: profileInfo as InputJsonObject,
//             updatedAt: new Date()
//         },
//         where: {
//             id: predictionRes.id,
//         }
//     })

//     BlockchainService.setPredictionStatus(predictionRes.id, resultDoc.status as "Real" | "Fake");

//     await queue.complete(job.id);

//     return true;
// }


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
            const res = await axios.post('https://random-forest-and-decision-tree.onrender.com/predict/random-forest', {
                feature_vector: profileData.feature_vector
            });

            console.log(res, "this is res from ai api")

            if (res.data.prediction === 0) {
                resultDoc = {
                    status:  "FAKE" // Default to "FAKE" if status is not returned
                };
            }
            else{

                resultDoc = {
                    status: "REAL" // Default to "FAKE" if status is not returned
                };
            }
            
            console.log("✅ Prediction Result from ML Model:", resultDoc);
        } catch (error) {
            console.error("❌ Error calling ML model API:", error);
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