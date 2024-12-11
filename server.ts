import { PostPredictionRouter } from "@api/post-prediction";
import { ProfilePredictionRouter } from "@api/profile-prediction";
import express from "express";
import { AppLoader } from "libraries";

export const Server = async () => {
    const app = express();

    AppLoader({ app }).catch((e) => console.error(e));

    app.get("/", (req, res) => {
        res.send("Hello World");
    });

    app.use("/v1/profile", ProfilePredictionRouter)
    app.use("/v1/post", PostPredictionRouter)

    return {
        app
    };
}