import { ProfilePredictionRouter } from "@api/profile-prediction";
import { APIFY_API_KEY } from "@config/env";
import { ApifyController } from "controller";
import express from "express";
import { AppLoader } from "libraries";

export const Server = async () => {

    const app = express();

    AppLoader({ app }).catch((e) => console.error(e));

    app.get("/", (req, res) => {
        res.send("Hello World");
    });

    app.get("/v1", (req, res) => {
        res.send("Hello World");
    });

    app.use("/v1/profile", ProfilePredictionRouter)

    //@ts-ignore
    app.post("/webhooks", ApifyController.Webhook)

    return {
        app
    };
}